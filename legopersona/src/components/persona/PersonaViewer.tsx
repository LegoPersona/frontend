import type { PersonaResult } from '@/types/persona'

type PersonaViewerProps = {
  result: PersonaResult
}

function PersonaViewer({ result }: PersonaViewerProps) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h3 className="text-lg font-semibold">{result.personaName}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{result.description}</p>
      <div className="mt-4 rounded-md border bg-muted p-4 text-sm text-muted-foreground">
        Generated image preview placeholder: {result.imageUrl}
      </div>
    </section>
  )
}

export default PersonaViewer
