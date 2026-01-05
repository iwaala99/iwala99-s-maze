import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: string;
  onExpired?: () => void;
  compact?: boolean;
}

export default function CountdownTimer({ expiresAt, onExpired, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        onExpired?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-1 text-destructive">
        <AlertTriangle className="h-3 w-3" />
        <span className="text-[10px] font-mono">EXPIRED</span>
      </div>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 6;
  const isWarning = timeLeft.days === 0 && timeLeft.hours < 24;

  if (compact) {
    const timeString = timeLeft.days > 0
      ? `${timeLeft.days}d ${timeLeft.hours}h`
      : timeLeft.hours > 0
        ? `${timeLeft.hours}h ${timeLeft.minutes}m`
        : `${timeLeft.minutes}m ${timeLeft.seconds}s`;

    return (
      <div className={`flex items-center gap-1 ${isUrgent ? 'text-destructive animate-pulse' : isWarning ? 'text-yellow-500' : 'text-muted-foreground'}`}>
        <Clock className="h-3 w-3" />
        <span className="text-[10px] font-mono">{timeString}</span>
      </div>
    );
  }

  return (
    <div className={`
      flex items-center gap-2 px-2 py-1 rounded border font-mono text-[10px]
      ${isUrgent 
        ? 'bg-destructive/10 border-destructive/30 text-destructive animate-pulse' 
        : isWarning 
          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' 
          : 'bg-primary/5 border-primary/20 text-primary'
      }
    `}>
      <Clock className="h-3 w-3" />
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <span className="tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="opacity-50">d</span>
          </>
        )}
        <span className="tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="opacity-50">:</span>
        <span className="tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="opacity-50">:</span>
        <span className="tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
