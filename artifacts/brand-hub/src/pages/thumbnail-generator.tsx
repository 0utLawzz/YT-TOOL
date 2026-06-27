import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Sparkles, Image as ImageIcon, Wand2, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const COLOR_SCHEMES = {
  "pink-blue": { name: "Pink & Blue", bg: "bg-primary", text: "text-white", outline: "text-shadow-black", subtitle: "text-accent" },
  "yellow-green": { name: "Yellow & Green", bg: "bg-[#FFE600]", text: "text-white", outline: "text-shadow-black", subtitle: "text-[#00CC44]" },
  "purple-orange": { name: "Purple & Orange", bg: "bg-[#9B00FF]", text: "text-white", outline: "text-shadow-black", subtitle: "text-[#FF8000]" },
  "rainbow": { name: "Rainbow", bg: "bg-gradient-to-r from-primary via-accent to-[#FFE600]", text: "text-transparent bg-clip-text", outline: "text-shadow-black-clip", subtitle: "text-primary" },
};

export default function ThumbnailGenerator() {
  const [title, setTitle] = useState("Gadget Gertie and the Giggle-Gadget");
  const [subtitle, setSubtitle] = useState("Science Can Be SILLY!");
  const [tagline, setTagline] = useState("Wait Till You See What Happens!");
  const [colorScheme, setColorScheme] = useState<keyof typeof COLOR_SCHEMES>("pink-blue");

  const activeScheme = COLOR_SCHEMES[colorScheme];

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-display text-accent drop-shadow-sm flex items-center justify-center gap-3">
          <Wand2 className="w-10 h-10 text-primary" />
          Thumbnail Maker
        </h2>
        <p className="text-lg text-muted-foreground font-semibold">
          Preview your thumbnail ideas in the signature Bright Little Stories style!
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-3xl shadow-xl border border-border">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-lg font-bold text-foreground">Story Title (Main text)</Label>
            <Input 
              id="title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg py-6 rounded-xl bg-muted/50 border-2 focus-visible:ring-primary focus-visible:border-primary font-bold"
              data-testid="input-thumbnail-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-lg font-bold text-foreground">Subtitle / Hook</Label>
            <Input 
              id="subtitle"
              value={subtitle} 
              onChange={(e) => setSubtitle(e.target.value)}
              className="text-lg py-6 rounded-xl bg-muted/50 border-2 focus-visible:ring-accent focus-visible:border-accent font-bold"
              data-testid="input-thumbnail-subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-lg font-bold text-foreground">Bottom Tagline</Label>
            <Input 
              id="tagline"
              value={tagline} 
              onChange={(e) => setTagline(e.target.value)}
              className="text-lg py-6 rounded-xl bg-muted/50 border-2 focus-visible:ring-[#FFE600] focus-visible:border-[#FFE600] font-bold"
              data-testid="input-thumbnail-tagline"
            />
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-lg font-bold text-foreground">Color Scheme</Label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(COLOR_SCHEMES) as Array<keyof typeof COLOR_SCHEMES>).map((key) => (
                <button
                  key={key}
                  onClick={() => setColorScheme(key)}
                  data-testid={`button-scheme-${key}`}
                  className={`py-3 px-4 rounded-xl font-bold transition-all border-2 ${
                    colorScheme === key 
                      ? 'border-primary bg-primary/10 text-primary scale-105 shadow-md' 
                      : 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                  }`}
                >
                  {COLOR_SCHEMES[key].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-border">
            <div 
              className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-[#FFF9F0]"
              style={{
                border: '12px solid transparent',
                borderImage: 'linear-gradient(to right, #FF3D9A, #00B4FF, #FFE600, #00CC44, #9B00FF) 1',
              }}
            >
              {/* Background gradient/pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-[radial-gradient(#FF3D9A_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

              {/* Logo Badge */}
              <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-20 border-2 border-primary">
                <Sparkles className="w-4 h-4 text-primary fill-primary" />
                <span className="font-display text-sm text-primary tracking-wide">Bright Little Stories</span>
              </div>

              {/* Character Placeholder (Left) */}
              <div className="absolute left-0 bottom-0 w-[45%] h-[90%] z-10 flex items-end justify-center pb-4">
                <div className="w-full h-full bg-gradient-to-t from-accent to-primary/30 rounded-t-full rounded-br-full mx-4 shadow-2xl flex items-center justify-center border-4 border-white">
                  <ImageIcon className="w-20 h-20 text-white/50" />
                </div>
              </div>

              {/* Text Area (Right/Center) */}
              <div className="absolute right-4 top-0 bottom-0 w-[60%] flex flex-col justify-center items-center text-center p-4 z-20">
                {subtitle && (
                  <div className={`font-display text-2xl md:text-3xl mb-2 ${activeScheme.subtitle} drop-shadow-md rotate-[-2deg]`}>
                    {subtitle}
                  </div>
                )}
                
                <h1 
                  className={`font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider leading-tight mb-6 ${activeScheme.text} ${activeScheme.outline} rotate-[2deg]`}
                  style={{
                    WebkitTextStroke: '3px black',
                    textShadow: '4px 4px 0 #000, 8px 8px 0 rgba(0,0,0,0.2)'
                  }}
                >
                  {title}
                </h1>

                {tagline && (
                  <div className="bg-[#FFE600] border-4 border-black text-black font-display text-xl md:text-2xl px-6 py-2 rounded-full shadow-[4px_4px_0_0_#000] rotate-[-1deg]">
                    {tagline}
                  </div>
                )}
              </div>
              
              {/* Decorative Stars */}
              <Sparkles className="absolute top-10 right-10 w-12 h-12 text-[#FFE600] fill-[#FFE600] rotate-12" />
              <Sparkles className="absolute bottom-10 right-40 w-8 h-8 text-[#00CC44] fill-[#00CC44] -rotate-12" />
              <Sparkles className="absolute top-32 left-1/3 w-10 h-10 text-[#9B00FF] fill-[#9B00FF] rotate-45 z-30" />
            </div>
          </div>

          <div className="bg-accent/10 border-2 border-accent/20 p-4 rounded-2xl flex gap-3 text-accent-foreground items-start">
            <Info className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80 font-medium">
              <strong>How to use this preview:</strong> Take a screenshot of this layout to use as a reference when building your actual thumbnail in Canva or Adobe Express. It helps you visualize text length and colors before committing!
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border border-border">
            <h3 className="text-xl font-display text-primary mb-4 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-[#00CC44]" />
              Thumbnail Best Practices
            </h3>
            <ul className="space-y-3">
              {[
                "Use bold, thick-outlined text readable at small sizes",
                "Show an expressive character face with big emotions",
                "Use 2-3 max colors for text (don't mix too many)",
                "Include your logo in every thumbnail for brand recognition",
                "Test at thumbnail size (120px wide) — can you still read the title?"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-[#00CC44]/20 p-1 rounded">
                    <CheckSquare className="w-4 h-4 text-[#00CC44]" />
                  </div>
                  <span className="font-medium text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
