import type { SpacerElement } from '@/types'
import { toContentStyle, toClassName } from '@/lib/utils/elementStyles'

interface SpacerRendererProps {
  element: SpacerElement
}

export function SpacerRenderer({ element }: SpacerRendererProps) {
  return (
    <div
      aria-hidden="true"
      className={toClassName(element.styles)}
      style={toContentStyle(element.styles)}
    />
  )
}
