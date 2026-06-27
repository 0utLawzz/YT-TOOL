import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Scissors, Download, Info, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface VideoMeta {
  width: number;
  height: number;
}

type Step = "upload" | "select" | "processing" | "done";

const DISPLAY_W = 640;

export default function LogoRemover() {
  const [step, setStep] = useState<Step>("upload");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<VideoMeta>({ width: 1920, height: 1080 });
  const [region, setRegion] = useState<Region>({ x: 10, y: 10, w: 180, h: 90 });
  const [dragging, setDragging] = useState<null | "move" | "resize">(null);
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, rx: 0, ry: 0, rw: 0, rh: 0 });
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("video-no-logo.mp4");
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const displayH = Math.round((DISPLAY_W / videoMeta.width) * videoMeta.height);
  const scaleX = videoMeta.width / DISPLAY_W;
  const scaleY = videoMeta.height / displayH;

  const dispRegion = {
    x: region.x / scaleX,
    y: region.y / scaleY,
    w: region.w / scaleX,
    h: region.h / scaleY,
  };

  const clampRegion = useCallback((r: Region, meta: VideoMeta): Region => ({
    x: Math.max(0, Math.min(r.x, meta.width - r.w)),
    y: Math.max(0, Math.min(r.y, meta.height - r.h)),
    w: Math.max(20, Math.min(r.w, meta.width)),
    h: Math.max(20, Math.min(r.h, meta.height)),
  }), []);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast({ title: "Invalid file", description: "Please select a video file.", variant: "destructive" });
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.src = url;
    vid.onloadedmetadata = () => {
      setVideoMeta({ width: vid.videoWidth || 1920, height: vid.videoHeight || 1080 });
      setRegion({ x: 10, y: 10, w: 180, h: 90 });
      setStep("select");
    };
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const getCanvasPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onMouseDown = (e: React.MouseEvent, type: "move" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = getCanvasPos(e);
    setDragging(type);
    setDragStart({ mx: x, my: y, rx: region.x, ry: region.y, rw: region.w, rh: region.h });
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const { x, y } = getCanvasPos(e);
    const dx = (x - dragStart.mx) * scaleX;
    const dy = (y - dragStart.my) * scaleY;

    if (dragging === "move") {
      setRegion(clampRegion({
        x: dragStart.rx + dx,
        y: dragStart.ry + dy,
        w: dragStart.rw,
        h: dragStart.rh,
      }, videoMeta));
    } else {
      setRegion(clampRegion({
        x: dragStart.rx,
        y: dragStart.ry,
        w: Math.max(20, dragStart.rw + dx),
        h: Math.max(20, dragStart.rh + dy),
      }, videoMeta));
    }
  }, [dragging, dragStart, scaleX, scaleY, videoMeta, clampRegion]);

  const onMouseUp = () => setDragging(null);

  const handleProcess = async () => {
    if (!videoFile) return;
    setStep("processing");
    setProgress(0);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("x", String(Math.round(region.x)));
    formData.append("y", String(Math.round(region.y)));
    formData.append("w", String(Math.round(region.w)));
    formData.append("h", String(Math.round(region.h)));

    try {
      const response = await axios.post("/api/video/remove-logo", formData, {
        responseType: "blob",
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 40));
        },
        onDownloadProgress: (e) => {
          if (e.total) setProgress(40 + Math.round((e.loaded / e.total) * 60));
          else setProgress((p) => Math.min(p + 1, 95));
        },
      });

      const blob = new Blob([response.data], { type: response.headers["content-type"] || "video/mp4" });
      const url = URL.createObjectURL(blob);
      const disposition = response.headers["content-disposition"] ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      setDownloadName(match?.[1] ?? `${videoFile.name.replace(/\.[^.]+$/, "")}-no-logo.mp4`);
      setDownloadUrl(url);
      setProgress(100);
      setStep("done");
    } catch {
      toast({ title: "Processing failed", description: "FFmpeg could not process the video. Try a smaller file or different format.", variant: "destructive" });
      setStep("select");
    }
  };

  const reset = () => {
    setStep("upload");
    setVideoFile(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-display text-[#9B00FF]">
          <Scissors className="inline w-8 h-8 mr-2" />
          Logo Remover
        </h2>
        <p className="text-muted-foreground text-lg">
          Upload your video, drag the box over the logo, and get a clean version back.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          >
            <div
              data-testid="drop-zone"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-primary/40 hover:border-primary rounded-3xl p-16 text-center cursor-pointer transition-all hover:bg-primary/5 group"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="mb-4 flex justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
              </motion.div>
              <p className="text-xl font-bold text-foreground mb-2">Drop your video here</p>
              <p className="text-muted-foreground">or click to browse — MP4, MOV, WebM supported · up to 500 MB</p>
              <input
                ref={fileInputRef}
                data-testid="input-video-file"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 space-y-1">
                <p className="font-bold">How this works</p>
                <p>FFmpeg's <strong>delogo</strong> filter blurs and reconstructs the pixels behind your logo using surrounding content. It works best on logos on plain or simple backgrounds (like a corner watermark). Results may vary on complex backgrounds.</p>
              </div>
            </div>
          </motion.div>
        )}

        {step === "select" && videoUrl && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-lg border border-white/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">Drag the box to cover your logo exactly</p>
                <div className="flex gap-2 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
                  <span>Position: {Math.round(region.x)}, {Math.round(region.y)}</span>
                  <span>·</span>
                  <span>Size: {Math.round(region.w)}×{Math.round(region.h)}px</span>
                </div>
              </div>

              <div
                ref={canvasRef}
                data-testid="video-canvas"
                className="relative rounded-xl overflow-hidden select-none cursor-crosshair"
                style={{ width: DISPLAY_W, height: displayH, maxWidth: "100%" }}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover pointer-events-none"
                  muted
                  playsInline
                />

                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                <div
                  data-testid="logo-region-box"
                  className="absolute border-2 border-yellow-400 bg-yellow-400/20 rounded cursor-move"
                  style={{
                    left: dispRegion.x,
                    top: dispRegion.y,
                    width: dispRegion.w,
                    height: dispRegion.h,
                  }}
                  onMouseDown={(e) => onMouseDown(e, "move")}
                >
                  <div className="absolute -top-6 left-0 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Logo region — drag to move
                  </div>

                  <div
                    data-testid="resize-handle"
                    className="absolute -bottom-2 -right-2 w-5 h-5 bg-yellow-400 border-2 border-white rounded-full cursor-se-resize"
                    onMouseDown={(e) => onMouseDown(e, "resize")}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Video: <strong>{videoMeta.width}×{videoMeta.height}px</strong> · File: <strong>{videoFile?.name}</strong>
              </p>
            </div>

            <div className="flex gap-3">
              <Button data-testid="button-reset" variant="outline" onClick={reset} className="rounded-full">
                Choose different video
              </Button>
              <Button
                data-testid="button-process"
                onClick={handleProcess}
                className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-8 flex-1"
              >
                <Scissors className="w-4 h-4 mr-2" />
                Remove Logo
              </Button>
            </div>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center space-y-8 py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary mx-auto flex items-center justify-center"
            >
              <Loader className="w-8 h-8 text-primary" />
            </motion.div>

            <div className="space-y-3 max-w-sm mx-auto">
              <p className="text-2xl font-display text-primary">Processing video...</p>
              <p className="text-muted-foreground text-sm">
                {progress < 40 ? "Uploading video to server..." : progress < 95 ? "FFmpeg is removing the logo..." : "Almost done..."}
              </p>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{progress}%</p>
            </div>
          </motion.div>
        )}

        {step === "done" && downloadUrl && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center space-y-8 py-8"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            <div className="space-y-2">
              <p className="text-3xl font-display text-green-600">Logo removed!</p>
              <p className="text-muted-foreground">Your clean video is ready to download.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                data-testid="link-download-video"
                href={downloadUrl}
                download={downloadName}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Clean Video
              </a>
              <Button data-testid="button-process-another" variant="outline" onClick={reset} className="rounded-full px-8">
                Process another video
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-md mx-auto flex gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                <strong>Going forward:</strong> Simply export new videos without the logo overlay in your editing software to avoid needing to remove it each time.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
