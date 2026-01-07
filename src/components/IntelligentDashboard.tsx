import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Waves, Heart, Eye, Sparkles, Users, Layers, Zap, GitBranch, Radio } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { IntelligentAnalysis, RemixSuggestion } from '@/types/audio';

interface IntelligentDashboardProps {
  analysis: IntelligentAnalysis | null;
  suggestions: RemixSuggestion[];
  isAnalyzing: boolean;
  onApplySuggestion?: (suggestion: RemixSuggestion) => void;
}

const featureConfig = [
  { key: 'harmonics', icon: Waves, label: 'NEURAL HARMONICS', color: 'hsl(var(--primary))' },
  { key: 'quantum', icon: Sparkles, label: 'QUANTUM BEAT', color: 'hsl(var(--secondary))' },
  { key: 'emotional', icon: Heart, label: 'EMOTIONAL DNA', color: '#ff4488' },
  { key: 'synesthesia', icon: Eye, label: 'SYNAESTHESIA', color: '#44ff88' },
  { key: 'fractal', icon: GitBranch, label: 'TEMPORAL FRACTAL', color: '#ff8844' },
  { key: 'crowd', icon: Users, label: 'CROWD ENERGY', color: '#8844ff' },
  { key: 'texture', icon: Layers, label: 'SONIC TEXTURE', color: '#44aaff' },
  { key: 'probability', icon: Zap, label: 'PROBABILITY WAVE', color: '#ffaa44' },
  { key: 'dimensional', icon: GitBranch, label: 'DIMENSIONAL RIFT', color: '#ff44aa' },
  { key: 'consciousness', icon: Brain, label: 'CONSCIOUSNESS', color: '#88ff44' },
];

export function IntelligentDashboard({ 
  analysis, 
  suggestions, 
  isAnalyzing,
  onApplySuggestion 
}: IntelligentDashboardProps) {
  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="studio-panel-glow p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-display text-sm font-semibold text-secondary tracking-wide">
            NEURAL ANALYSIS IN PROGRESS
          </h3>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {featureConfig.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square rounded-lg bg-muted/50 flex items-center justify-center"
            >
              <feature.icon 
                className="w-6 h-6 animate-pulse"
                style={{ color: feature.color }}
              />
            </motion.div>
          ))}
        </div>
        <div className="mt-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
            Analyzing 10 dimensional layers...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!analysis) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="studio-panel-glow p-6 text-center"
      >
        <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-display text-sm font-semibold text-muted-foreground">
          LOAD AUDIO TO ENABLE
        </h3>
        <p className="text-xs text-muted-foreground mt-2">
          Intelligent analysis requires audio input
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Neural Harmonics */}
        <FeatureCard
          icon={Waves}
          label="NEURAL HARMONICS"
          color="hsl(var(--primary))"
          value={analysis.harmonicSignature.consonanceScore}
          detail={`${analysis.harmonicSignature.fundamentalFreq.toFixed(1)} Hz`}
        />
        
        {/* Quantum Beat */}
        <FeatureCard
          icon={Sparkles}
          label="QUANTUM BEAT"
          color="hsl(var(--secondary))"
          value={analysis.quantumBeatGrid.quantumEntanglement}
          detail={`Swing: ${analysis.quantumBeatGrid.swingFactor.toFixed(1)}%`}
        />
        
        {/* Emotional DNA */}
        <FeatureCard
          icon={Heart}
          label="EMOTIONAL DNA"
          color={analysis.emotionalDNA.colorSignature}
          value={Math.abs(analysis.emotionalDNA.valence) * 100}
          detail={analysis.emotionalDNA.valence > 0 ? 'Positive' : 'Melancholic'}
        />
        
        {/* Synesthesia */}
        <FeatureCard
          icon={Eye}
          label="SYNAESTHESIA"
          color="#44ff88"
          value={75}
          detail={analysis.synaestheticMap.textureProfile}
        />
        
        {/* Temporal Fractal */}
        <FeatureCard
          icon={GitBranch}
          label="TEMPORAL FRACTAL"
          color="#ff8844"
          value={analysis.temporalFractal.selfSimilarityScore}
          detail={`Dim: ${analysis.temporalFractal.fractalDimension.toFixed(2)}`}
        />
        
        {/* Crowd Energy */}
        <FeatureCard
          icon={Users}
          label="CROWD ENERGY"
          color="#8844ff"
          value={analysis.crowdEnergy.moshPitProbability}
          detail={`${analysis.crowdEnergy.peakMoments.length} peaks`}
        />
        
        {/* Sonic Texture */}
        <FeatureCard
          icon={Layers}
          label="SONIC TEXTURE"
          color="#44aaff"
          value={analysis.sonicTexture.layerDepth}
          detail={analysis.sonicTexture.textureType}
        />
        
        {/* Probability Wave */}
        <FeatureCard
          icon={Zap}
          label="PROBABILITY WAVE"
          color="#ffaa44"
          value={analysis.probabilityWave.superpositionStates[0].probability * 100}
          detail={`${analysis.probabilityWave.superpositionStates.length} states`}
        />
        
        {/* Dimensional Rift */}
        <FeatureCard
          icon={GitBranch}
          label="DIMENSIONAL RIFT"
          color="#ff44aa"
          value={analysis.dimensionalRift.realityStability}
          detail={`${analysis.dimensionalRift.parallelTimelines} timelines`}
        />
        
        {/* Consciousness Sync */}
        <FeatureCard
          icon={Brain}
          label="CONSCIOUSNESS"
          color="#88ff44"
          value={analysis.consciousnessSync.flowStateScore}
          detail={analysis.consciousnessSync.brainwaveTarget.toUpperCase()}
        />
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="studio-panel-glow p-4 space-y-3">
          <h3 className="font-display text-xs font-semibold text-secondary tracking-wide flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI REMIX SUGGESTIONS
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <motion.button
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onApplySuggestion?.(suggestion)}
                className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{suggestion.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    suggestion.impact === 'reality-bending' ? 'bg-secondary/20 text-secondary' :
                    suggestion.impact === 'dramatic' ? 'bg-primary/20 text-primary' :
                    suggestion.impact === 'moderate' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {suggestion.impact}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${suggestion.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(suggestion.confidence * 100)}% confident
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  label: string;
  color: string;
  value: number;
  detail: string;
}

function FeatureCard({ icon: Icon, label, color, value, detail }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="studio-panel-glow p-3 space-y-2"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-[10px] font-mono text-muted-foreground tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span 
          className="text-2xl font-display font-bold"
          style={{ color }}
        >
          {Math.round(value)}
        </span>
        <span className="text-xs text-muted-foreground">{detail}</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
