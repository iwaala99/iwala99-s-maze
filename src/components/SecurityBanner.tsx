import { Shield, Lock, Database, Globe } from 'lucide-react';

const SecurityBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-background via-primary/5 to-background border-y border-primary/20">
      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {/* HTTPS/TLS */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-md border border-primary/20">
            <Lock className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">HTTPS</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary">
              SECURED
            </span>
          </div>

          {/* RLS Protection */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-md border border-primary/20">
            <Database className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">RLS</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary">
              ENABLED
            </span>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-md border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">AUTH</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary">
              PROTECTED
            </span>
          </div>

          {/* Realtime */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-md border border-primary/20">
            <Globe className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">WSS</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary">
              REALTIME
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityBanner;