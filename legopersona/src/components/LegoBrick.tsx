import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LegoBrickProps {
  color?: 'red' | 'yellow' | 'blue' | 'green' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  studs?: number;
  animate?: boolean;
}

const colorClasses = {
  red: 'bg-lego-red',
  yellow: 'bg-lego-yellow',
  blue: 'bg-lego-blue',
  green: 'bg-lego-green',
  orange: 'bg-lego-orange',
};

const sizeClasses = {
  sm: { brick: 'w-12 h-6', stud: 'w-3 h-3' },
  md: { brick: 'w-20 h-10', stud: 'w-4 h-4' },
  lg: { brick: 'w-28 h-14', stud: 'w-5 h-5' },
};

const LegoBrick = ({ 
  color = 'red', 
  size = 'md', 
  className,
  studs = 4,
  animate = false 
}: LegoBrickProps) => {
  const baseClasses = cn(
    'relative rounded-sm shadow-lego',
    colorClasses[color],
    sizeClasses[size].brick,
    className
  );

  const content = (
    <div className="absolute -top-2 left-0 right-0 flex justify-center gap-1">
      {Array.from({ length: studs }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full shadow-sm',
            colorClasses[color],
            sizeClasses[size].stud,
            'border-t border-white/20'
          )}
        />
      ))}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        className={baseClasses}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
};

export default LegoBrick;
