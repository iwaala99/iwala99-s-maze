import { Shield, Lock, Eye, Server, Wifi, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const SecurityBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const securityFeatures = [
    { icon: Lock, label: 'AES-256', status: 'ENCRYPTED' },
    { icon: Shield, label: 'RLS', status: 'ACTIVE' },
    { icon: Eye, label: 'MONITORING', status: '24/7' },
    { icon: Server, label: 'FIREWALL', status: 'ENABLED' },
    { icon: Wifi, label: 'TLS 1.3', status: 'SECURED' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % securityFeatures.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-background via-primary/5 to-background border-y border-primary/20">
      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-secondary rounded-full animate-ping opacity-75" />
            </div>
            <span className="font-mono text-sm text-secondary font-medium">
              SYSTEM STATUS: <span className="text-primary">SECURE</span>
            </span>
          </div>

          {/* Security features */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={feature.label}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-500 ${
                    isActive 
                      ? 'bg-primary/20 border border-primary/50 scale-105' 
                      : 'bg-muted/30 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="flex items-center gap-1.5">
                    <span className={`font-mono text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {feature.label}
                    </span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isActive 
                        ? 'bg-secondary/20 text-secondary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-md border border-secondary/30">
            <CheckCircle className="w-4 h-4 text-secondary" />
            <span className="font-mono text-xs text-secondary">VERIFIED</span>
          </div>
        </div>

        {/* Terminal-style info line */}
        <div className="mt-3 pt-3 border-t border-primary/10">
          <p className="font-mono text-xs text-center text-muted-foreground">
            <span className="text-primary">$</span> threat_level: <span className="text-secondary">LOW</span> | 
            <span className="text-primary"> uptime:</span> 99.9% | 
            <span className="text-primary"> last_scan:</span> {new Date().toLocaleTimeString()} | 
            <span className="text-primary"> protocols:</span> HTTPS, WSS, TLS
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityBanner;