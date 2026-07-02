import { motion } from 'framer-motion'

const stats = [
  {
    value: '1,000,000+',
    label: 'unique models',
    text: 'text-lego-red',
    stud: 'bg-lego-red',
  },
  {
    value: '100%',
    label: 'of parts available in the LEGO store',
    text: 'text-lego-blue',
    stud: 'bg-lego-blue',
  },
  {
    value: '0',
    label: 'custom parts — only real LEGO bricks',
    text: 'text-lego-green',
    stud: 'bg-lego-green',
  },
]

function StatsStrip() {
  return (
    <section className="brick-pattern border-y border-border bg-muted/50">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-14 text-center sm:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`h-2.5 w-2.5 rounded-full shadow-sm ${stat.stud}`} />
              ))}
            </div>
            <p className={`font-display text-5xl md:text-6xl ${stat.text}`}>{stat.value}</p>
            <p className="text-base font-semibold text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default StatsStrip
