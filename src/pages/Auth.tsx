import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Terminal, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const cyberRoles = [
  { value: 'ethical_hacker', label: 'Ethical Hacker', labelAr: 'هاكر أخلاقي' },
  { value: 'soc_analyst', label: 'SOC Analyst', labelAr: 'محلل SOC' },
  { value: 'penetration_tester', label: 'Penetration Tester', labelAr: 'مختبر الاختراق' },
  { value: 'security_engineer', label: 'Security Engineer', labelAr: 'مهندس أمني' },
  { value: 'threat_hunter', label: 'Threat Hunter', labelAr: 'صياد التهديدات' },
  { value: 'incident_responder', label: 'Incident Responder', labelAr: 'مستجيب الحوادث' },
  { value: 'security_architect', label: 'Security Architect', labelAr: 'مهندس معماري أمني' },
  { value: 'malware_analyst', label: 'Malware Analyst', labelAr: 'محلل البرمجيات الخبيثة' },
  { value: 'network_security', label: 'Network Security', labelAr: 'أمن الشبكات' },
  { value: 'digital_forensics', label: 'Digital Forensics', labelAr: 'الطب الشرعي الرقمي' },
];

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const validation = signInSchema.safeParse({ email, password });
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back, agent!');
          navigate('/');
        }
      } else {
        const validation = signUpSchema.safeParse({ email, username, password });
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setIsLoading(false);
          return;
        }

        if (selectedRoles.length === 0) {
          toast.error('Please select at least one role');
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, username, selectedRoles);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered');
          } else if (error.message.includes('duplicate key')) {
            toast.error('This username is already taken');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created! Welcome to the network.');
          navigate('/');
        }
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 matrix-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-10 h-10 text-primary animate-glow-pulse" />
            <Terminal className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gradient mb-2">IWALA99</h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Access the network' : 'Join the elite network'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="terminal-border bg-card/50 backdrop-blur-lg p-8 rounded-lg space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">
                Email (private - for login only)
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-muted/50 border-primary/30 focus:border-primary text-foreground"
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-muted-foreground">
                  Username (public - for anonymity)
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_alias"
                  className="bg-muted/50 border-primary/30 focus:border-primary text-foreground"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-muted/50 border-primary/30 focus:border-primary text-foreground pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection - Only for signup */}
            {!isLogin && (
              <div className="space-y-3">
                <Label className="text-muted-foreground">Select your role(s)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                  {cyberRoles.map((role) => (
                    <div
                      key={role.value}
                      className={`
                        flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-300
                        ${selectedRoles.includes(role.value)
                          ? 'bg-primary/20 border border-primary/50'
                          : 'bg-muted/30 border border-transparent hover:border-primary/30'
                        }
                      `}
                      onClick={() => handleRoleToggle(role.value)}
                    >
                      <Checkbox
                        checked={selectedRoles.includes(role.value)}
                        onCheckedChange={() => handleRoleToggle(role.value)}
                        className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-xs text-muted-foreground">
                        {role.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full glow-box bg-primary text-primary-foreground hover:bg-primary/90 font-display"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLogin ? (
              '> Access Network'
            ) : (
              '> Create Account'
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setSelectedRoles([]);
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Join us" : 'Already a member? Log in'}
            </button>
          </div>
        </form>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
