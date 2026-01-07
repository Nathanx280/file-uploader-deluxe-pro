import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { EmotionalDNA } from '@/types/audio';

interface EmotionalArcProps {
  emotionalDNA: EmotionalDNA | null;
  currentTime: number;
  duration: number;
}

const emotionColors: Record<string, string> = {
  euphoric: '#ff00ff',
  energetic: '#ff4400',
  melancholic: '#0044ff',
  peaceful: '#00ff88',
  tense: '#ff0000',
  mysterious: '#440088',
  triumphant: '#ffcc00',
  nostalgic: '#ff8866',
  neutral: '#666666',
};

export function EmotionalArc({ emotionalDNA, currentTime, duration }: EmotionalArcProps) {
  const arcPath = useMemo(() => {
    if (!emotionalDNA?.emotionalArc.length) return '';
    
    const points = emotionalDNA.emotionalArc.map((point, i) => {
      const x = (i / emotionalDNA.emotionalArc.length) * 100;
      const y = 50 - point.intensity * 40;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    });
    
    return points.join(' ');
  }, [emotionalDNA]);

  const currentProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const currentEmotion = useMemo(() => {
    if (!emotionalDNA?.emotionalArc.length) return null;
    const index = Math.floor((currentTime / duration) * emotionalDNA.emotionalArc.length);
    return emotionalDNA.emotionalArc[Math.min(index, emotionalDNA.emotionalArc.length - 1)];
  }, [emotionalDNA, currentTime, duration]);

  if (!emotionalDNA) {
    return (
      <div className="studio-panel-glow p-4">
        <div className="text-center text-muted-foreground text-sm">
          Load audio to see emotional arc
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="studio-panel-glow p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-secondary tracking-wide">
          EMOTIONAL ARC
        </h3>
        {currentEmotion && (
          <div className="flex items-center gap-2">
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: emotionColors[currentEmotion.emotion] }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium capitalize">
              {currentEmotion.emotion}
            </span>
          </div>
        )}
      </div>

      {/* Valence/Arousal Display */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-muted-foreground mb-1">VALENCE</div>
          <div 
            className="text-lg font-display font-bold"
            style={{ 
              color: emotionalDNA.valence > 0 ? '#00ff88' : '#ff4444' 
            }}
          >
            {emotionalDNA.valence > 0 ? '+' : ''}{(emotionalDNA.valence * 100).toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">AROUSAL</div>
          <div 
            className="text-lg font-display font-bold"
            style={{ 
              color: emotionalDNA.arousal > 0 ? '#ff8800' : '#4488ff' 
            }}
          >
            {(Math.abs(emotionalDNA.arousal) * 100).toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">TENSION</div>
          <div 
            className="text-lg font-display font-bold text-secondary"
          >
            {emotionalDNA.tension.toFixed(0)}
          </div>
        </div>
      </div>

      {/* SVG Arc Visualization */}
      <div className="relative h-20 bg-muted/20 rounded-lg overflow-hidden">
        <svg 
          viewBox="0 0 100 60" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {emotionalDNA.emotionalArc.map((point, i) => (
                <stop
                  key={i}
                  offset={`${(i / emotionalDNA.emotionalArc.length) * 100}%`}
                  stopColor={emotionColors[point.emotion] || '#666666'}
                  stopOpacity={0.8}
                />
              ))}
            </linearGradient>
          </defs>
          
          {/* Arc path */}
          <motion.path
            d={arcPath}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* Playhead */}
          <motion.line
            x1={currentProgress}
            y1="0"
            x2={currentProgress}
            y2="60"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        </svg>

        {/* Color signature overlay */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ 
            background: `linear-gradient(90deg, ${emotionalDNA.colorSignature}00, ${emotionalDNA.colorSignature}, ${emotionalDNA.colorSignature}00)` 
          }}
        />
      </div>

      {/* Emotion Legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(emotionColors).slice(0, 6).map(([emotion, color]) => (
          <div 
            key={emotion}
            className="flex items-center gap-1 text-xs"
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground capitalize">{emotion}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
