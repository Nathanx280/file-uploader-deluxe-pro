import { useState, useRef, useCallback, useEffect } from 'react';
import type { AudioState, TrackAnalysis } from '@/types/audio';

const initialAudioState: AudioState = {
  isLoaded: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  fileName: null,
};

const initialAnalysis: TrackAnalysis = {
  bpm: 0,
  key: '--',
  energy: 0,
  loudness: 0,
  danceability: 0,
  mood: '--',
};

export function useAudioEngine() {
  const [audioState, setAudioState] = useState<AudioState>(initialAudioState);
  const [analysis, setAnalysis] = useState<TrackAnalysis>(initialAnalysis);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Initialize audio context on first interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      gainNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  const loadAudio = useCallback(async (file: File) => {
    initAudioContext();
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
      audioBufferRef.current = audioBuffer;
      
      // Generate waveform data
      const rawData = audioBuffer.getChannelData(0);
      const samples = 200;
      const blockSize = Math.floor(rawData.length / samples);
      const waveform: number[] = [];
      
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[i * blockSize + j]);
        }
        waveform.push(sum / blockSize);
      }
      
      // Normalize waveform
      const maxValue = Math.max(...waveform);
      const normalizedWaveform = waveform.map(v => v / maxValue);
      setWaveformData(normalizedWaveform);
      
      // Simulate track analysis
      setAnalysis({
        bpm: Math.floor(Math.random() * 60) + 80,
        key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'][Math.floor(Math.random() * 7)] + 
             (Math.random() > 0.5 ? ' Major' : ' Minor'),
        energy: Math.random() * 100,
        loudness: -10 - Math.random() * 15,
        danceability: Math.random() * 100,
        mood: ['Energetic', 'Chill', 'Dark', 'Uplifting', 'Melancholic'][Math.floor(Math.random() * 5)],
      });
      
      setAudioState(prev => ({
        ...prev,
        isLoaded: true,
        duration: audioBuffer.duration,
        fileName: file.name,
        currentTime: 0,
      }));
      
      pauseTimeRef.current = 0;
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }, [initAudioContext]);

  const play = useCallback(() => {
    if (!audioBufferRef.current || !audioContextRef.current || !gainNodeRef.current) return;
    
    // Stop any existing playback
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(gainNodeRef.current);
    sourceNodeRef.current = source;
    
    const offset = pauseTimeRef.current;
    startTimeRef.current = audioContextRef.current.currentTime - offset;
    source.start(0, offset);
    
    source.onended = () => {
      if (audioContextRef.current && 
          audioContextRef.current.currentTime - startTimeRef.current >= audioBufferRef.current!.duration - 0.1) {
        setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
        pauseTimeRef.current = 0;
      }
    };
    
    setAudioState(prev => ({ ...prev, isPlaying: true }));
    
    // Start animation frame for time updates
    const updateTime = () => {
      if (audioContextRef.current && audioBufferRef.current) {
        const currentTime = audioContextRef.current.currentTime - startTimeRef.current;
        if (currentTime <= audioBufferRef.current.duration) {
          setAudioState(prev => ({ ...prev, currentTime }));
          animationFrameRef.current = requestAnimationFrame(updateTime);
        }
      }
    };
    updateTime();
  }, []);

  const pause = useCallback(() => {
    if (sourceNodeRef.current && audioContextRef.current) {
      sourceNodeRef.current.stop();
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
      cancelAnimationFrame(animationFrameRef.current);
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    pauseTimeRef.current = 0;
    cancelAnimationFrame(animationFrameRef.current);
    setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  const seek = useCallback((time: number) => {
    const wasPlaying = audioState.isPlaying;
    if (wasPlaying) {
      pause();
    }
    pauseTimeRef.current = time;
    setAudioState(prev => ({ ...prev, currentTime: time }));
    if (wasPlaying) {
      setTimeout(play, 50);
    }
  }, [audioState.isPlaying, pause, play]);

  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
    setAudioState(prev => ({ ...prev, volume }));
  }, []);

  const applyInversions = useCallback((inversions: Record<string, number>) => {
    // In a real implementation, this would apply DSP effects
    console.log('Applying inversions:', inversions);
  }, []);

  const exportAudio = useCallback(() => {
    // In a real implementation, this would export the processed audio
    console.log('Exporting audio...');
    return null;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    audioState,
    analysis,
    waveformData,
    loadAudio,
    play,
    pause,
    stop,
    seek,
    setVolume,
    applyInversions,
    exportAudio,
    analyserRef,
  };
}
