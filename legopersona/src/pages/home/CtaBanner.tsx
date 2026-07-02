import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function CtaBanner() {
  return (
    <section className="gradient-cta">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col items-center gap-6 px-4 py-16 text-center md:py-20"
      >
        <h2 className="font-display text-3xl text-secondary-foreground md:text-4xl">
          Ready to build yourself?
        </h2>
        <p className="max-w-md text-secondary-foreground/80">
          One photo is all it takes to get your own buildable LEGO model.
        </p>
        <Link to="/create">
          <Button size="lg" className="gap-2 text-lg shadow-lego">
            Create yours
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </section>
  )
}

export default CtaBanner
