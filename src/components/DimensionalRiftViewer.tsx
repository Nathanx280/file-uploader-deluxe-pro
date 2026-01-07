import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, AlertTriangle, Sparkles } from 'lucide-react';
import type { DimensionalRift } from '@/types/audio';

interface DimensionalRiftViewerProps {
  dimensionalRift: DimensionalRift | null;
  currentTime: number;
  duration: number;
}

const riftColors: Record<string, string> = {
  temporal: '#ff00ff',
  harmonic: '#00ffff',
  textural: '#ffff00',
  spatial: '#ff8800',
};

export function DimensionalRiftViewer({ 
  dimensionalRift, 
  currentTime, 
  duration 
}: DimensionalRiftViewerProps) {
  const activeRift = useMemo(() => {
    if (!dimensionalRift) return null;
    return dimensionalRift.riftPoints.find(rift => 
      Math.abs(rift.time - currentTime) < 1
    );
  }, [dimensionalRift, currentTime]);

  if (!dimensionalRift) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="studio-panel-glow p-4 space-y-4 relative overflow-hidden"
    >
      {/* Dimensional bleed effect */}
      {activeRift && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.5 }}
          style={{
            background: `radial-gradient(circle at center, ${riftColors[activeRift.riftType]}40, transparent 70%)`,
          }}
        />
      )}

      <div className="flex items-center justify-between relative z-10">
        <h3 className="font-display text-sm font-semibold text-secondary tracking-wide flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          DIMENSIONAL RIFT DETECTOR
        </h3>
        <div className="flex items-center gap-2">
          {dimensionalRift.realityStability < 50 && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </motion.div>
          )}
          <span className="text-xs font-mono">
            {dimensionalRift.parallelTimelines} TIMELINES
          </span>
        </div>
      </div>

      {/* Reality Stability Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">REALITY STABILITY</span>
          <span 
            className="font-mono font-bold"
            style={{
              color: dimensionalRift.realityStability > 70 ? '#00ff88' :
                     dimensionalRift.realityStability > 40 ? '#ffaa00' : '#ff4444'
            }}
          >
            {dimensionalRift.realityStability.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: dimensionalRift.realityStability > 70 
                ? 'linear-gradient(90deg, #00ff88, #44ff88)'
                : dimensionalRift.realityStability > 40
                ? 'linear-gradient(90deg, #ff8800, #ffaa00)'
                : 'linear-gradient(90deg, #ff0044, #ff4444)',
            }}
            animate={{ 
              width: `${dimensionalRift.realityStability}%`,
              opacity: [1, 0.8, 1],
            }}
            transition={{ duration: 0.5, opacity: { duration: 1, repeat: Infinity } }}
          />
          
          {/* Glitch effect when unstable */}
          {dimensionalRift.realityStability < 50 && (
            <motion.div
              className="absolute inset-0 bg-white/10"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 0.5 }}
            />
          )}
        </div>
      </div>

      {/* Rift Timeline */}
      <div className="relative h-20 bg-muted/20 rounded-lg overflow-hidden">
        {/* Time markers */}
        <div className="absolute inset-0 flex">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 border-r border-muted/30 last:border-r-0"
            />
          ))}
        </div>
        
        {/* Rift points */}
        {dimensionalRift.riftPoints.map((rift, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${(rift.time / duration) * 100}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{ delay: i * 0.05 }}
          >
            <motion.div
              className="relative"
              animate={{
                scale: Math.abs(rift.time - currentTime) < 1 ? [1, 1.5, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: riftColors[rift.riftType],
                  boxShadow: `0 0 ${rift.intensity / 5}px ${riftColors[rift.riftType]}`,
                }}
              />
              
              {/* Rift label on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-background/90 px-2 py-1 rounded text-xs">
                  <div className="font-medium">{rift.alternateReality}</div>
                  <div className="text-muted-foreground text-[10px]">{rift.riftType}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
        
        {/* Playhead */}
        <motion.div
          className="absolute top-0 bottom-0 w-0.5 bg-primary"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      {/* Active Rift Display */}
      <AnimatePresence>
        {activeRift && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg text-center"
            style={{
              background: `linear-gradient(135deg, ${riftColors[activeRift.riftType]}20, transparent)`,
              borderColor: riftColors[activeRift.riftType],
              borderWidth: 1,
            }}
          >
            <Sparkles 
              className="w-6 h-6 mx-auto mb-2"
              style={{ color: riftColors[activeRift.riftType] }}
            />
            <div className="text-sm font-medium">{activeRift.alternateReality}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {activeRift.riftType} rift @ {activeRift.intensity.toFixed(0)}% intensity
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rift Type Legend */}
      <div className="flex justify-center gap-4 text-xs">
        {Object.entries(riftColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground capitalize">{type}</span>
          </div>
        ))}
      </div>

      {/* Dimensional Bleed Indicator */}
      <div className="text-center text-xs text-muted-foreground">
        <span className="font-mono">
          DIMENSIONAL BLEED: {dimensionalRift.dimensionalBleed.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  );
}
