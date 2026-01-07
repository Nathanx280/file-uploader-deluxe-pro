import { useCallback, useState } from 'react';
import { Upload, Music, FileAudio, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioUploaderProps {
  onFileLoad: (file: File) => void;
  fileName: string | null;
  isLoaded: boolean;
}

export function AudioUploader({ onFileLoad, fileName, isLoaded }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      onFileLoad(file);
    }
  }, [onFileLoad]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
    }
  }, [onFileLoad]);

  // Compact version when loaded
  if (isLoaded) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="studio-panel p-3 flex items-center gap-4"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">Audio loaded successfully</p>
          </div>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <span className="text-xs text-primary hover:underline font-mono">
            CHANGE FILE
          </span>
        </label>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`upload-zone p-8 md:p-12 cursor-pointer ${isDragging ? 'active' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="cursor-pointer block">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <motion.div
              animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {isDragging ? (
                  <motion.div
                    key="music"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Music className="w-10 h-10 text-primary animate-pulse" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Upload className="w-10 h-10 text-muted-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Orbiting elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <FileAudio className="w-5 h-5 text-primary/50 absolute -top-2 left-1/2 -translate-x-1/2" />
            </motion.div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h3 className="font-display text-xl md:text-2xl font-bold glow-text-primary">
              {isDragging ? 'DROP YOUR AUDIO' : 'UPLOAD AUDIO FILE'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Drag and drop your audio file here, or click to browse.
              <br />
              <span className="text-xs">Supports MP3, WAV, FLAC, OGG, M4A</span>
            </p>
          </div>

          {/* Decorative lines */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <span className="text-xs text-muted-foreground font-mono">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          {/* Browse button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-display text-sm tracking-wide shadow-lg glow-cyan"
          >
            BROWSE FILES
          </motion.div>
        </div>
      </label>
    </motion.div>
  );
}
