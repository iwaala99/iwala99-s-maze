import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRecruitmentAccess, usePathCompletion } from '@/hooks/usePathCompletion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, CheckCircle, Key, Fingerprint, Shield } from 'lucide-react';

// Animated typing effect
function TypewriterText({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayText}
      {currentIndex < text.length && <span className="animate-blink">▊</span>}
    </span>
  );
}

export default function Recruitment() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasAccess, completedPaths, loading: accessLoading } = useRecruitmentAccess();
  const { pathStatuses } = usePathCompletion();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (hasAccess && !accessLoading) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasAccess, accessLoading]);

  const loading = authLoading || accessLoading;

  // Access denied state
  if (!loading && (!user || !hasAccess)) {
    return (
      <>
        <Helmet>
          <title>ACCESS DENIED | IWALA99</title>
        </Helmet>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-destructive/50 flex items-center justify-center">
                <Lock className="w-12 h-12 text-destructive animate-pulse" />
              </div>
              <h1 className="font-mono text-2xl text-destructive mb-4">
                ACCESS DENIED
              </h1>
              <p className="text-muted-foreground font-mono text-sm mb-6">
                {!user 
                  ? 'Authentication required'
                  : 'Insufficient clearance'
                }
              </p>
              <p className="text-xs text-muted-foreground/70 font-mono">
                Complete at least one path in The Maze to gain access.
              </p>
              <button
                onClick={() => navigate('/puzzles')}
                className="mt-8 px-6 py-3 font-mono text-xs border border-primary/30 rounded hover:bg-primary/10 transition-colors"
              >
                Return to The Maze
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Verifying... | IWALA99</title>
        </Helmet>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-primary/30 flex items-center justify-center animate-pulse">
                <Fingerprint className="w-12 h-12 text-primary" />
              </div>
              <p className="font-mono text-sm text-primary">
                Verifying clearance...
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Recruitment | IWALA99</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        </div>

        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className={`text-center mb-12 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-full">
              <Shield className="h-3 w-3 text-secondary animate-pulse" />
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
                SECURE CHANNEL
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-mono mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                WELCOME, SOLVER
              </span>
            </h1>

            <div className="max-w-2xl mx-auto font-mono text-sm text-muted-foreground leading-relaxed">
              <TypewriterText 
                text="You have proven your worth. The paths you've conquered have led you here. This is not the end—it is the beginning."
                delay={30}
              />
            </div>
          </div>

          {/* Completed Paths */}
          <div className={`mb-12 transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-center font-mono text-xs text-muted-foreground mb-6 tracking-widest">
              PATHS CONQUERED
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {completedPaths.map((path) => {
                const status = pathStatuses.find(p => p.category === path);
                return (
                  <div
                    key={path}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-lg"
                  >
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="font-mono text-xs uppercase">{path}</span>
                    {status?.secretCode && (
                      <Badge variant="outline" className="font-mono text-[10px] border-primary/30">
                        {status.secretCode}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recruitment Message */}
          <div className={`max-w-3xl mx-auto transition-all duration-1000 delay-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="border-primary/20 bg-gradient-to-b from-background to-primary/5">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="h-5 w-5 text-primary" />
                  <h3 className="font-mono text-sm tracking-wider text-primary">
                    CLASSIFIED TRANSMISSION
                  </h3>
                </div>

                <div className="space-y-6 font-mono text-sm text-muted-foreground leading-relaxed">
                  <p>
                    You have demonstrated exceptional abilities in cryptanalysis, 
                    pattern recognition, and logical deduction. These are rare qualities.
                  </p>
                  
                  <p>
                    We are IWALA99—a collective of cybersecurity professionals dedicated to 
                    protecting digital infrastructure and advancing security knowledge.
                  </p>

                  <p>
                    The challenges you've solved were merely an entrance examination. 
                    What lies ahead requires dedication, discretion, and an unwavering commitment to excellence.
                  </p>

                  <div className="border-t border-primary/20 pt-6 mt-8">
                    <p className="text-xs text-muted-foreground/70 mb-4">
                      NEXT STEPS
                    </p>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span>Continue solving puzzles to unlock deeper access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span>Connect with fellow solvers in the community</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-secondary">•</span>
                        <span>Watch for hidden opportunities across the platform</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-primary/20 text-center">
                  <p className="font-mono text-[10px] text-muted-foreground/50">
                    IWALA99 // Security Through Knowledge
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inner circle access */}
          {pathStatuses.length > 0 && pathStatuses.every(p => p.isComplete) && (
            <div className={`mt-12 text-center transition-all duration-1000 delay-1500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 border border-secondary/50 rounded-lg">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="font-mono text-xs text-secondary">
                  ALL PATHS CONQUERED — INNER CIRCLE ACCESS GRANTED
                </span>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
