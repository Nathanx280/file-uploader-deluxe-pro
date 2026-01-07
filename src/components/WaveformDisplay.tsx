import { useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface WaveformDisplayProps {
  waveformData: number[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
}

export function WaveformDisplay({
  waveformData,
  currentTime,
  duration,
  onSeek,
  isPlaying,
}: WaveformDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? currentTime / duration : 0;

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || duration === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  }, [duration, onSeek]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const bars = useMemo(() => {
    if (waveformData.length === 0) {
      return Array(100).fill(0).map(() => Math.random() * 0.3 + 0.1);
    }
    return waveformData;
  }, [waveformData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="studio-panel-glow p-4 space-y-3"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm font-semibold text-primary tracking-wide">
          WAVEFORM
        </h3>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-primary">{formatTime(currentTime)}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Waveform visualization */}
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative h-32 bg-background/50 rounded-lg overflow-hidden cursor-pointer waveform-grid"
      >
        {/* Waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-2">
          {bars.map((height, i) => {
            const isPlayed = i / bars.length < progress;
            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.005, duration: 0.3 }}
                className="flex-1 flex flex-col items-center gap-[2px]"
              >
                {/* Top bar */}
                <div
                  className="w-full rounded-t-sm transition-all duration-150"
                  style={{
                    height: `${height * 50}%`,
                    background: isPlayed
                      ? 'linear-gradient(to top, hsl(var(--primary)), hsl(var(--secondary)))'
                      : 'hsl(var(--muted))',
                    boxShadow: isPlayed ? '0 0 10px hsl(var(--primary) / 0.5)' : 'none',
                  }}
                />
                {/* Bottom bar (mirror) */}
                <div
                  className="w-full rounded-b-sm transition-all duration-150"
                  style={{
                    height: `${height * 30}%`,
                    background: isPlayed
                      ? 'linear-gradient(to bottom, hsl(var(--primary) / 0.7), hsl(var(--primary) / 0.3))'
                      : 'hsl(var(--muted) / 0.5)',
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Playhead */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
          style={{ left: `${progress * 100}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary glow-cyan" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary glow-cyan" />
        </motion.div>

        {/* Playing indicator animation */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-primary/20 to-transparent animate-scanner"
              style={{ left: `${progress * 100 - 5}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
