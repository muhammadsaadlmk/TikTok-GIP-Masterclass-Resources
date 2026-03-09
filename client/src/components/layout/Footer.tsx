import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-20 bg-background">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground font-medium">
          © 2026 TikTok GIP Masterclass Resources. All Rights Reserved.
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Crafted with <Heart className="w-4 h-4 text-primary" /> for Developers
        </p>
      </div>
    </footer>
  );
}
