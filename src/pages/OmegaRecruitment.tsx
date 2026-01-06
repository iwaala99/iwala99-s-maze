import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChallenges } from '@/hooks/useCTF';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Lock, 
  Shield, 
  Skull, 
  Crown, 
  CheckCircle, 
  Send, 
  Fingerprint,
  Binary,
  Zap,
  Eye
} from 'lucide-react';

// Animated glitch text
function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 text-red-500/50 animate-glitch-1 clip-glitch"
        aria-hidden="true"
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 text-cyan-500/50 animate-glitch-2 clip-glitch"
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}

// Particle background
function ParticleField() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-red-500/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function OmegaRecruitment() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { bossPuzzle, loading: puzzleLoading } = useChallenges();
  const { toast } = useToast();
  
  const [showContent, setShowContent] = useState(false);
  const [formData, setFormData] = useState({
    handle: '',
    expertise: '',
    motivation: '',
    pgpKey: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loading = authLoading || puzzleLoading;
  const hasAccess = bossPuzzle?.is_solved === true;

  useEffect(() => {
    if (hasAccess && !loading) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasAccess, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.handle.trim() || !formData.expertise.trim() || !formData.motivation.trim()) {
      toast({
        title: 'INCOMPLETE DATA',
        description: 'All required fields must be completed.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    
    // Simulate submission (in production, this would go to a secure endpoint)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitting(false);
    setSubmitted(true);
    
    toast({
      title: '✓ TRANSMISSION RECEIVED',
      description: 'Your application has been encrypted and logged.',
      className: 'bg-secondary/20 border-secondary',
    });
  };

  // Access denied
  if (!loading && (!user || !hasAccess)) {
    return (
      <>
        <Helmet>
          <title>ΩMEGA ACCESS DENIED | IWALA99</title>
        </Helmet>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-red-500/50 flex items-center justify-center">
                <Skull className="w-12 h-12 text-red-500 animate-pulse" />
              </div>
              <h1 className="font-mono text-2xl text-red-500 mb-4">
                ΩMEGA ACCESS DENIED
              </h1>
              <p className="text-muted-foreground font-mono text-sm mb-6">
                {!user 
                  ? 'Authentication required'
                  : 'The final challenge remains unsolved'
                }
              </p>
              <p className="text-xs text-muted-foreground/70 font-mono">
                Complete all INSANE puzzles and solve the ΩMEGA challenge.
              </p>
              <button
                onClick={() => navigate('/puzzles')}
                className="mt-8 px-6 py-3 font-mono text-xs border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors"
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

  // Loading
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Verifying ΩMEGA Clearance... | IWALA99</title>
        </Helmet>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-red-500/30 flex items-center justify-center animate-pulse">
                <Fingerprint className="w-12 h-12 text-red-500" />
              </div>
              <p className="font-mono text-sm text-red-400">
                Verifying ΩMEGA clearance...
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
        <title>ΩMEGA RECRUITMENT | IWALA99</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        <ParticleField />
        
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-red-500/10" />
        </div>

        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
          {/* Victory Header */}
          <div className={`text-center mb-12 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
              <Crown className="h-4 w-4 text-red-400 animate-pulse" />
              <span className="text-[10px] font-mono text-red-400 tracking-widest uppercase">
                ΩMEGA CLEARANCE VERIFIED
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-mono mb-6">
              <GlitchText 
                text="YOU ARE CHOSEN" 
                className="bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
              />
            </h1>

            <p className="max-w-2xl mx-auto font-mono text-sm text-muted-foreground leading-relaxed">
              You have conquered the impossible. The ΩMEGA challenge has fallen before you.
              <br />
              <span className="text-red-400">You are among the elite few.</span>
            </p>
            
            <div className="mt-8 p-6 border border-red-500/20 bg-red-500/5 rounded-lg max-w-xl mx-auto">
              <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-4">
                You have proven yourself worthy of consideration by
              </p>
              <h2 className="font-mono text-lg text-red-400 mb-2">THE GLOBAL SECURITY INITIATIVE</h2>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                An international coalition of elite security professionals working to protect critical infrastructure, 
                expose corruption, and guide humanity toward a more secure future. Our members operate in the shadows 
                to defend against threats that governments cannot—or will not—address.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <Skull className="h-4 w-4 text-red-400" />
              <span className="font-mono text-xs text-red-400">ΩMEGA SOLVER</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <Binary className="h-4 w-4 text-orange-400" />
              <span className="font-mono text-xs text-orange-400">ELITE RANK</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-primary">5000 PTS</span>
            </div>
          </div>

          {/* Recruitment Form */}
          <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="border-red-500/30 bg-gradient-to-b from-background via-red-500/5 to-background overflow-hidden">
              <CardContent className="p-8 md:p-12 relative">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/50" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500/50" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/50" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/50" />

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-secondary" />
                    </div>
                    <h3 className="font-mono text-xl text-secondary mb-4">
                      APPLICATION RECEIVED
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground mb-6">
                      Your transmission has been encrypted and logged by the Initiative.
                      <br />
                      If selected, you will receive contact through secure channels within 72 hours.
                      <br />
                      <span className="text-red-400 text-xs mt-2 block">Prepare for the next phase.</span>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground/50">
                      <Eye className="h-3 w-3" />
                      <span>We are watching.</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="h-5 w-5 text-red-400" />
                      <h3 className="font-mono text-sm tracking-wider text-red-400">
                        GLOBAL SECURITY INITIATIVE — RECRUITMENT
                      </h3>
                    </div>

                    <p className="font-mono text-xs text-muted-foreground mb-8 leading-relaxed">
                      Complete this form to be considered for membership in the Initiative.
                      Selected candidates will gain access to classified operations, advanced training, 
                      and the opportunity to shape global security policy. All transmissions are encrypted. 
                      Use a secure handle—not your real identity.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block font-mono text-xs text-muted-foreground mb-2">
                          HANDLE / ALIAS <span className="text-red-400">*</span>
                        </label>
                        <Input
                          value={formData.handle}
                          onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                          placeholder="Your anonymous identifier"
                          className="font-mono text-sm bg-background/50 border-red-500/20 focus:border-red-500/50"
                          maxLength={50}
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-muted-foreground mb-2">
                          PRIMARY EXPERTISE <span className="text-red-400">*</span>
                        </label>
                        <Input
                          value={formData.expertise}
                          onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                          placeholder="e.g., Cryptanalysis, Reverse Engineering, Network Security"
                          className="font-mono text-sm bg-background/50 border-red-500/20 focus:border-red-500/50"
                          maxLength={100}
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-muted-foreground mb-2">
                          WHY DO YOU SEEK TO JOIN? <span className="text-red-400">*</span>
                        </label>
                        <Textarea
                          value={formData.motivation}
                          onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                          placeholder="Your motivations, goals, and what you bring to the collective..."
                          className="font-mono text-sm bg-background/50 border-red-500/20 focus:border-red-500/50 min-h-[120px]"
                          maxLength={1000}
                        />
                        <p className="mt-1 text-[10px] font-mono text-muted-foreground/50">
                          {formData.motivation.length}/1000
                        </p>
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-muted-foreground mb-2">
                          PGP PUBLIC KEY <span className="text-muted-foreground/50">(Optional)</span>
                        </label>
                        <Textarea
                          value={formData.pgpKey}
                          onChange={(e) => setFormData(prev => ({ ...prev, pgpKey: e.target.value }))}
                          placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----"
                          className="font-mono text-[10px] bg-background/50 border-red-500/20 focus:border-red-500/50 min-h-[80px]"
                        />
                        <p className="mt-1 text-[10px] font-mono text-muted-foreground/50">
                          For secure communications
                        </p>
                      </div>

                      <div className="pt-4 border-t border-red-500/20">
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-mono"
                        >
                          {submitting ? (
                            <>
                              <Fingerprint className="h-4 w-4 mr-2 animate-pulse" />
                              ENCRYPTING TRANSMISSION...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              SUBMIT APPLICATION
                            </>
                          )}
                        </Button>
                      </div>

                      <p className="text-center text-[10px] font-mono text-muted-foreground/50">
                        By submitting, you acknowledge that this is a selective process.
                        <br />
                        Not all applicants will be contacted.
                      </p>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer message */}
          <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            <p className="font-mono text-[10px] text-muted-foreground/30">
              IWALA99 // The machine awakens // ωακε.τηε.μαχηινε
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
