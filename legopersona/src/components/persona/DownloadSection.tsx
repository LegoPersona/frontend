import type { PersonaResult } from '@/types/persona'

type DownloadSectionProps = {
  result: PersonaResult
}

function DownloadSection({ result }: DownloadSectionProps) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="text-base font-semibold">Export</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Download endpoint placeholder: {result.downloadUrl}
      </p>
      <button
        type="button"
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Download Persona
      </button>
    </section>
  )
}

export default DownloadSection
