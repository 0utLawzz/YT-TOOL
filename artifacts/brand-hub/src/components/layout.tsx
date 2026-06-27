import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Image, Palette, Rocket, Star, Scissors } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const tabs = [
    { href: "/", label: "Logo & Banner", icon: Image, color: "text-primary", bg: "bg-primary/10" },
    { href: "/thumbnail-generator", label: "Thumbnail Maker", icon: Palette, color: "text-accent", bg: "bg-accent/10" },
    { href: "/channel-tips", label: "Channel Tips", icon: Rocket, color: "text-[#9B00FF]", bg: "bg-[#9B00FF]/10" },
    { href: "/logo-remover", label: "Logo Remover", icon: Scissors, color: "text-[#00CC44]", bg: "bg-[#00CC44]/10" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Top Nav */}
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary text-white rounded-xl rotate-3 shadow-sm">
              <Star className="w-6 h-6 fill-white" />
            </div>
            <h1 className="text-2xl font-display text-primary drop-shadow-sm">Bright Little Stories</h1>
          </div>

          <nav className="flex items-center gap-2 p-1.5 bg-muted rounded-full shadow-inner overflow-x-auto w-full sm:w-auto">
            {tabs.map((tab) => {
              const isActive = location === tab.href;
              return (
                <Link key={tab.href} href={tab.href}>
                  <div
                    data-testid={`nav-tab-${tab.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`relative px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-bold cursor-pointer transition-colors whitespace-nowrap ${
                      isActive ? tab.color : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className={`absolute inset-0 rounded-full ${tab.bg} shadow-sm border border-white/50`}
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 relative">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
