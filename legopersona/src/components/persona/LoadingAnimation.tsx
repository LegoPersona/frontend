import { motion } from 'framer-motion';
import LegoBrick from './LegoBrick';

interface LoadingAnimationProps {
  progress?: number;
}

const LoadingAnimation = ({ progress: _progress }: LoadingAnimationProps) => {
  const bricks = [
    { color: 'red' as const, delay: 0 },
    { color: 'yellow' as const, delay: 0.2 },
    { color: 'blue' as const, delay: 0.4 },
    { color: 'green' as const, delay: 0.6 },
  ];

  const messages = [
    "Analyzing your awesome photo...",
    "Finding the perfect LEGO pieces...",
    "Assembling your minifigure...",
    "Adding the finishing touches...",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated bricks */}
      <div className="relative h-40 w-40 flex items-center justify-center mb-8">
        {bricks.map((brick, index) => (
          <motion.div
            key={index}
            initial={{ y: -100, opacity: 0, rotate: -20 }}
            animate={{ 
              y: [null, 0],
              opacity: [null, 1],
              rotate: [null, 0]
            }}
            transition={{
              delay: brick.delay,
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute"
            style={{ top: `${index * 20}px` }}
          >
            <LegoBrick color={brick.color} size="md" studs={2} />
          </motion.div>
        ))}
      </div>

      {/* Spinning loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-full border-4 border-muted border-t-primary mb-6"
      />

      {/* Animated messages */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.p
          key={Math.floor(Date.now() / 3000) % messages.length}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-xl text-foreground"
        >
          {messages[Math.floor(Date.now() / 3000) % messages.length]}
        </motion.p>
        <p className="text-muted-foreground mt-2">This usually takes a few seconds</p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-64 h-3 bg-muted rounded-full mt-8 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="h-full gradient-hero rounded-full"
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;
