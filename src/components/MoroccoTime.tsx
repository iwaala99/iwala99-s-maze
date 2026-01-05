import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, Calendar, MapPin } from 'lucide-react';

const MoroccoTime = () => {
  const [time, setTime] = useState(new Date());
  const { t, language } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Morocco is in WET (UTC+0) or WEST (UTC+1) during DST
  const moroccoTime = new Date(time.toLocaleString('en-US', { timeZone: 'Africa/Casablanca' }));
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' || language === 'darija' ? 'ar-MA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    if (language === 'ar') {
      return date.toLocaleDateString('ar-MA', options);
    } else if (language === 'darija') {
      return date.toLocaleDateString('ar-MA', options);
    } else if (language === 'fr') {
      return date.toLocaleDateString('fr-FR', options);
    } else if (language === 'es') {
      return date.toLocaleDateString('es-ES', options);
    } else if (language === 'de') {
      return date.toLocaleDateString('de-DE', options);
    }
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="terminal-border bg-card/50 backdrop-blur-sm p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm text-muted-foreground">{t('time.morocco')}</span>
      </div>
      
      <div className="flex items-center gap-3 mb-2">
        <Clock className="w-5 h-5 text-primary animate-glow-pulse" />
        <span className="text-2xl font-display font-bold text-primary glow-text">
          {formatTime(moroccoTime)}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-secondary" />
        <span className="text-sm text-muted-foreground">
          {formatDate(moroccoTime)}
        </span>
      </div>
    </div>
  );
};

export default MoroccoTime;
