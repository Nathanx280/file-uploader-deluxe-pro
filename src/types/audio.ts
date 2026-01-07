export interface AudioLayer {
  id: string;
  name: string;
  enabled: boolean;
  volume: number;
  color: string;
}

export interface InversionDimension {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  description: string;
  icon?: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  inversions: Record<string, number>;
  layers: Record<string, boolean>;
  category?: 'basic' | 'experimental' | 'creative';
}

export interface AudioState {
  isLoaded: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  fileName: string | null;
}

export interface TrackAnalysis {
  bpm: number;
  key: string;
  energy: number;
  loudness: number;
  danceability: number;
  mood: string;
}

// ============= INTELLIGENT REMIX FEATURES =============

// Feature 1: Neural Harmonic Morphing
export interface HarmonicSignature {
  fundamentalFreq: number;
  harmonics: number[];
  harmonicRatios: number[];
  consonanceScore: number;
  dissonanceMap: number[];
}

// Feature 2: Quantum Beat Grid
export interface QuantumBeatGrid {
  microTimings: number[];
  groovePattern: number[];
  swingFactor: number;
  syncopationIndex: number;
  polyrhythmLayers: number[][];
  quantumEntanglement: number; // How much beats "influence" each other
}

// Feature 3: Emotional DNA
export interface EmotionalDNA {
  valence: number; // Happiness -1 to 1
  arousal: number; // Energy -1 to 1
  dominance: number; // Power -1 to 1
  tension: number; // Tension curve over time
  release: number; // Release points
  emotionalArc: EmotionalPoint[];
  colorSignature: string; // Hex color representing the emotion
}

export interface EmotionalPoint {
  time: number;
  emotion: string;
  intensity: number;
}

// Feature 4: Synaesthetic Frequency Map
export interface SynaestheticMap {
  frequencyColors: { freq: number; color: string; intensity: number }[];
  textureProfile: string;
  spatialPosition: { x: number; y: number; z: number };
  synesthesiaType: 'chromesthesia' | 'spatial' | 'tactile';
}

// Feature 5: Temporal Fractal Analysis
export interface TemporalFractal {
  fractalDimension: number;
  selfSimilarityScore: number;
  recursivePatterns: RecursivePattern[];
  infiniteZoomPoints: number[];
}

export interface RecursivePattern {
  startTime: number;
  duration: number;
  repetitionScale: number;
  similarity: number;
}

// Feature 6: Crowd Energy Simulation
export interface CrowdEnergySimulation {
  energyCurve: number[];
  peakMoments: number[];
  buildupZones: { start: number; end: number; intensity: number }[];
  dropImpact: number[];
  crowdResponseDelay: number;
  moshPitProbability: number;
}

// Feature 7: Sonic Texture DNA
export interface SonicTexture {
  roughness: number;
  brightness: number;
  warmth: number;
  density: number;
  movement: number;
  textureType: 'smooth' | 'gritty' | 'crystalline' | 'organic' | 'metallic' | 'ethereal';
  layerDepth: number;
}

// Feature 8: Probability Wave Mixer
export interface ProbabilityWave {
  waveFunction: number[];
  superpositionStates: SuperpositionState[];
  collapsePoints: number[];
  uncertaintyZones: { start: number; end: number; entropy: number }[];
}

export interface SuperpositionState {
  id: string;
  probability: number;
  audioVariant: 'original' | 'reversed' | 'pitched' | 'stretched' | 'granular';
}

// Feature 9: Dimensional Rift Points
export interface DimensionalRift {
  riftPoints: RiftPoint[];
  parallelTimelines: number;
  dimensionalBleed: number;
  realityStability: number;
}

export interface RiftPoint {
  time: number;
  intensity: number;
  riftType: 'temporal' | 'harmonic' | 'textural' | 'spatial';
  alternateReality: string;
}

// Feature 10: Consciousness Sync
export interface ConsciousnessSync {
  brainwaveTarget: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
  binauralOffset: number;
  isochronicPulse: number;
  entrainmentStrength: number;
  flowStateScore: number;
  meditationDepth: number;
}

// Combined Intelligence Analysis
export interface IntelligentAnalysis {
  harmonicSignature: HarmonicSignature;
  quantumBeatGrid: QuantumBeatGrid;
  emotionalDNA: EmotionalDNA;
  synaestheticMap: SynaestheticMap;
  temporalFractal: TemporalFractal;
  crowdEnergy: CrowdEnergySimulation;
  sonicTexture: SonicTexture;
  probabilityWave: ProbabilityWave;
  dimensionalRift: DimensionalRift;
  consciousnessSync: ConsciousnessSync;
}

// AI Remix Suggestions
export interface RemixSuggestion {
  id: string;
  name: string;
  description: string;
  confidence: number;
  impact: 'subtle' | 'moderate' | 'dramatic' | 'reality-bending';
  parameters: Record<string, number>;
  reasoning: string;
}
