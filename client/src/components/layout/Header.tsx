import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Code2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { data: user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center shadow-lg shadow-primary/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white">
            TIKTOK <span className="text-primary">GIP</span>
          </span>
          <span className="text-xs text-muted-foreground ml-2">Masterclass</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href={user ? "/admin/dashboard" : "/admin"}>
            <Button variant="outline" size="sm" className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg">
              <Shield className="w-4 h-4 mr-2" />
              {user ? "Dashboard" : "Admin Panel"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
