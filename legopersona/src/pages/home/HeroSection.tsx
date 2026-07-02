import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LegoBrick from '@/components/persona/LegoBrick'
import BeforeAfterSlider from './BeforeAfterSlider'

function HeroSection() {
  return (
    <section className="container mx-auto px-4 pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            Turn yourself into a <span className="text-primary">buildable LEGO model</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Upload a photo — our AI designs a brick-by-brick you, with building
            instructions and a parts list.
          </p>
          <Link to="/create" className="mt-8 inline-block">
            <Button size="lg" className="gap-2 text-lg">
              Create yours
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -left-8 -top-10 -rotate-12">
            <LegoBrick color="yellow" size="sm" studs={2} animate />
          </div>
          <div className="absolute -bottom-8 -right-6 rotate-6">
            <LegoBrick color="blue" size="md" animate />
          </div>
          <BeforeAfterSlider />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
