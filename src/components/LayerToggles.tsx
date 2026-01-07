import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { AudioLayer } from '@/types/audio';

interface LayerTogglesProps {
  layers: AudioLayer[];
  onToggleLayer: (layerId: string) => void;
  onLayerVolumeChange: (layerId: string, volume: number) => void;
}

export function LayerToggles({ layers, onToggleLayer, onLayerVolumeChange }: LayerTogglesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="studio-panel p-4 space-y-4"
    >
      <h3 className="font-display text-sm font-semibold text-primary tracking-wide">
        STEM LAYERS
      </h3>

      <div className="space-y-3">
        {layers.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              layer.enabled 
                ? 'bg-muted/30 border-border' 
                : 'bg-muted/10 border-transparent opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: layer.color,
                    boxShadow: layer.enabled 
                      ? `0 0 10px ${layer.color}` 
                      : 'none',
                  }}
                />
                <span className="font-medium text-sm">{layer.name}</span>
              </div>
              <Switch
                checked={layer.enabled}
                onCheckedChange={() => onToggleLayer(layer.id)}
              />
            </div>
            
            {layer.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs text-muted-foreground w-8">VOL</span>
                <Slider
                  value={[layer.volume]}
                  onValueChange={(value) => onLayerVolumeChange(layer.id, value[0])}
                  max={1}
                  step={0.01}
                  className="flex-1"
                />
                <span className="text-xs font-mono w-8 text-right">
                  {Math.round(layer.volume * 100)}%
                </span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Solo/Mute all buttons */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button className="flex-1 py-2 rounded-lg bg-muted/50 text-xs font-mono text-muted-foreground hover:text-primary hover:bg-muted transition-colors">
          SOLO
        </button>
        <button className="flex-1 py-2 rounded-lg bg-muted/50 text-xs font-mono text-muted-foreground hover:text-destructive hover:bg-muted transition-colors">
          MUTE ALL
        </button>
      </div>
    </motion.div>
  );
}
