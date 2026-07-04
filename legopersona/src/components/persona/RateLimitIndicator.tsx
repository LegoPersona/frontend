import { motion } from 'framer-motion';
import { Sparkles, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RateLimitStatus } from '@/services/personaApi';

interface RateLimitIndicatorProps {
  status: RateLimitStatus | null;
  className?: string;
}

export const formatResetTime = (resetsAt: string | null): string => {
  if (!resetsAt) return 'tomorrow';
  const reset = new Date(resetsAt);
  const sameDay = reset.toDateString() === new Date().toDateString();
  const time = reset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return sameDay ? `at ${time}` : `tomorrow at ${time}`;
};

const RateLimitIndicator = ({ status, className }: RateLimitIndicatorProps) => {
  if (!status || status.unlimited) return null;

  const exhausted = status.remaining <= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex items-center justify-center gap-2 text-sm font-medium',
        exhausted ? 'text-destructive' : 'text-muted-foreground',
        className
      )}
    >
      {exhausted ? (
        <>
          <Clock className="w-4 h-4" />
          <span>
            Daily limit reached — you can create again {formatResetTime(status.resetsAt)}
          </span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          <span>
            {status.remaining} of {status.limit} daily creations left
          </span>
        </>
      )}
    </motion.div>
  );
};

export default RateLimitIndicator;
