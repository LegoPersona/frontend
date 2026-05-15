import { motion } from 'framer-motion'

import ProgressBar from '@/components/persona/ProgressBar'

type LoadingStepProps = {
  progress: number
}

function LoadingStep({ progress }: LoadingStepProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Generating Persona</h2>
      <p className="text-sm text-muted-foreground">
        This loading step is ready for async backend polling integration.
      </p>
      <ProgressBar value={progress} />
      <motion.div
        className="h-3 w-3 rounded-full bg-primary"
        animate={{ x: [0, 16, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  )
}

export default LoadingStep
