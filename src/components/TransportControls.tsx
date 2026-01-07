import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

interface TransportControlsProps {
  isPlaying: boolean;
  isLoaded: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
}

export function TransportControls({
  isPlaying,
  isLoaded,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
}: TransportControlsProps) {
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    onVolumeChange(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange(volume);
      setIsMuted(false);
    } else {
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="studio-panel p-4"
    >
      <div className="flex items-center justify-between gap-6">
        {/* Transport buttons */}
        <div className="flex items-center gap-3">
          {/* Stop */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
            disabled={!isLoaded}
            className="transport-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square className="w-5 h-5" />
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? onPause : onPlay}
            disabled={!isLoaded}
            className={`transport-btn-play text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
              isPlaying ? 'active' : ''
            }`}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </motion.button>
        </div>

        {/* Status indicator */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isPlaying 
                ? 'bg-glow-green animate-pulse-glow' 
                : isLoaded 
                  ? 'bg-primary' 
                  : 'bg-muted-foreground'
            }`} />
            <span className="font-display text-xs tracking-wider text-muted-foreground">
              {isPlaying ? 'PLAYING' : isLoaded ? 'READY' : 'NO AUDIO'}
            </span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-3 min-w-[150px]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMute}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </motion.button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.01}
            className="flex-1"
          />
          
          <span className="font-mono text-xs text-muted-foreground w-8">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
