import { Router, type IRouter } from "express";
import multer from "multer";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import os from "os";

const execFileAsync = promisify(execFile);
const FFMPEG_MAX_BUFFER = 50 * 1024 * 1024;
const router: IRouter = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(os.tmpdir(), "bls-video");
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".mp4";
      cb(null, `upload-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are accepted"));
    }
  },
});

router.post("/video/remove-logo", upload.single("video"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No video file uploaded" });
    return;
  }

  const x = parseInt(req.body.x ?? "0", 10);
  const y = parseInt(req.body.y ?? "0", 10);
  const w = parseInt(req.body.w ?? "160", 10);
  const h = parseInt(req.body.h ?? "80", 10);

  const inputPath = req.file.path;
  const ext = path.extname(req.file.originalname) || ".mp4";
  const outputPath = inputPath.replace(/\.[^.]+$/, `-clean${ext}`);

  try {
    req.log.info({ x, y, w, h, inputPath, outputPath }, "Starting logo removal");

    await execFileAsync("ffmpeg", [
      "-y",
      "-i", inputPath,
      "-vf", `delogo=x=${x}:y=${y}:w=${w}:h=${h}`,
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", "23",
      "-c:a", "copy",
      outputPath,
    ], { maxBuffer: FFMPEG_MAX_BUFFER });

    const originalName = path.basename(req.file.originalname, ext);
    const downloadName = `${originalName}-no-logo${ext}`;

    res.setHeader("Content-Type", req.file.mimetype || "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);

    const stream = fs.createReadStream(outputPath);
    stream.pipe(res);
    stream.on("end", () => {
      fs.unlink(inputPath, () => {});
      fs.unlink(outputPath, () => {});
    });
    stream.on("error", (err) => {
      req.log.error(err, "Stream error sending processed video");
      if (!res.headersSent) res.status(500).json({ error: "Failed to send processed video" });
    });
  } catch (err) {
    req.log.error(err, "FFmpeg logo removal failed");
    fs.unlink(inputPath, () => {});
    fs.unlink(outputPath, () => {});
    res.status(500).json({ error: "Video processing failed", detail: String(err) });
  }
});

router.post("/video/probe", upload.single("video"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No video file uploaded" });
    return;
  }

  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v", "quiet",
      "-print_format", "json",
      "-show_streams",
      req.file.path,
    ], { maxBuffer: FFMPEG_MAX_BUFFER });
    const info = JSON.parse(stdout);
    const video = info.streams?.find((s: { codec_type: string }) => s.codec_type === "video");
    fs.unlink(req.file.path, () => {});
    res.json({
      width: video?.width ?? 1920,
      height: video?.height ?? 1080,
      duration: parseFloat(video?.duration ?? "0"),
    });
  } catch (err) {
    req.log.error(err, "ffprobe failed");
    fs.unlink(req.file?.path ?? "", () => {});
    res.status(500).json({ error: "Could not read video metadata" });
  }
});

export default router;
