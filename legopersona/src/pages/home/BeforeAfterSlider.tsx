import { useCallback, useRef, useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import exampleOriginal from '@/assets/example-original.png'
import exampleLego from '@/assets/example-lego.png'

function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(50)

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const percent = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, percent)))
  }, [])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    updatePosition(event.clientX)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return
    updatePosition(event.clientX)
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className="relative aspect-[2/3] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-lg shadow-elevated"
    >
      <img
        src={exampleOriginal}
        alt="Original photo"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <div className="absolute inset-0 bg-card" />
        <img
          src={exampleLego}
          alt="Generated LEGO model of the same person"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain p-6"
        />
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-foreground/70 px-3 py-1 text-xs font-semibold text-background">
        Original
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
        LEGO
      </span>

      <div className="absolute inset-y-0" style={{ left: `${position}%` }}>
        <div className="absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-md" />
        <div className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-elevated">
          <ChevronsLeftRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default BeforeAfterSlider
