import { motion } from 'framer-motion';
import { Music2, Gauge, Zap, Volume1, Activity, Heart } from 'lucide-react';
import type { TrackAnalysis } from '@/types/audio';

interface TrackAnalysisDisplayProps {
  analysis: TrackAnalysis;
}

export function TrackAnalysisDisplay({ analysis }: TrackAnalysisDisplayProps) {
  const stats = [
    {
      icon: Music2,
      label: 'BPM',
      value: analysis.bpm || '--',
      color: 'text-primary',
    },
    {
      icon: Gauge,
      label: 'KEY',
      value: analysis.key || '--',
      color: 'text-secondary',
    },
    {
      icon: Zap,
      label: 'ENERGY',
      value: analysis.energy ? `${Math.round(analysis.energy)}%` : '--',
      color: 'text-glow-orange',
    },
    {
      icon: Volume1,
      label: 'LOUDNESS',
      value: analysis.loudness ? `${analysis.loudness.toFixed(1)} dB` : '--',
      color: 'text-glow-green',
    },
    {
      icon: Activity,
      label: 'DANCE',
      value: analysis.danceability ? `${Math.round(analysis.danceability)}%` : '--',
      color: 'text-glow-purple',
    },
    {
      icon: Heart,
      label: 'MOOD',
      value: analysis.mood || '--',
      color: 'text-secondary',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="studio-panel p-4 space-y-4"
    >
      <h3 className="font-display text-sm font-semibold text-secondary tracking-wide">
        TRACK ANALYSIS
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-1"
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground font-mono">
                {stat.label}
              </span>
            </div>
            <p className={`font-display font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Energy visualization */}
      {analysis.energy > 0 && (
        <div className="pt-3 border-t border-border space-y-2">
          <span className="text-xs font-mono text-muted-foreground">ENERGY PROFILE</span>
          <div className="h-8 flex items-end gap-1">
            {Array(16).fill(0).map((_, i) => {
              const height = Math.sin((i / 16) * Math.PI) * analysis.energy;
              return (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 10)}%` }}
                  transition={{ delay: 0.5 + i * 0.03, duration: 0.5 }}
                  style={{
                    background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--glow-orange)))`,
                    opacity: 0.5 + (height / 200),
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
