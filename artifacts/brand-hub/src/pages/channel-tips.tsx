import { motion } from "framer-motion";
import { CheckCircle2, Zap, TrendingUp, Sparkles, ShieldAlert } from "lucide-react";

const SECTIONS = [
  {
    id: "working-well",
    title: "What's Working Well",
    icon: CheckCircle2,
    color: "text-[#00CC44]",
    bg: "bg-[#00CC44]/10",
    border: "border-[#00CC44]/20",
    items: [
      "Consistent colorful thumbnail style — great for brand recognition",
      "Short format (1-2 min) matches kids' attention spans perfectly",
      "Diverse character names (Nani, Pax, Lina, Polo, Lio) — inclusive storytelling",
      "Fun story titles with character names + situation — good click curiosity"
    ]
  },
  {
    id: "quick-wins",
    title: "Quick Wins — Do These Now",
    icon: Zap,
    color: "text-[#FF8000]",
    bg: "bg-[#FF8000]/10",
    border: "border-[#FF8000]/20",
    items: [
      "Add captions to every video — YouTube ranks captioned videos higher, and kids/parents love them",
      "Put keywords FIRST in your titles — e.g. \"Bedtime Stories for Kids – Gadget Gertie's Noodle Invention\"",
      "Write proper video descriptions (100+ words) — include: what the story is about, who it's for, keywords",
      "Add end screens (last 20 seconds) linking to your next video — keeps kids watching more",
      "Create a channel trailer (60-90 sec highlight reel) — new visitors need to know what your channel is about",
      "Use YouTube's \"Test & Compare\" for thumbnails — upload 2-3 variations and let YouTube pick the winner",
      "Enable \"Made for Kids\" label on every video — legally required for kids content (COPPA compliance)",
      "Disclose AI-generated content — YouTube requires this to avoid demonetization"
    ]
  },
  {
    id: "growth",
    title: "Growth Strategies",
    icon: TrendingUp,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    items: [
      "Publish on a consistent schedule (e.g. every Tuesday + Friday) — algorithm rewards consistency",
      "Create 1-hour compilation videos (top 10 stories) — these become major ad revenue earners",
      "Consider YouTube Shorts (30-60 sec clips) — they funnel viewers to your main channel",
      "Build playlists by theme (Bedtime Stories, Funny Stories, Learning Stories, etc.)",
      "Target evergreen keywords: \"stories for kids\", \"bedtime stories\", \"animated kids stories\""
    ]
  },
  {
    id: "content-ideas",
    title: "Content Ideas for Next Videos",
    icon: Sparkles,
    color: "text-[#9B00FF]",
    bg: "bg-[#9B00FF]/10",
    border: "border-[#9B00FF]/20",
    items: [
      "A \"Viewer's Choice\" story where you ask kids in comments what adventure the character should go on next",
      "A holiday special for each major holiday (Christmas, Halloween, Valentine's Day)",
      "A \"Character Origin\" story — how did Nani/Pax/Lina get their special ability?",
      "A crossover episode — two of your characters meet!",
      "A \"Behind the Story\" video — show how you make the stories (pulls back the curtain)"
    ]
  },
  {
    id: "compliance",
    title: "COPPA & YouTube Kids Compliance",
    icon: ShieldAlert,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    items: [
      "Always mark videos \"Made for Kids\" — comments, community posts, and merch shelf are disabled but legally required",
      "No personalized ads on kids content — revenue may be lower, but compliance protects your channel",
      "Disclose any AI-generated voices, animation, or images in the description AND YouTube Studio's AI toggle",
      "Never ask kids to like, subscribe, or leave personal info in comments"
    ]
  }
];

export default function ChannelTips() {
  return (
    <div className="space-y-10 pb-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-display text-[#9B00FF] drop-shadow-sm flex items-center justify-center gap-3">
          <TrendingUp className="w-10 h-10" />
          Channel Tips
        </h2>
        <p className="text-lg text-muted-foreground font-semibold">
          Data-backed strategies to help Bright Little Stories grow, engage kids, and stay compliant on YouTube.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {SECTIONS.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-3xl border-2 ${section.bg} ${section.border} shadow-sm backdrop-blur-sm ${
              section.id === "quick-wins" ? "md:col-span-2" : ""
            }`}
          >
            <h3 className={`text-2xl font-display mb-6 flex items-center gap-3 ${section.color}`}>
              <section.icon className="w-8 h-8 fill-current/20" />
              {section.title}
            </h3>
            <ul className="space-y-4">
              {section.items.map((item, i) => {
                // Highlight important parts of text
                const boldedItem = item.split('—').map((part, pIndex, array) => 
                  pIndex === 0 && array.length > 1 ? <strong key={pIndex} className="text-foreground">{part}—</strong> : <span key={pIndex} className="text-muted-foreground">{part}</span>
                );

                return (
                  <li key={i} className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl">
                    <div className={`mt-0.5 shrink-0 ${section.color}`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="font-semibold leading-snug">
                      {boldedItem}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
