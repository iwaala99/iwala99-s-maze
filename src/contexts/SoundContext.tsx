import React, { createContext, useContext, ReactNode } from 'react';
import { useSoundEffects, SoundType } from '@/hooks/useSoundEffects';

interface SoundContextType {
  playSound: (type: SoundType) => void;
  config: {
    enabled: boolean;
    volume: number;
    ambientEnabled: boolean;
  };
  updateConfig: (updates: Partial<{ enabled: boolean; volume: number; ambientEnabled: boolean }>) => void;
  toggleSound: () => void;
  toggleAmbient: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const soundEffects = useSoundEffects();

  return (
    <SoundContext.Provider value={soundEffects}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
