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
