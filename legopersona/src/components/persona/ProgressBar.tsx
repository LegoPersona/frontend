type ProgressBarProps = {
  value: number
}

function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="w-full rounded-full bg-secondary">
      <div
        className="h-2 rounded-full bg-primary transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}

export default ProgressBar
