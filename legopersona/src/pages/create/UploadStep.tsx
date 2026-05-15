import UploadZone from '@/components/persona/UploadZone'

type UploadStepProps = {
  onUpload: (file: File) => void
}

function UploadStep({ onUpload }: UploadStepProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Upload Your Image</h2>
      <p className="text-sm text-muted-foreground">
        Start persona creation by uploading a source image.
      </p>
      <UploadZone onUpload={onUpload} />
    </section>
  )
}

export default UploadStep
