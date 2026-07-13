import {
  useCallback,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type BeforeAfterSliderProps = {
  originalImage: string | null
  legoImage: string | null
  originalAlt?: string
  legoAlt?: string
  className?: string
  legoImageClassName?: string
  compact?: boolean
}

function BeforeAfterSlider({
  originalImage,
  legoImage,
  originalAlt = 'Original photo',
  legoAlt = 'Generated LEGO Persona',
  className,
  legoImageClassName,
  compact = false,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)
  const hasOriginalImage = Boolean(originalImage)
  const hasLegoImage = Boolean(legoImage)
  const hasBothImages = hasOriginalImage && hasLegoImage

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()

    if (!rect) return

    const percent = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, percent)))
  }, [])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasBothImages) return

    event.currentTarget.setPointerCapture(event.pointerId)
    updatePosition(event.clientX)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!hasBothImages) return
    if (event.buttons !== 1) return

    updatePosition(event.clientX)
  }

  if (!hasBothImages) {
    return (
      <div
        className={cn(
          'relative w-full touch-none select-none overflow-hidden bg-muted',
          compact
            ? 'aspect-[4/3] rounded-t-xl'
            : 'aspect-[2/3] rounded-lg shadow-elevated',
          className,
        )}
      >
        {hasOriginalImage && originalImage ? (
          <img
            src={originalImage}
            alt={originalAlt}
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        {hasLegoImage && legoImage ? (
          <img
            src={legoImage}
            alt={legoAlt}
            draggable={false}
            className={cn(
              'absolute inset-0 h-full w-full object-contain bg-card',
              compact ? 'p-2' : 'p-6',
              legoImageClassName,
            )}
          />
        ) : null}

        {!hasOriginalImage && !hasLegoImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted px-4 text-center text-sm text-muted-foreground">
            Images are not available for this persona yet.
          </div>
        ) : null}

        {hasOriginalImage && !hasLegoImage ? (
          <div className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-center bg-card/90 px-4 text-center text-xs font-semibold text-muted-foreground">
            LEGO image is unavailable
          </div>
        ) : null}

        {!hasOriginalImage && hasLegoImage ? (
          <div className="absolute inset-y-0 left-0 flex w-1/2 items-center justify-center bg-card/90 px-4 text-center text-xs font-semibold text-muted-foreground">
            Original image is unavailable
          </div>
        ) : null}

        <span
          className={cn(
            'absolute left-3 top-3 rounded-full font-semibold',
            hasOriginalImage ? 'bg-foreground/70 text-background' : 'bg-muted-foreground/30 text-foreground',
            compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
          )}
        >
          Original
        </span>

        <span
          className={cn(
            'absolute right-3 top-3 rounded-full font-semibold',
            hasLegoImage ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/30 text-foreground',
            compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
          )}
        >
          LEGO
        </span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className={cn(
        'relative w-full cursor-ew-resize touch-none select-none overflow-hidden bg-muted',
        compact
          ? 'aspect-[4/3] rounded-t-xl'
          : 'aspect-[2/3] rounded-lg shadow-elevated',
        className,
      )}
    >
      <img
        src={originalImage || ''}
        alt={originalAlt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 0 0 ${position}%)`,
        }}
      >
        <div className="absolute inset-0 bg-card" />

        <img
          src={legoImage || ''}
          alt={legoAlt}
          draggable={false}
          className={cn(
            'absolute inset-0 h-full w-full object-contain',
            compact ? 'p-2' : 'p-6',
            legoImageClassName,
          )}
        />
      </div>

      <span
        className={cn(
          'absolute left-3 top-3 rounded-full bg-foreground/70 font-semibold text-background',
          compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        )}
      >
        Original
      </span>

      <span
        className={cn(
          'absolute right-3 top-3 rounded-full bg-primary font-semibold text-primary-foreground',
          compact ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        )}
      >
        LEGO
      </span>

      <div
        className="absolute inset-y-0"
        style={{
          left: `${position}%`,
        }}
      >
        <div
          className={cn(
            'absolute inset-y-0 -translate-x-1/2 bg-white shadow-md',
            compact ? 'w-0.5' : 'w-1',
          )}
        />

        <div
          className={cn(
            'absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-elevated',
            compact ? 'h-8 w-8' : 'h-10 w-10',
          )}
        >
          <ChevronsLeftRight
            className={compact ? 'h-4 w-4' : 'h-5 w-5'}
          />
        </div>
      </div>
    </div>
  )
}

export default BeforeAfterSlider