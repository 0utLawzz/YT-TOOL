import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ExternalLink, Search, Filter, RefreshCw,
  CheckCircle, Clock, AlertCircle, Youtube, Tag, Hash
} from "lucide-react";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVb0z4A9NmkELhc1NZ_9RUOTQc4zVxYOda4jiB08_RTeEtlFI3ce0UX0_fnFPrtccgYB0aT2Kh809-/pub?gid=1351870072&single=true&output=csv";

interface Story {
  row: string;
  status: string;
  category: string;
  title: string;
  description: string;
  character: string;
  hashtags: string;
  seoTags: string;
  dashboardStatus: string;
  videoDriveLink: string;
  thumbnailDriveLink: string;
  reviewNotes: string;
  scheduleDateTime: string;
  youtubeLink: string;
  uploadError: string;
}

function parseCSV(text: string): Story[] {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];

  const stories: Story[] = [];
  let i = 1;

  while (i < lines.length) {
    let row = lines[i];
    if (!row.trim()) { i++; continue; }

    // Handle quoted fields spanning multiple lines
    while ((row.match(/"/g) || []).length % 2 !== 0 && i + 1 < lines.length) {
      i++;
      row += "\n" + lines[i];
    }

    const fields = parseCSVRow(row);
    if (fields.length < 5 || !fields[0]) { i++; continue; }

    stories.push({
      row: fields[0] ?? "",
      status: fields[1] ?? "",
      category: fields[2] ?? "",
      title: fields[3] ?? "",
      description: fields[4] ?? "",
      character: fields[5] ?? "",
      hashtags: fields[6] ?? "",
      seoTags: fields[7] ?? "",
      dashboardStatus: fields[8] ?? "",
      videoDriveLink: fields[9] ?? "",
      thumbnailDriveLink: fields[10] ?? "",
      reviewNotes: fields[11] ?? "",
      scheduleDateTime: fields[12] ?? "",
      youtubeLink: fields[13] ?? "",
      uploadError: fields[15] ?? "",
    });
    i++;
  }
  return stories;
}

function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: typeof CheckCircle }> = {
  published: { bg: "bg-green-100 text-green-700 border-green-200", text: "Published", icon: CheckCircle },
  ready: { bg: "bg-blue-100 text-blue-700 border-blue-200", text: "Ready", icon: Clock },
  draft: { bg: "bg-gray-100 text-gray-600 border-gray-200", text: "Draft", icon: Clock },
  default: { bg: "bg-amber-100 text-amber-700 border-amber-200", text: "Pending", icon: AlertCircle },
};

const CATEGORY_COLORS: Record<string, string> = {
  humor: "bg-pink-100 text-pink-700",
  emotions: "bg-purple-100 text-purple-700",
  adventure: "bg-orange-100 text-orange-700",
  friendship: "bg-sky-100 text-sky-700",
  nature: "bg-green-100 text-green-700",
  default: "bg-yellow-100 text-yellow-700",
};

function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const style = STATUS_STYLES[key] ?? STATUS_STYLES.default;
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${style.bg}`}>
      <Icon className="w-3 h-3" />
      {status || "Unknown"}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const key = category.toLowerCase();
  const color = CATEGORY_COLORS[key] ?? CATEGORY_COLORS.default;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
      <Tag className="w-3 h-3" />
      {category}
    </span>
  );
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(CSV_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      setStories(parseCSV(text));
    } catch (e) {
      setError("Could not load stories. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const allStatuses = Array.from(new Set(stories.map(s => s.status).filter(Boolean)));
  const allCategories = Array.from(new Set(stories.map(s => s.category).filter(Boolean)));

  const filtered = stories.filter(s => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status.toLowerCase() === filterStatus.toLowerCase();
    const matchCat = filterCategory === "all" || s.category.toLowerCase() === filterCategory.toLowerCase();
    return matchSearch && matchStatus && matchCat;
  });

  const publishedCount = stories.filter(s => s.status.toLowerCase() === "published").length;
  const readyCount = stories.filter(s => s.status.toLowerCase() === "ready").length;

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-display text-[#FF3D9A]">
          <BookOpen className="inline w-8 h-8 mr-2" />
          Stories Library
        </h2>
        <p className="text-muted-foreground text-lg">All your stories from the production sheet, live.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Stories", value: stories.length, color: "text-primary", bg: "bg-primary/10" },
          { label: "Published", value: publishedCount, color: "text-green-600", bg: "bg-green-50" },
          { label: "Ready to Upload", value: readyCount, color: "text-blue-600", bg: "bg-blue-50" },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 text-center border border-white`}>
            <p className={`text-3xl font-display ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground font-semibold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-border flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-48 bg-muted rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            data-testid="input-search-stories"
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            data-testid="select-filter-status"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-sm bg-muted rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            data-testid="select-filter-category"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-sm bg-muted rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          data-testid="button-refresh-stories"
          onClick={load}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-xl hover:bg-muted"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-16 space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto"
          />
          <p className="text-muted-foreground">Loading your stories...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-red-700 font-semibold">{error}</p>
          <button onClick={load} className="text-sm text-red-600 underline">Try again</button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filtered.length}</strong> of <strong>{stories.length}</strong> stories
          </p>

          <AnimatePresence>
            {filtered.map((story, idx) => (
              <motion.div
                key={story.row}
                data-testid={`card-story-${story.row}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
              >
                {/* Card header — always visible */}
                <button
                  className="w-full text-left p-5 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                  onClick={() => setExpanded(expanded === story.row ? null : story.row)}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 font-display text-primary text-sm">
                    {story.row}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <StatusBadge status={story.status} />
                      {story.category && <CategoryBadge category={story.category} />}
                      {story.scheduleDateTime && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(story.scheduleDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-base leading-snug">{story.title || "(No title)"}</h3>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {story.youtubeLink && (
                      <a
                        data-testid={`link-youtube-${story.row}`}
                        href={story.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Watch on YouTube"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                    {story.videoDriveLink && (
                      <a
                        data-testid={`link-drive-${story.row}`}
                        href={story.videoDriveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Open in Google Drive"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded === story.row && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                        {story.description && (
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">Description / Hook</p>
                            <p className="text-sm text-foreground leading-relaxed">{story.description}</p>
                          </div>
                        )}

                        {story.hashtags && (
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                              <Hash className="w-3 h-3" /> Hashtags
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {story.hashtags.split(/\s+/).filter(Boolean).map(tag => (
                                <span key={tag} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {story.seoTags && (
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                              <Tag className="w-3 h-3" /> SEO Tags
                            </p>
                            <p className="text-sm text-muted-foreground">{story.seoTags}</p>
                          </div>
                        )}

                        {story.reviewNotes && (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                            <p className="text-xs font-bold text-amber-700 mb-1">Review Notes</p>
                            <p className="text-sm text-amber-800">{story.reviewNotes}</p>
                          </div>
                        )}

                        {story.uploadError && (
                          <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                            <p className="text-xs font-bold text-red-700 mb-1">Upload Error</p>
                            <p className="text-sm text-red-700">{story.uploadError}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No stories match your filters</p>
              <button onClick={() => { setSearch(""); setFilterStatus("all"); setFilterCategory("all"); }}
                className="text-sm text-primary underline mt-2">Clear filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
