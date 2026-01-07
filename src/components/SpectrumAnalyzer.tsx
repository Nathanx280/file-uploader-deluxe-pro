import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SpectrumAnalyzerProps {
  analyserNode: AnalyserNode | null;
  isPlaying: boolean;
}

export function SpectrumAnalyzer({ analyserNode, isPlaying }: SpectrumAnalyzerProps) {
  const [bars, setBars] = useState<number[]>(Array(32).fill(0));
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!analyserNode || !isPlaying) {
      // Idle animation when not playing
      const idleAnimation = () => {
        setBars(prev => prev.map((_, i) => {
          const baseHeight = 0.1 + Math.sin(Date.now() / 1000 + i * 0.3) * 0.05;
          return baseHeight;
        }));
        animationRef.current = requestAnimationFrame(idleAnimation);
      };
      idleAnimation();
      return () => cancelAnimationFrame(animationRef.current);
    }

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const analyze = () => {
      analyserNode.getByteFrequencyData(dataArray);
      
      // Sample 32 frequency bands
      const newBars: number[] = [];
      const bandSize = Math.floor(bufferLength / 32);
      
      for (let i = 0; i < 32; i++) {
        let sum = 0;
        for (let j = 0; j < bandSize; j++) {
          sum += dataArray[i * bandSize + j];
        }
        newBars.push((sum / bandSize) / 255);
      }
      
      setBars(newBars);
      animationRef.current = requestAnimationFrame(analyze);
    };

    analyze();
    return () => cancelAnimationFrame(animationRef.current);
  }, [analyserNode, isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="studio-panel p-4"
    >
      <h3 className="font-display text-sm font-semibold text-secondary tracking-wide mb-3">
        SPECTRUM ANALYZER
      </h3>

      <div className="h-24 flex items-end justify-between gap-1 bg-background/50 rounded-lg p-2">
        {bars.map((height, i) => {
          // Color gradient based on frequency
          const hue = 185 + (i / bars.length) * 115; // cyan to magenta
          return (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              animate={{ height: `${Math.max(height * 100, 5)}%` }}
              transition={{ duration: 0.05 }}
              style={{
                background: `linear-gradient(to top, 
                  hsl(${hue}, 100%, 50%),
                  hsl(${hue}, 100%, 60%)
                )`,
                boxShadow: `0 0 ${height * 15}px hsl(${hue}, 100%, 50%, ${height * 0.6})`,
              }}
            />
          );
        })}
      </div>

      {/* Frequency labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
        <span>20Hz</span>
        <span>500Hz</span>
        <span>2kHz</span>
        <span>8kHz</span>
        <span>20kHz</span>
      </div>
    </motion.div>
  );
}
