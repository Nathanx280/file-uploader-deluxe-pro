import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shuffle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { ProbabilityWave, QuantumBeatGrid } from '@/types/audio';

interface QuantumMixerProps {
  probabilityWave: ProbabilityWave | null;
  quantumBeat: QuantumBeatGrid | null;
  onCollapse?: (variant: string) => void;
}

const variantColors: Record<string, string> = {
  original: '#00ff88',
  reversed: '#ff4488',
  pitched: '#ffaa00',
  stretched: '#44aaff',
  granular: '#aa44ff',
};

export function QuantumMixer({ probabilityWave, quantumBeat, onCollapse }: QuantumMixerProps) {
  const [observing, setObserving] = useState(false);
  const [collapsedState, setCollapsedState] = useState<string | null>(null);

  if (!probabilityWave || !quantumBeat) {
    return null;
  }

  const handleObserve = () => {
    setObserving(true);
    
    // Simulate quantum collapse
    setTimeout(() => {
      const states = probabilityWave.superpositionStates;
      const random = Math.random();
      let cumulative = 0;
      
      for (const state of states) {
        cumulative += state.probability;
        if (random <= cumulative) {
          setCollapsedState(state.audioVariant);
          onCollapse?.(state.audioVariant);
          break;
        }
      }
      
      setObserving(false);
    }, 1500);
  };

  const handleSuperpose = () => {
    setCollapsedState(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="studio-panel-glow p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-secondary tracking-wide flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          QUANTUM PROBABILITY MIXER
        </h3>
        <span className="text-xs font-mono text-muted-foreground">
          ψ = Σ|state⟩
        </span>
      </div>

      {/* Wave Function Visualization */}
      <div className="h-16 bg-muted/20 rounded-lg overflow-hidden relative">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="quantumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Wave function */}
          <motion.path
            d={`M 0 20 ${probabilityWave.waveFunction.map((v, i) => 
              `L ${(i / probabilityWave.waveFunction.length) * 100} ${20 - v * 15}`
            ).join(' ')}`}
            fill="none"
            stroke="url(#quantumGradient)"
            strokeWidth="1.5"
            animate={collapsedState ? {} : {
              d: [
                `M 0 20 ${probabilityWave.waveFunction.map((v, i) => 
                  `L ${(i / probabilityWave.waveFunction.length) * 100} ${20 - v * 15}`
                ).join(' ')}`,
                `M 0 20 ${probabilityWave.waveFunction.map((v, i) => 
                  `L ${(i / probabilityWave.waveFunction.length) * 100} ${20 - v * 15 * 0.8}`
                ).join(' ')}`,
                `M 0 20 ${probabilityWave.waveFunction.map((v, i) => 
                  `L ${(i / probabilityWave.waveFunction.length) * 100} ${20 - v * 15}`
                ).join(' ')}`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
        
        {/* Collapse animation */}
        <AnimatePresence>
          {observing && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-background/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Zap className="w-8 h-8 text-secondary" />
              </motion.div>
              <span className="ml-2 text-sm font-mono">Collapsing wave function...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Superposition States */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">SUPERPOSITION STATES</div>
        {probabilityWave.superpositionStates.map((state, i) => (
          <motion.div
            key={state.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
              collapsedState === state.audioVariant 
                ? 'bg-muted/50 ring-1 ring-primary' 
                : 'bg-muted/20'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: variantColors[state.audioVariant] }}
            />
            <span className="text-sm capitalize flex-1">{state.audioVariant}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: variantColors[state.audioVariant] }}
                  animate={{ 
                    width: collapsedState 
                      ? (collapsedState === state.audioVariant ? '100%' : '0%')
                      : `${state.probability * 100}%` 
                  }}
                />
              </div>
              <span className="text-xs font-mono w-10 text-right">
                {collapsedState 
                  ? (collapsedState === state.audioVariant ? '100%' : '0%')
                  : `${(state.probability * 100).toFixed(0)}%`
                }
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quantum Entanglement */}
      <div className="p-3 bg-muted/20 rounded-lg space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">QUANTUM ENTANGLEMENT</span>
          <span className="font-mono text-primary">
            {quantumBeat.quantumEntanglement.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            style={{ width: `${quantumBeat.quantumEntanglement}%` }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={handleObserve}
          disabled={observing || !!collapsedState}
          className="flex-1"
          variant="outline"
        >
          <Zap className="w-4 h-4 mr-2" />
          Observe (Collapse)
        </Button>
        <Button
          onClick={handleSuperpose}
          disabled={!collapsedState}
          className="flex-1"
          variant="outline"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Superpose
        </Button>
      </div>

      {/* Uncertainty Zones */}
      {probabilityWave.uncertaintyZones.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          <span className="font-mono">
            {probabilityWave.uncertaintyZones.length} uncertainty zones detected
          </span>
        </div>
      )}
    </motion.div>
  );
}
