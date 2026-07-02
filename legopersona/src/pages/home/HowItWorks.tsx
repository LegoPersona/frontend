import { motion } from 'framer-motion'
import { Package, Sparkles, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const steps = [
  {
    number: 1,
    icon: Upload,
    title: 'Upload a photo',
    description: 'Pick a clear photo of a face — that is all we need.',
    color: 'bg-lego-red',
  },
  {
    number: 2,
    icon: Sparkles,
    title: 'AI builds your model',
    description: 'Our pipeline designs a brick-by-brick LEGO model of the person.',
    color: 'bg-lego-yellow',
  },
  {
    number: 3,
    icon: Package,
    title: 'Download & build',
    description: 'Get the model image, step-by-step instructions, and a full parts list.',
    color: 'bg-lego-blue',
  },
]

function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <h2 className="text-center font-display text-3xl md:text-4xl">How it works</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="h-full shadow-card">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lego ${step.color}`}>
                  <step.icon className="h-7 w-7" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground">Step {step.number}</p>
                <h3 className="font-display text-xl">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
