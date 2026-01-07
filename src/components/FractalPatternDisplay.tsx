import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Repeat, Infinity as InfinityIcon } from 'lucide-react';
import type { TemporalFractal } from '@/types/audio';

interface FractalPatternDisplayProps {
  fractal: TemporalFractal | null;
  currentTime: number;
  duration: number;
}

export function FractalPatternDisplay({ 
  fractal, 
  currentTime, 
  duration 
}: FractalPatternDisplayProps) {
  const nearZoomPoint = useMemo(() => {
    if (!fractal) return false;
    return fractal.infiniteZoomPoints.some(point => Math.abs(point - currentTime) < 0.5);
  }, [fractal, currentTime]);

  if (!fractal) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="studio-panel-glow p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-secondary tracking-wide flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          TEMPORAL FRACTAL ANALYSIS
        </h3>
        {nearZoomPoint && (
          <motion.div
            className="flex items-center gap-1 text-xs text-primary"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          >
            <InfinityIcon className="w-3 h-3" />
            INFINITE ZOOM
          </motion.div>
        )}
      </div>

      {/* Fractal Dimension Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-muted/20 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">FRACTAL DIMENSION</div>
          <motion.div
            className="text-3xl font-display font-bold text-primary"
            animate={{ scale: nearZoomPoint ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {fractal.fractalDimension.toFixed(3)}
          </motion.div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {fractal.fractalDimension > 1.5 ? 'Complex' : 
             fractal.fractalDimension > 1.2 ? 'Moderate' : 'Simple'}
          </div>
        </div>
        
        <div className="text-center p-3 bg-muted/20 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">SELF-SIMILARITY</div>
          <motion.div
            className="text-3xl font-display font-bold text-secondary"
          >
            {fractal.selfSimilarityScore.toFixed(0)}%
          </motion.div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {fractal.recursivePatterns.length} patterns found
          </div>
        </div>
      </div>

      {/* Fractal Visualization */}
      <div className="relative h-24 bg-muted/20 rounded-lg overflow-hidden">
        {/* Mandelbrot-inspired visualization */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const scale = 1 + i * 0.1;
            const opacity = 1 - i * 0.04;
            return (
              <motion.div
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                animate={nearZoomPoint ? {
                  rotate: [0, 360],
                  scale: [scale, scale * 1.1, scale],
                } : { rotate: i * 18 }}
              transition={{ 
                  duration: nearZoomPoint ? 2 : 10, 
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              >
                <div
                  className="border border-primary/30 rounded-lg"
                  style={{
                    width: `${80 - i * 3}%`,
                    height: `${80 - i * 3}%`,
                    opacity,
                    transform: `rotate(${i * 15}deg)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
        
        {/* Center indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-4 h-4 bg-primary rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </div>

      {/* Recursive Patterns */}
      {fractal.recursivePatterns.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Repeat className="w-3 h-3" />
            RECURSIVE PATTERNS
          </div>
          <div className="max-h-24 overflow-y-auto space-y-1">
            {fractal.recursivePatterns.slice(0, 5).map((pattern, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between text-xs p-2 bg-muted/20 rounded"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="font-mono">
                  {pattern.startTime.toFixed(1)}s
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    ×{pattern.repetitionScale}
                  </span>
                  <div className="w-16 h-1 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${pattern.similarity}%` }}
                    />
                  </div>
                  <span className="font-mono text-secondary">
                    {pattern.similarity.toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Infinite Zoom Points */}
      {fractal.infiniteZoomPoints.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          <span className="text-xs text-muted-foreground mr-2">
            <InfinityIcon className="w-3 h-3 inline mr-1" />
            Zoom points:
          </span>
          {fractal.infiniteZoomPoints.map((point, i) => (
            <motion.div
              key={i}
              className="px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary"
              animate={Math.abs(point - currentTime) < 0.5 ? {
                scale: [1, 1.2, 1],
                boxShadow: ['0 0 0px hsl(var(--primary))', '0 0 10px hsl(var(--primary))', '0 0 0px hsl(var(--primary))'],
              } : {}}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {point.toFixed(1)}s
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
