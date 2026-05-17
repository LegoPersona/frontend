import DownloadSection from '@/components/persona/DownloadSection'
import PersonaViewer from '@/components/persona/PersonaViewer'
import type { PersonaResult } from '@/types/persona'

type ResultStepProps = {
  result: PersonaResult
  onCreateAnother: () => void
}

function ResultStep({ result, onCreateAnother }: ResultStepProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Persona Ready</h2>
      <PersonaViewer result={result} />
      <DownloadSection result={result} />
      <button
        type="button"
        className="rounded-md border px-4 py-2 text-sm font-medium"
        onClick={onCreateAnother}
      >
        Create Another Persona
      </button>
    </section>
  )
}

export default ResultStep
