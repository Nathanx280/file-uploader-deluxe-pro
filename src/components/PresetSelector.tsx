import { motion } from 'framer-motion';
import type { Preset } from '@/types/audio';

interface PresetSelectorProps {
  presets: Preset[];
  activePreset: string | null;
  onSelectPreset: (presetId: string) => void;
}

export function PresetSelector({ presets, activePreset, onSelectPreset }: PresetSelectorProps) {
  const categories = {
    basic: presets.filter(p => p.category === 'basic' || !p.category),
    experimental: presets.filter(p => p.category === 'experimental'),
    creative: presets.filter(p => p.category === 'creative'),
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'experimental':
        return 'text-secondary';
      case 'creative':
        return 'text-glow-orange';
      default:
        return 'text-primary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="studio-panel p-4 space-y-4"
    >
      <h3 className="font-display text-sm font-semibold text-primary tracking-wide">
        PRESETS
      </h3>

      <div className="space-y-3">
        {Object.entries(categories).map(([category, categoryPresets]) => 
          categoryPresets.length > 0 && (
            <div key={category} className="space-y-2">
              <span className={`text-xs font-mono uppercase ${getCategoryColor(category)}`}>
                {category}
              </span>
              <div className="flex flex-wrap gap-2">
                {categoryPresets.map((preset, index) => (
                  <motion.button
                    key={preset.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectPreset(preset.id)}
                    className={`preset-chip ${activePreset === preset.id ? 'active' : ''}`}
                    title={preset.description}
                  >
                    {preset.name}
                  </motion.button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
