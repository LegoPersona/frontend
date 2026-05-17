import type { ChangeEvent } from 'react'

type UploadZoneProps = {
  onUpload: (file: File) => void
  disabled?: boolean
}

function UploadZone({ onUpload, disabled = false }: UploadZoneProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  return (
    <label className="block cursor-pointer rounded-lg border border-dashed border-border bg-card p-8 text-center transition-colors hover:border-primary">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={handleChange}
      />
      <p className="text-sm font-medium">Click to upload an image</p>
      <p className="mt-1 text-xs text-muted-foreground">
        PNG or JPG. This is a placeholder upload zone.
      </p>
    </label>
  )
}

export default UploadZone
