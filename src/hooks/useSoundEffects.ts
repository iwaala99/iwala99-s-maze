import { useCallback, useEffect, useRef, useState } from 'react';

// Audio context for generating synth sounds
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export type SoundType = 'keypress' | 'click' | 'success' | 'error' | 'notification' | 'glitch' | 'ambient';

interface SoundConfig {
  enabled: boolean;
  volume: number;
  ambientEnabled: boolean;
}

const DEFAULT_CONFIG: SoundConfig = {
  enabled: true,
  volume: 0.3,
  ambientEnabled: false,
};

export function useSoundEffects() {
  const [config, setConfig] = useState<SoundConfig>(() => {
    const saved = localStorage.getItem('iwala99-sound-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  
  const ambientRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    localStorage.setItem('iwala99-sound-config', JSON.stringify(config));
  }, [config]);

  const playSound = useCallback((type: SoundType) => {
    if (!config.enabled || config.volume === 0) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const volume = config.volume * 0.5;
      const now = ctx.currentTime;

      switch (type) {
        case 'keypress':
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(800, now);
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05);
          gainNode.gain.setValueAtTime(volume * 0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          oscillator.start(now);
          oscillator.stop(now + 0.05);
          break;

        case 'click':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(1200, now);
          oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.08);
          gainNode.gain.setValueAtTime(volume * 0.4, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          oscillator.start(now);
          oscillator.stop(now + 0.08);
          break;

        case 'success':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523.25, now); // C5
          oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
          gainNode.gain.setValueAtTime(volume * 0.5, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          oscillator.start(now);
          oscillator.stop(now + 0.4);
          break;

        case 'error':
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(200, now);
          oscillator.frequency.setValueAtTime(150, now + 0.1);
          gainNode.gain.setValueAtTime(volume * 0.4, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          oscillator.start(now);
          oscillator.stop(now + 0.2);
          break;

        case 'notification':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(880, now);
          oscillator.frequency.setValueAtTime(1108.73, now + 0.15);
          gainNode.gain.setValueAtTime(volume * 0.4, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;

        case 'glitch':
          oscillator.type = 'sawtooth';
          for (let i = 0; i < 5; i++) {
            oscillator.frequency.setValueAtTime(100 + Math.random() * 500, now + i * 0.02);
          }
          gainNode.gain.setValueAtTime(volume * 0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          oscillator.start(now);
          oscillator.stop(now + 0.1);
          break;
      }
    } catch (e) {
      console.warn('Sound effect failed:', e);
    }
  }, [config.enabled, config.volume]);

  const startAmbient = useCallback(() => {
    if (!config.ambientEnabled || ambientRef.current) return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create low drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.Q.setValueAtTime(5, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(config.volume * 0.05, ctx.currentTime);

      // Subtle frequency modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
      lfoGain.gain.setValueAtTime(10, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.start();
      ambientRef.current = osc;
      ambientGainRef.current = gain;
    } catch (e) {
      console.warn('Ambient sound failed:', e);
    }
  }, [config.ambientEnabled, config.volume]);

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      try {
        ambientRef.current.stop();
      } catch (e) {}
      ambientRef.current = null;
    }
    if (ambientGainRef.current) {
      ambientGainRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (config.ambientEnabled) {
      startAmbient();
    } else {
      stopAmbient();
    }

    return () => {
      stopAmbient();
    };
  }, [config.ambientEnabled, startAmbient, stopAmbient]);

  const updateConfig = useCallback((updates: Partial<SoundConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleSound = useCallback(() => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const toggleAmbient = useCallback(() => {
    setConfig(prev => ({ ...prev, ambientEnabled: !prev.ambientEnabled }));
  }, []);

  return {
    playSound,
    config,
    updateConfig,
    toggleSound,
    toggleAmbient,
  };
}
