import { motion } from 'framer-motion';
import { Brain, Radio, Waves } from 'lucide-react';
import type { ConsciousnessSync } from '@/types/audio';

interface ConsciousnessPanelProps {
  consciousness: ConsciousnessSync | null;
}

const brainwaveInfo: Record<string, { range: string; state: string; color: string }> = {
  delta: { range: '0.5-4 Hz', state: 'Deep Sleep', color: '#4400ff' },
  theta: { range: '4-8 Hz', state: 'Meditation', color: '#00ff88' },
  alpha: { range: '8-13 Hz', state: 'Relaxed Focus', color: '#ffcc00' },
  beta: { range: '13-30 Hz', state: 'Active Thinking', color: '#ff8800' },
  gamma: { range: '30-100 Hz', state: 'Peak Performance', color: '#ff00ff' },
};

export function ConsciousnessPanel({ consciousness }: ConsciousnessPanelProps) {
  if (!consciousness) {
    return null;
  }

  const waveInfo = brainwaveInfo[consciousness.brainwaveTarget];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="studio-panel-glow p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-secondary tracking-wide flex items-center gap-2">
          <Brain className="w-4 h-4" />
          CONSCIOUSNESS SYNC
        </h3>
        <motion.div
          className="flex items-center gap-1"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Radio className="w-3 h-3 text-primary" />
          <span className="text-xs font-mono">ENTRAINING</span>
        </motion.div>
      </div>

      {/* Brainwave Target */}
      <div className="text-center p-4 bg-muted/20 rounded-lg relative overflow-hidden">
        {/* Animated wave background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${20 + i * 15}% 50%, ${waveInfo.color}40, transparent 30%)`,
              }}
              animate={{
                x: ['-20%', '20%', '-20%'],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <motion.div
            className="text-4xl font-display font-bold mb-2"
            style={{ color: waveInfo.color }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {consciousness.brainwaveTarget.toUpperCase()}
          </motion.div>
          <div className="text-sm text-muted-foreground">{waveInfo.range}</div>
          <div className="text-xs text-muted-foreground mt-1">{waveInfo.state}</div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="BINAURAL OFFSET"
          value={`${consciousness.binauralOffset.toFixed(2)} Hz`}
          color={waveInfo.color}
          percentage={consciousness.binauralOffset * 2.5}
        />
        <MetricCard
          label="ISOCHRONIC PULSE"
          value={`${consciousness.isochronicPulse.toFixed(1)} Hz`}
          color={waveInfo.color}
          percentage={Math.min(consciousness.isochronicPulse, 100)}
        />
        <MetricCard
          label="ENTRAINMENT"
          value={`${consciousness.entrainmentStrength.toFixed(0)}%`}
          color="#ff8800"
          percentage={consciousness.entrainmentStrength}
        />
        <MetricCard
          label="FLOW STATE"
          value={`${consciousness.flowStateScore.toFixed(0)}%`}
          color="#00ff88"
          percentage={consciousness.flowStateScore}
        />
      </div>

      {/* Meditation Depth */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">MEDITATION DEPTH</span>
          <span className="font-mono" style={{ color: waveInfo.color }}>
            {consciousness.meditationDepth.toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: waveInfo.color }}
            initial={{ width: 0 }}
            animate={{ width: `${consciousness.meditationDepth}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Brainwave Selector Visual */}
      <div className="flex justify-between items-end h-12 px-2">
        {Object.entries(brainwaveInfo).map(([wave, info], i) => (
          <motion.div
            key={wave}
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div
              className="w-6 rounded-t-sm transition-all"
              style={{
                backgroundColor: wave === consciousness.brainwaveTarget ? info.color : '#333',
                height: wave === consciousness.brainwaveTarget ? '24px' : '12px',
              }}
              animate={wave === consciousness.brainwaveTarget ? {
                boxShadow: [`0 0 10px ${info.color}`, `0 0 20px ${info.color}`, `0 0 10px ${info.color}`],
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className={`text-[8px] ${
              wave === consciousness.brainwaveTarget ? 'text-white' : 'text-muted-foreground'
            }`}>
              {wave.charAt(0).toUpperCase()}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  color: string;
  percentage: number;
}

function MetricCard({ label, value, color, percentage }: MetricCardProps) {
  return (
    <div className="bg-muted/20 rounded-lg p-2 space-y-1">
      <div className="text-[10px] text-muted-foreground tracking-wider">{label}</div>
      <div className="text-sm font-mono font-bold" style={{ color }}>{value}</div>
      <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
