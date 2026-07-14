import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileJson, Sparkles, ExternalLink, ZoomIn } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import ScreenshotPlaceholder from './ScreenshotPlaceholder'

import step1Download from '@/assets/guide/step1-download.png'
import step2UploadList from '@/assets/guide/step2-upload-list.png'
import step3SelectFile from '@/assets/guide/step3-select-file.png'
import step4PickBricks from '@/assets/guide/step4-pick-bricks.png'

const PICK_A_BRICK_URL = 'https://www.lego.com/en-us/pick-and-build/pick-a-brick'

interface Step {
  number: number
  title: string
  color: string
  body: React.ReactNode
  /** Alt text describing the screenshot. */
  screenshot?: string
  /** Imported screenshot image. Falls back to a placeholder when omitted. */
  image?: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Download the parts file',
    color: 'bg-lego-red',
    body: (
      <>
        After creating your persona click the{' '}
        <span className="font-semibold">"Download LEGO parts file"</span> button. Your browser saves a{' '}
        <span className="font-mono text-sm">.json</span> file listing every brick's official LEGO element
        ID and quantity. Not created one yet? Start on the{' '}
        <Link to="/create" className="font-semibold text-primary underline underline-offset-2">
          Create
        </Link>{' '}
        page.
      </>
    ),
    screenshot:
      'The results page in our app, highlighting the "Download LEGO parts file" button below the persona preview.',
    image: step1Download,
  },
  {
    number: 2,
    title: 'Open Pick a Brick and click "Upload list"',
    color: 'bg-lego-yellow',
    body: (
      <>
        Go to the official{' '}
        <a
          href={PICK_A_BRICK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2"
        >
          LEGO Pick a Brick <ExternalLink className="h-3.5 w-3.5" />
        </a>{' '}
        site and click <span className="font-semibold">"Upload list"</span>.
      </>
    ),
    screenshot: 'The LEGO Pick a Brick page with the "Upload list" button visible.',
    image: step2UploadList,
  },
  {
    number: 3,
    title: 'Drag in or select the parts file',
    color: 'bg-lego-blue',
    body: (
      <>
        In the upload dialog, drag the{' '}
        <span className="font-mono text-sm">.json</span> file you downloaded into the drop zone, or click
        to browse and select it.
      </>
    ),
    screenshot: 'The Pick a Brick "Upload list" dialog with the parts file being dragged in or selected.',
    image: step3SelectFile,
  },
  {
    number: 4,
    title: 'Click "Pick selected bricks"',
    color: 'bg-lego-green',
    body: (
      <>
        Pick a Brick matches every element ID from your file. Click{' '}
        <span className="font-semibold">"Pick selected bricks"</span> to add them all to your bag, then
        review and check out. Note that some parts may not be available in Pick a Brick, and will need to be purchased elsewhere. You will be alerted if that's the case.
      </>
    ),
    screenshot:
      'The Pick a Brick screen showing the matched bricks with the "Pick selected bricks" button.',
    image: step4PickBricks,
  },
]

const StepCard = ({ step, index }: { step: Step; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <Card className="h-full shadow-card">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold text-white shadow-lego ${step.color}`}
          >
            {step.number}
          </div>
          <h3 className="font-display text-xl">{step.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        {step.image ? (
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="group relative mt-auto flex aspect-[16/10] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <img
                  src={step.image}
                  alt={step.screenshot ?? ''}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-lego">
                    <ZoomIn className="h-4 w-4" />
                    Click to enlarge
                  </span>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
              <img
                src={step.image}
                alt={step.screenshot ?? ''}
                className="max-h-[85vh] w-full rounded-xl object-contain"
              />
            </DialogContent>
          </Dialog>
        ) : (
          step.screenshot && <ScreenshotPlaceholder caption={step.screenshot} />
        )}
      </CardContent>
    </Card>
  </motion.div>
)

function PartsGuidePage() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-lego">
          <FileJson className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mt-4 font-display text-3xl md:text-4xl">Order your bricks with Pick a Brick</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Every LEGO Persona comes with a downloadable parts file that works directly with LEGO's official
          Pick a Brick store. Four steps and the exact bricks are in your bag.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 flex flex-col items-center gap-4 text-center">
        <p className="text-muted-foreground">Ready to build your own?</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/create">
            <Button variant="hero" size="xl" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Create a LEGO Persona
            </Button>
          </Link>
          <a href={PICK_A_BRICK_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="xl" className="gap-2">
              <ExternalLink className="h-5 w-5" />
              Open Pick a Brick
            </Button>
          </a>
        </div>
      </div>
    </PageContainer>
  )
}

export default PartsGuidePage
