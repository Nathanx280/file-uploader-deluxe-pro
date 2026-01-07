import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Palette } from 'lucide-react';
import type { SynaestheticMap } from '@/types/audio';

interface SynaestheticVisualizerProps {
  synaesthesia: SynaestheticMap | null;
  isPlaying: boolean;
}

export function SynaestheticVisualizer({ synaesthesia, isPlaying }: SynaestheticVisualizerProps) {
  if (!synaesthesia) {
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
          <Eye className="w-4 h-4" />
          SYNAESTHETIC VISUALIZER
        </h3>
        <span className="text-xs text-muted-foreground capitalize">
          {synaesthesia.synesthesiaType}
        </span>
      </div>

      {/* 3D Spatial Position */}
      <div className="relative h-32 bg-muted/20 rounded-lg overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 border-t border-muted"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 border-l border-muted"
              style={{ left: `${(i + 1) * 20}%` }}
            />
          ))}
        </div>
        
        {/* Sound position indicator */}
        <motion.div
          className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2"
          animate={isPlaying ? {
            left: `${50 + synaesthesia.spatialPosition.x * 30}%`,
            top: `${50 - synaesthesia.spatialPosition.y * 30}%`,
            scale: 0.8 + (synaesthesia.spatialPosition.z + 1) * 0.3,
          } : {}}
          transition={{ duration: 0.3 }}
          style={{
            left: `${50 + synaesthesia.spatialPosition.x * 30}%`,
            top: `${50 - synaesthesia.spatialPosition.y * 30}%`,
          }}
        >
          <div 
            className="w-full h-full rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${synaesthesia.frequencyColors[3]?.color || '#fff'}, transparent)`,
              boxShadow: `0 0 30px ${synaesthesia.frequencyColors[3]?.color || '#fff'}`,
            }}
          />
        </motion.div>
        
        {/* Axis labels */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">
          X: LEFT ← → RIGHT
        </div>
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground rotate-[-90deg] origin-left">
          Y: DOWN ← → UP
        </div>
      </div>

      {/* Frequency Color Spectrum */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <Palette className="w-3 h-3" />
          FREQUENCY → COLOR MAPPING
        </div>
        <div className="flex h-6 rounded-lg overflow-hidden">
          {synaesthesia.frequencyColors.map((fc, i) => (
            <motion.div
              key={i}
              className="flex-1"
              style={{ backgroundColor: fc.color }}
              animate={isPlaying ? {
                opacity: 0.5 + fc.intensity * 0.5,
                scale: [1, 1 + fc.intensity * 0.1, 1],
              } : { opacity: 0.5 + fc.intensity * 0.5 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>20 Hz</span>
          <span>1 kHz</span>
          <span>20 kHz</span>
        </div>
      </div>

      {/* Texture Profile */}
      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
        <span className="text-xs text-muted-foreground">TEXTURE</span>
        <motion.span 
          className="text-lg font-display font-bold capitalize"
          animate={isPlaying ? { opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            color: synaesthesia.frequencyColors[Math.floor(synaesthesia.frequencyColors.length / 2)]?.color,
          }}
        >
          {synaesthesia.textureProfile}
        </motion.span>
      </div>

      {/* Color Palette */}
      <div className="grid grid-cols-7 gap-1">
        {synaesthesia.frequencyColors.map((fc, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-sm"
            style={{ backgroundColor: fc.color }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
