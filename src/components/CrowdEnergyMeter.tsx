import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Flame, TrendingUp } from 'lucide-react';
import type { CrowdEnergySimulation } from '@/types/audio';

interface CrowdEnergyMeterProps {
  crowdEnergy: CrowdEnergySimulation | null;
  currentTime: number;
  duration: number;
}

export function CrowdEnergyMeter({ crowdEnergy, currentTime, duration }: CrowdEnergyMeterProps) {
  const currentEnergy = useMemo(() => {
    if (!crowdEnergy?.energyCurve.length || duration === 0) return 0;
    const index = Math.floor((currentTime / duration) * crowdEnergy.energyCurve.length);
    return crowdEnergy.energyCurve[Math.min(index, crowdEnergy.energyCurve.length - 1)];
  }, [crowdEnergy, currentTime, duration]);

  const isNearPeak = useMemo(() => {
    if (!crowdEnergy) return false;
    return crowdEnergy.peakMoments.some(peak => Math.abs(peak - currentTime) < 2);
  }, [crowdEnergy, currentTime]);

  const isInBuildup = useMemo(() => {
    if (!crowdEnergy) return null;
    return crowdEnergy.buildupZones.find(zone => 
      currentTime >= zone.start && currentTime <= zone.end
    );
  }, [crowdEnergy, currentTime]);

  if (!crowdEnergy) {
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
          <Users className="w-4 h-4" />
          CROWD ENERGY SIMULATION
        </h3>
        <div className="flex items-center gap-2">
          <Flame 
            className={`w-4 h-4 transition-colors ${
              crowdEnergy.moshPitProbability > 70 ? 'text-orange-500' : 'text-muted-foreground'
            }`}
          />
          <span className="text-xs font-mono">
            {crowdEnergy.moshPitProbability.toFixed(0)}% MOSH
          </span>
        </div>
      </div>

      {/* Energy Bar */}
      <div className="relative">
        <div className="h-8 bg-muted/30 rounded-lg overflow-hidden">
          <motion.div
            className="h-full rounded-lg"
            style={{
              background: `linear-gradient(90deg, 
                hsl(var(--primary)) 0%, 
                hsl(var(--secondary)) 50%, 
                hsl(var(--glow-orange)) 100%
              )`,
            }}
            animate={{ width: `${currentEnergy}%` }}
            transition={{ duration: 0.1 }}
          />
          
          {/* Peak markers */}
          {crowdEnergy.peakMoments.map((peak, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-white/50"
              style={{ left: `${(peak / duration) * 100}%` }}
            />
          ))}
        </div>
        
        {/* Current energy indicator */}
        <motion.div
          className="absolute -top-1 transform -translate-x-1/2"
          style={{ left: `${currentEnergy}%` }}
          animate={{ y: isNearPeak ? [-2, 0] : 0 }}
          transition={{ duration: 0.2, repeat: isNearPeak ? Infinity : 0 }}
        >
          <div className={`text-lg ${isNearPeak ? 'text-orange-500' : 'text-primary'}`}>
            ▼
          </div>
        </motion.div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between text-xs">
        {isInBuildup ? (
          <motion.div
            className="flex items-center gap-2 text-orange-400"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <TrendingUp className="w-4 h-4" />
            <span>BUILDUP DETECTED</span>
          </motion.div>
        ) : isNearPeak ? (
          <motion.div
            className="flex items-center gap-2 text-red-400"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <Flame className="w-4 h-4" />
            <span>PEAK MOMENT!</span>
          </motion.div>
        ) : (
          <span className="text-muted-foreground">Monitoring crowd response...</span>
        )}
        
        <span className="font-mono text-muted-foreground">
          {crowdEnergy.peakMoments.length} peaks | {crowdEnergy.buildupZones.length} buildups
        </span>
      </div>

      {/* Energy Curve Visualization */}
      <div className="h-12 bg-muted/20 rounded-lg overflow-hidden relative">
        <svg 
          viewBox="0 0 200 40" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={`
              M 0 40
              ${crowdEnergy.energyCurve.map((e, i) => 
                `L ${(i / crowdEnergy.energyCurve.length) * 200} ${40 - (e / 100) * 38}`
              ).join(' ')}
              L 200 40
              Z
            `}
            fill="url(#energyGradient)"
          />
          
          {/* Line */}
          <path
            d={`
              M 0 ${40 - (crowdEnergy.energyCurve[0] / 100) * 38}
              ${crowdEnergy.energyCurve.map((e, i) => 
                `L ${(i / crowdEnergy.energyCurve.length) * 200} ${40 - (e / 100) * 38}`
              ).join(' ')}
            `}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="1"
          />
          
          {/* Playhead */}
          <line
            x1={(currentTime / duration) * 200}
            y1="0"
            x2={(currentTime / duration) * 200}
            y2="40"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Drop Impact Indicators */}
      {crowdEnergy.dropImpact.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground mr-2">Drops:</span>
          {crowdEnergy.dropImpact.slice(0, 8).map((time, i) => (
            <motion.div
              key={i}
              className="px-2 py-0.5 rounded-full text-xs bg-orange-500/20 text-orange-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {time.toFixed(1)}s
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
