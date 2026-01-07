import { Download, Waves, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeaderProps {
  onExport: () => void;
  canExport: boolean;
}

export function Header({ onExport, canExport }: HeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-panel border-b border-border/50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan">
              <Waves className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-glow-green rounded-full animate-pulse-glow" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider glow-text-primary">
              SONIC ARCHITECT
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Audio Inversion Engine v2.0
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">
              ENGINE READY
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={!canExport}
            className="group relative overflow-hidden border-primary/50 hover:border-primary transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Download className="w-4 h-4 mr-2" />
            <span className="font-display text-xs tracking-wide">EXPORT</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
