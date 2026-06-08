interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function Spinner({ size = 'md', label = 'Loading...' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center p-8" role="status" aria-label={label}>
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-2 border-gray-200 border-t-gray-600`}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}