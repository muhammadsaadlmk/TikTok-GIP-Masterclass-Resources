import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppCard } from "@/components/AppCard";
import { useApps } from "@/hooks/use-apps";
import { useStats, useIncrementVisitor } from "@/hooks/use-stats";
import { MessageCircle, Mail, Users, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: apps, isLoading: isAppsLoading } = useApps();
  const { data: stats } = useStats();
  const incrementVisitor = useIncrementVisitor();
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!hasIncremented.current) {
      hasIncremented.current = true;
      incrementVisitor.mutate();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      <Header />

      <main className="flex-1 container mx-auto px-4 pt-16 pb-24 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">
              TIKTOK GIP <br />
              <span className="text-gradient-primary">MASTERCLASS</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              Access comprehensive resources for TikTok GIP mastery. 
              Everything you need to succeed in one trusted platform.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <div className="glass-panel px-8 py-6 rounded-2xl flex items-center gap-5 flex-1 max-w-[280px]">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Visitors</p>
                <p className="text-3xl font-display font-bold text-white">
                  {stats?.visitorCount?.toLocaleString() || "..."}
                </p>
              </div>
            </div>
            
            <div className="glass-panel px-8 py-6 rounded-2xl flex items-center gap-5 flex-1 max-w-[280px]">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Download className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Downloads</p>
                <p className="text-3xl font-display font-bold text-white">
                  {stats?.totalDownloads?.toLocaleString() || "..."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* App Grid Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 rounded-full bg-primary inline-block"></span>
              Available Tools
            </h2>
          </div>
          
          {isAppsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
              <p>Loading premium tools...</p>
            </div>
          ) : apps && apps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app, i) => (
                <AppCard key={app.id} app={app} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl">
              <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No apps found</h3>
              <p className="text-muted-foreground">Check back later for premium tools.</p>
            </div>
          )}
        </div>

        {/* Support Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
          <h2 className="text-3xl font-display font-bold text-white mb-4 relative z-10">Need Help?</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto relative z-10 text-lg">
            Have an issue with an app or need to report a broken link? Reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <a href="https://chat.whatsapp.com/FV0hykzlnqWCxu8f2ywfnq?mode=gi_t" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="h-14 px-8 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-base shadow-lg shadow-[#25D366]/20">
                <MessageCircle className="w-5 h-5 mr-2" />
                Join WhatsApp
              </Button>
            </a>
            <a href="mailto:msprimetechservices@gmail.com">
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 hover:bg-white/5 rounded-xl text-base bg-background/50">
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </Button>
            </a>
          </div>
        </motion.div>

      </main>
      
      <Footer />
    </div>
  );
}
