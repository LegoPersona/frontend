import { Link } from 'react-router-dom'
import { Boxes, Calendar, Heart, MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import BeforeAfterSlider from '@/pages/home/BeforeAfterSlider'
import { DownloadInstructionsButton, DownloadLegoPartsButton } from './DownloadButtons'
import type { ProfilePersona } from '@/types/profile'

interface PersonaDetailModalProps {
  persona: ProfilePersona | null
  onClose: () => void
}

const PersonaDetailModal = ({ persona, onClose }: PersonaDetailModalProps) => {
  return (
    <Dialog
      open={persona !== null}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
        {persona && (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="font-display">Your LEGO Persona</DialogTitle>
              <DialogDescription>
                Drag the slider to compare the original photo with the generated
                LEGO Persona.
              </DialogDescription>
            </DialogHeader>

            <BeforeAfterSlider
              originalImage={persona.originalImageUrl}
              legoImage={persona.legoImageUrl}
              originalAlt="Original uploaded photo"
              legoAlt="Generated LEGO Persona"
              className="mx-auto max-w-[240px]"
            />

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(persona.createdAt).toLocaleDateString()}
              </span>

              <span className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-primary" />
                {persona.partsCount} pieces
              </span>

              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                {persona.likesCount} {persona.likesCount === 1 ? 'like' : 'likes'}
              </span>

              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                {persona.commentsCount}{' '}
                {persona.commentsCount === 1 ? 'comment' : 'comments'}
              </span>
            </div>

            {/* Same actions as the create-page result screen */}
            <div className="flex flex-col items-stretch justify-center gap-3">
              <DownloadInstructionsButton personaId={persona.id} />
              <DownloadLegoPartsButton personaId={persona.id} />
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Want to order the bricks?{' '}
              <Link
                to="/parts-guide"
                className="font-semibold text-primary underline underline-offset-2"
                onClick={onClose}
              >
                See the Pick a Brick guide
              </Link>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PersonaDetailModal
