import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface CityTime {
  city: string;
  timezone: string;
  flag: string;
}

const cities: CityTime[] = [
  { city: 'Casablanca', timezone: 'Africa/Casablanca', flag: '🇲🇦' },
  { city: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
  { city: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
  { city: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪' },
];

const CompactTime = () => {
  const [time, setTime] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const rotator = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cities.length);
    }, 5000);
    return () => clearInterval(rotator);
  }, []);

  const formatTime = (timezone: string) => {
    return time.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const currentCity = cities[currentIndex];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 border border-primary/20 rounded-lg hover:border-primary/40 transition-colors">
          <Globe className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-mono">
            <span className="mr-1">{currentCity.flag}</span>
            <span className="text-primary font-semibold">
              {formatTime(currentCity.timezone)}
            </span>
          </span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 bg-card/95 backdrop-blur-sm border-primary/30">
        <div className="space-y-2">
          <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary uppercase tracking-wider">World Time</span>
          </div>
          {cities.map((city) => (
            <div key={city.city} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span>{city.flag}</span>
                <span className="text-muted-foreground">{city.city}</span>
              </span>
              <span className="font-mono text-primary">{formatTime(city.timezone)}</span>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CompactTime;