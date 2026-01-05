import React from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useSound } from '@/contexts/SoundContext';

export default function SoundControls() {
  const { config, updateConfig, toggleSound, toggleAmbient, playSound } = useSound();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-primary"
          onClick={() => playSound('click')}
        >
          {config.enabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
          {config.ambientEnabled && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-4 bg-background/95 backdrop-blur-lg border-primary/20" 
        align="end"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-foreground">Sound Effects</span>
            <Switch
              checked={config.enabled}
              onCheckedChange={toggleSound}
            />
          </div>

          {config.enabled && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">Volume</span>
                  <span className="text-xs font-mono text-primary">
                    {Math.round(config.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[config.volume]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([value]) => {
                    updateConfig({ volume: value });
                    playSound('click');
                  }}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-mono text-foreground">Ambient</span>
                </div>
                <Switch
                  checked={config.ambientEnabled}
                  onCheckedChange={toggleAmbient}
                />
              </div>
              
              {config.ambientEnabled && (
                <p className="text-[10px] text-muted-foreground font-mono">
                  Low frequency drone for immersive hacker atmosphere
                </p>
              )}
            </>
          )}

          <div className="pt-2 border-t border-primary/10">
            <button
              onClick={() => playSound('success')}
              className="text-xs text-primary hover:underline font-mono"
            >
              Test sound →
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
