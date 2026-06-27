import { motion } from "framer-motion";
import { Download, Info, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-display text-primary drop-shadow-sm">Welcome to your Brand Hub!</h2>
        <p className="text-lg text-muted-foreground font-semibold">
          Your one-stop shop for channel assets. Download your logo, grab your banner, and learn how to make your channel look perfectly polished.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Assets Panel */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-primary/10 relative group"
          >
            <div className="absolute -top-4 -right-4 bg-[#FFE600] text-black font-display px-4 py-1 rounded-full shadow-md rotate-6">
              Primary Logo
            </div>
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden mb-6 flex items-center justify-center p-8 border-4 border-dashed border-primary/20">
              <img 
                src="/logo.png" 
                alt="Bright Little Stories Logo" 
                className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23FFE600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="%23FF3D9A">Logo Placeholder</text></svg>'
                }}
              />
            </div>
            <a 
              href="/logo.png" 
              download 
              data-testid="link-download-logo"
              className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white font-display text-lg py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
            >
              <Download className="w-5 h-5" />
              Download Logo (800x800)
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-3xl shadow-xl shadow-accent/5 border border-accent/10 relative group"
          >
            <div className="absolute -top-4 -right-4 bg-[#00CC44] text-white font-display px-4 py-1 rounded-full shadow-md -rotate-6">
              Channel Banner
            </div>
            <div className="w-full bg-muted rounded-2xl overflow-hidden mb-6 border-4 border-dashed border-accent/20">
              <img 
                src="/banner.png" 
                alt="Bright Little Stories Banner" 
                className="w-full h-auto block hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="1280" height="720" fill="%2300B4FF"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="%23FFFFFF">Banner Placeholder</text></svg>'
                }}
              />
            </div>
            <a 
              href="/banner.png" 
              download 
              data-testid="link-download-banner"
              className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-white font-display text-lg py-4 rounded-2xl shadow-lg shadow-accent/20 transition-all hover:-translate-y-1"
            >
              <Download className="w-5 h-5" />
              Download Banner (2560x1440)
            </a>
          </motion.div>
        </div>

        {/* Instructions Panel */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-border"
          >
            <h3 className="text-2xl font-display text-[#9B00FF] mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-[#00CC44]" />
              How to upload to YouTube
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-display flex items-center justify-center shrink-0 text-xl">1</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Sign in to YouTube Studio</h4>
                  <p className="text-muted-foreground">Go to studio.youtube.com and make sure you're logged into your channel account.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-display flex items-center justify-center shrink-0 text-xl">2</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Go to Customization</h4>
                  <p className="text-muted-foreground">In the left menu, scroll down and click on "Customization", then click the "Branding" tab.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FFE600]/20 text-[#D4C000] font-display flex items-center justify-center shrink-0 text-xl">3</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Upload Picture & Banner</h4>
                  <p className="text-muted-foreground">Click "Upload" or "Change" next to Profile picture and Banner image. Select the files you downloaded here.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#00CC44]/10 text-[#00CC44] font-display flex items-center justify-center shrink-0 text-xl">4</div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Publish Changes</h4>
                  <p className="text-muted-foreground">Don't forget to click the blue "PUBLISH" button in the top right corner to save your new look!</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FFE600]/10 p-6 rounded-3xl border-2 border-[#FFE600]/30 flex gap-4"
          >
            <div className="bg-[#FFE600] p-3 rounded-full h-fit shrink-0">
              <Info className="w-6 h-6 text-black" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-black mb-2 font-display tracking-wide">Pro Tip for Icons!</h4>
              <p className="text-black/80 font-semibold">Your profile picture shows at just 98×98px in most places — make sure your logo is bold and readable at small sizes.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
