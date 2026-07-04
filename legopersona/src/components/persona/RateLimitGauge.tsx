import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRateLimit } from '@/contexts/RateLimitContext';
import { formatResetTime } from '@/components/persona/RateLimitIndicator';
import { cn } from '@/lib/utils';

const SIZE = 40;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const gaugeColor = (remaining: number, limit: number): string => {
  if (remaining <= 0) return 'hsl(var(--destructive))';
  if (remaining / limit <= 0.4) return 'hsl(var(--lego-yellow))';
  return 'hsl(var(--lego-green))';
};

interface RateLimitGaugeProps {
  label?: string;
  className?: string;
}

const RateLimitGauge = ({ label, className }: RateLimitGaugeProps) => {
  const { status } = useRateLimit();

  if (!status || status.unlimited) return null;

  const exhausted = status.remaining <= 0;
  const fraction = Math.min(Math.max(status.remaining / status.limit, 0), 1);
  const color = gaugeColor(status.remaining, status.limit);
  const tooltipText = exhausted
    ? `Daily limit reached — you can create again ${formatResetTime(status.resetsAt)}`
    : `${status.remaining} of ${status.limit} daily creations left`;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn('flex items-center gap-3 cursor-default', className)}
            role="img"
            aria-label={tooltipText}
          >
            <div className="relative flex items-center justify-center">
              <svg width={SIZE} height={SIZE} className="-rotate-90">
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={exhausted ? 'hsl(var(--destructive) / 0.2)' : 'hsl(var(--muted))'}
                  strokeWidth={STROKE}
                />
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
                  className="transition-[stroke-dashoffset,stroke] duration-500 ease-out"
                />
              </svg>
              <span
                className={cn(
                  'absolute text-[11px] font-display font-bold leading-none',
                  exhausted ? 'text-destructive' : 'text-foreground'
                )}
              >
                {status.remaining}/{status.limit}
              </span>
            </div>
            {label && <span className="text-sm text-muted-foreground">{label}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RateLimitGauge;
