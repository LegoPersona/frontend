import { ImageOff } from 'lucide-react'

interface ScreenshotPlaceholderProps {
  caption: string
}

/**
 * Placeholder for a screenshot that still needs to be captured and dropped in.
 * Replace instances of this with an <img> once the real screenshots are available.
 */
const ScreenshotPlaceholder = ({ caption }: ScreenshotPlaceholderProps) => (
  <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-10 text-center">
    <ImageOff className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm font-medium text-muted-foreground">Screenshot needed</p>
    <p className="max-w-md text-xs text-muted-foreground">{caption}</p>
  </div>
)

export default ScreenshotPlaceholder
