import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, Globe } from 'lucide-react';

interface CityTime {
  city: string;
  timezone: string;
  country: string;
  flag: string;
}

const cities: CityTime[] = [
  { city: 'Casablanca', timezone: 'Africa/Casablanca', country: 'Morocco', flag: '🇲🇦' },
  { city: 'New York', timezone: 'America/New_York', country: 'USA', flag: '🇺🇸' },
  { city: 'London', timezone: 'Europe/London', country: 'UK', flag: '🇬🇧' },
  { city: 'Paris', timezone: 'Europe/Paris', country: 'France', flag: '🇫🇷' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan', flag: '🇯🇵' },
  { city: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE', flag: '🇦🇪' },
  { city: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia', flag: '🇦🇺' },
  { city: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia', flag: '🇷🇺' },
  { city: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore', flag: '🇸🇬' },
  { city: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany', flag: '🇩🇪' },
  { city: 'Beijing', timezone: 'Asia/Shanghai', country: 'China', flag: '🇨🇳' },
  { city: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India', flag: '🇮🇳' },
];

const WorldClock = () => {
  const [time, setTime] = useState(new Date());
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone: string) => {
    return time.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeOfDay = (timezone: string) => {
    const hour = parseInt(time.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }));
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const getTimeColor = (timezone: string) => {
    const tod = getTimeOfDay(timezone);
    switch (tod) {
      case 'morning': return 'text-amber-400';
      case 'afternoon': return 'text-yellow-300';
      case 'evening': return 'text-orange-400';
      case 'night': return 'text-blue-400';
      default: return 'text-primary';
    }
  };

  return (
    <div className="terminal-border bg-card/50 backdrop-blur-sm p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '20s' }} />
        <span className="text-sm font-mono text-primary tracking-wider uppercase">GLOBAL TIME</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {cities.map((city) => (
          <div 
            key={city.city}
            className="bg-muted/30 border border-primary/10 rounded-lg p-3 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-base">{city.flag}</span>
              <span className="text-xs text-muted-foreground font-mono truncate">
                {city.city}
              </span>
            </div>
            <div className={`text-lg font-mono font-bold ${getTimeColor(city.timezone)}`}>
              {formatTime(city.timezone)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-primary/10 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-mono">
          {time.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};

export default WorldClock;