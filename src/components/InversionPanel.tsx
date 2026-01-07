import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import type { InversionDimension } from '@/types/audio';

interface InversionPanelProps {
  dimensions: InversionDimension[];
  onChange: (dimensionId: string, value: number) => void;
  onReset: () => void;
}

const dimensionIcons: Record<string, string> = {
  phase: '◐',
  time: '⏱',
  spectral: '◇',
  dynamics: '≋',
  pitch: '♪',
  rhythm: '◆',
};

export function InversionPanel({ dimensions, onChange, onReset }: InversionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="studio-panel-glow p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-secondary tracking-wide">
          INVERSION MATRIX
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-primary"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          RESET
        </Button>
      </div>

      <div className="space-y-4">
        {dimensions.map((dim, index) => (
          <motion.div
            key={dim.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{dimensionIcons[dim.id] || '○'}</span>
                <div>
                  <span className="text-sm font-medium">{dim.name}</span>
                  <p className="text-xs text-muted-foreground">{dim.description}</p>
                </div>
              </div>
              <span 
                className="font-mono text-sm min-w-[3rem] text-right"
                style={{
                  color: dim.value > 50 
                    ? `hsl(${300 - (dim.value - 50) * 2.3}, 80%, 60%)` 
                    : 'hsl(var(--muted-foreground))'
                }}
              >
                {dim.value}%
              </span>
            </div>
            
            <div className="relative">
              <Slider
                value={[dim.value]}
                onValueChange={(value) => onChange(dim.id, value[0])}
                min={dim.min}
                max={dim.max}
                step={1}
                className="w-full"
              />
              {/* Glow effect when value is high */}
              {dim.value > 70 && (
                <div 
                  className="absolute inset-0 pointer-events-none rounded-full opacity-50"
                  style={{
                    boxShadow: `0 0 ${dim.value / 5}px hsl(var(--secondary))`,
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total inversion meter */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-muted-foreground">TOTAL INVERSION</span>
          <span className="font-display text-lg font-bold glow-text-secondary">
            {Math.round(dimensions.reduce((acc, dim) => acc + dim.value, 0) / dimensions.length)}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--glow-orange)))',
              width: `${dimensions.reduce((acc, dim) => acc + dim.value, 0) / dimensions.length}%`,
              boxShadow: '0 0 10px hsl(var(--secondary) / 0.5)',
            }}
            animate={{
              width: `${dimensions.reduce((acc, dim) => acc + dim.value, 0) / dimensions.length}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
