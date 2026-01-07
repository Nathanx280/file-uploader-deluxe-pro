import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { AudioUploader } from "@/components/AudioUploader";
import { WaveformDisplay } from "@/components/WaveformDisplay";
import { TransportControls } from "@/components/TransportControls";
import { PresetSelector } from "@/components/PresetSelector";
import { InversionPanel } from "@/components/InversionPanel";
import { TrackAnalysisDisplay } from "@/components/TrackAnalysisDisplay";
import { SpectrumAnalyzer } from "@/components/SpectrumAnalyzer";
import { LayerToggles } from "@/components/LayerToggles";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import type { AudioLayer, InversionDimension, Preset } from "@/types/audio";
import { motion } from "framer-motion";

const defaultLayers: AudioLayer[] = [
  { id: "drums", name: "Drums", enabled: true, volume: 1, color: "#ff8800" },
  { id: "bass", name: "Bass", enabled: true, volume: 1, color: "#aa00ff" },
  { id: "harmony", name: "Harmony", enabled: true, volume: 1, color: "#00d4ff" },
  { id: "vocals", name: "Vocals", enabled: true, volume: 1, color: "#00ff88" },
  { id: "fx", name: "FX", enabled: true, volume: 1, color: "#ff00aa" },
];

const defaultDimensions: InversionDimension[] = [
  { id: "phase", name: "Phase Inversion", value: 0, min: 0, max: 100, description: "Flip the phase of the audio signal" },
  { id: "time", name: "Time Reversal", value: 0, min: 0, max: 100, description: "Play the audio backwards" },
  { id: "spectral", name: "Spectral Mirror", value: 0, min: 0, max: 100, description: "Mirror the frequency spectrum" },
  { id: "dynamics", name: "Dynamic Inversion", value: 0, min: 0, max: 100, description: "Invert the dynamic range" },
  { id: "pitch", name: "Pitch Flip", value: 0, min: 0, max: 100, description: "Shift pitch harmonics" },
  { id: "rhythm", name: "Rhythm Deconstruct", value: 0, min: 0, max: 100, description: "Deconstruct and reassemble rhythm" },
];

const presets: Preset[] = [
  { id: "clean", name: "Clean", description: "No effects applied", inversions: { phase: 0, time: 0, spectral: 0, dynamics: 0, pitch: 0, rhythm: 0 }, layers: {}, category: 'basic' },
  { id: "phase-flip", name: "Phase Flip", description: "Full phase inversion", inversions: { phase: 100, time: 0, spectral: 0, dynamics: 0, pitch: 0, rhythm: 0 }, layers: {}, category: 'basic' },
  { id: "reverse", name: "Reverse", description: "Time reversal effect", inversions: { phase: 0, time: 100, spectral: 0, dynamics: 0, pitch: 0, rhythm: 0 }, layers: {}, category: 'basic' },
  { id: "mirror-world", name: "Mirror World", description: "Combined mirror effects", inversions: { phase: 50, time: 0, spectral: 100, dynamics: 50, pitch: 0, rhythm: 0 }, layers: {}, category: 'experimental' },
  { id: "chaos", name: "Chaos", description: "Experimental chaos mode", inversions: { phase: 30, time: 30, spectral: 70, dynamics: 60, pitch: 40, rhythm: 80 }, layers: {}, category: 'experimental' },
  { id: "deep-flip", name: "Deep Flip", description: "Deep inversion effect", inversions: { phase: 100, time: 0, spectral: 50, dynamics: 100, pitch: 70, rhythm: 0 }, layers: {}, category: 'experimental' },
  { id: "glitch", name: "Glitch", description: "Glitchy rhythm effects", inversions: { phase: 20, time: 40, spectral: 30, dynamics: 0, pitch: 60, rhythm: 100 }, layers: {}, category: 'creative' },
  { id: "ambient", name: "Ambient", description: "Soft ambient textures", inversions: { phase: 10, time: 0, spectral: 80, dynamics: 30, pitch: 20, rhythm: 10 }, layers: {}, category: 'creative' },
];

const Index = () => {
  const [layers, setLayers] = useState<AudioLayer[]>(defaultLayers);
  const [dimensions, setDimensions] = useState<InversionDimension[]>(defaultDimensions);
  const [selectedPreset, setSelectedPreset] = useState<string | null>("clean");

  const {
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
  } = useAudioEngine();

  const handleFileLoad = useCallback(async (file: File) => {
    await loadAudio(file);
  }, [loadAudio]);

  const handleLayerToggle = useCallback((layerId: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
  }, []);

  const handleLayerVolumeChange = useCallback((layerId: string, volume: number) => {
    setLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, volume } : layer
    ));
  }, []);

  const handleDimensionChange = useCallback((dimensionId: string, value: number) => {
    setDimensions(prev => prev.map(dim =>
      dim.id === dimensionId ? { ...dim, value } : dim
    ));
    setSelectedPreset(null);
  }, []);

  const handlePresetSelect = useCallback((presetId: string) => {
    setSelectedPreset(presetId);
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setDimensions(prev => prev.map(dim => ({
        ...dim,
        value: preset.inversions[dim.id] ?? dim.value
      })));
    }
  }, []);

  const handleResetDimensions = useCallback(() => {
    setDimensions(defaultDimensions);
    setSelectedPreset("clean");
  }, []);

  const handleExport = useCallback(() => {
    const blob = exportAudio();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sonic-architect-export-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [exportAudio]);

  // Apply inversion effects when dimensions change
  useEffect(() => {
    if (audioState.isLoaded) {
      const inversions: Record<string, number> = {};
      dimensions.forEach(dim => {
        inversions[dim.id] = dim.value;
      });
      applyInversions(inversions);
    }
  }, [dimensions, audioState.isLoaded, applyInversions]);

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <Header onExport={handleExport} canExport={audioState.isLoaded} />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Audio Uploader - always visible when loaded, full screen when not */}
          {!audioState.isLoaded ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <div className="w-full max-w-2xl">
                <AudioUploader
                  onFileLoad={handleFileLoad}
                  fileName={audioState.fileName}
                  isLoaded={audioState.isLoaded}
                />
              </div>
            </motion.div>
          ) : (
            <>
              {/* Compact uploader when loaded */}
              <AudioUploader
                onFileLoad={handleFileLoad}
                fileName={audioState.fileName}
                isLoaded={audioState.isLoaded}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Panel - Layers & Analysis */}
                <div className="lg:col-span-3 space-y-4">
                  <LayerToggles
                    layers={layers}
                    onToggleLayer={handleLayerToggle}
                    onLayerVolumeChange={handleLayerVolumeChange}
                  />
                  <TrackAnalysisDisplay analysis={analysis} />
                </div>

                {/* Center Panel - Main Display */}
                <div className="lg:col-span-6 space-y-4">
                  <WaveformDisplay
                    waveformData={waveformData}
                    currentTime={audioState.currentTime}
                    duration={audioState.duration}
                    onSeek={seek}
                    isPlaying={audioState.isPlaying}
                  />

                  <SpectrumAnalyzer
                    analyserNode={analyserRef.current}
                    isPlaying={audioState.isPlaying}
                  />

                  <TransportControls
                    isPlaying={audioState.isPlaying}
                    isLoaded={audioState.isLoaded}
                    onPlay={play}
                    onPause={pause}
                    onStop={stop}
                    onVolumeChange={setVolume}
                  />
                </div>

                {/* Right Panel - Inversion Controls */}
                <div className="lg:col-span-3 space-y-4">
                  <PresetSelector
                    presets={presets}
                    activePreset={selectedPreset}
                    onSelectPreset={handlePresetSelect}
                  />
                  <InversionPanel
                    dimensions={dimensions}
                    onChange={handleDimensionChange}
                    onReset={handleResetDimensions}
                  />
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 mt-8 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">SONIC ARCHITECT v2.0</span>
            <span className="font-mono">AUDIO INVERSION ENGINE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
