import { useState } from "react";
import { App } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Package } from "lucide-react";
import { useIncrementDownload } from "@/hooks/use-apps";
import { motion } from "framer-motion";

export function AppCard({ app, index }: { app: App; index: number }) {
  const [imageError, setImageError] = useState(false);
  const incrementDownload = useIncrementDownload();

  const handleDownload = () => {
    incrementDownload.mutate(app.id, {
      onSuccess: () => {
        window.open(app.downloadLink, "_blank", "noopener,noreferrer");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col justify-between p-6 rounded-2xl glass-panel hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 overflow-hidden"
    >
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
          {!imageError && app.iconUrl ? (
            <img 
              src={app.iconUrl} 
              alt={`${app.name} icon`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <Package className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0 pt-1">
          <h3 className="font-display text-xl font-bold text-white truncate w-full" title={app.name}>
            {app.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground bg-white/5 w-fit px-2 py-0.5 rounded-full border border-white/5">
            <Download className="w-3.5 h-3.5" />
            <span className="font-medium">{app.downloadCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleDownload}
        disabled={incrementDownload.isPending}
        className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl relative z-10 transition-all active:scale-[0.98]"
      >
        {incrementDownload.isPending ? "Starting..." : "Download APK"}
      </Button>
    </motion.div>
  );
}
