import { motion } from 'framer-motion';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenerationErrorProps {
  message?: string;
  onRetry: () => void;
  onGoHome: () => void;
}

const GenerationError = ({ message, onRetry, onGoHome }: GenerationErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6"
      >
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="font-display font-bold text-2xl mb-2">Generation Failed</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {message || "We couldn't build your persona this time. Give it another try!"}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 mt-8"
      >
        <Button variant="hero" size="lg" onClick={onRetry}>
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        <Button variant="outline" size="lg" onClick={onGoHome}>
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </motion.div>
    </div>
  );
};

export default GenerationError;
