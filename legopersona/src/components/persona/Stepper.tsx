import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  return (
    <div className={cn('mx-auto w-full', className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(3rem,1fr)_minmax(0,1fr)_minmax(3rem,1fr)_minmax(0,1fr)] items-start gap-x-2 sm:gap-x-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isLast = index === steps.length - 1;

          return (
            <Fragment key={step.number}>
              <div className="flex justify-center min-w-0">
                <div className="flex flex-col items-center min-w-0">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg transition-all duration-300 shadow-lego',
                    isCompleted && 'bg-lego-green text-white',
                    isCurrent && 'bg-secondary text-secondary-foreground animate-pulse-glow',
                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </motion.div>
                <div className="mt-2 text-center">
                  <p className={cn(
                    'font-display font-semibold text-sm',
                    isCurrent ? 'text-secondary' : 'text-muted-foreground'
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
                </div>
              </div>
              
              {/* Connector line */}
              {!isLast && (
                <div className="flex items-start pt-6 sm:pt-6 min-w-0">
                  <div className="h-1 w-full rounded-full overflow-hidden bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-lego-green"
                  />
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
