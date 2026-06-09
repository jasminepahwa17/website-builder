import type { ImageElement } from '@/types'
import { toContentStyle, toClassName } from '@/lib/utils/elementStyles'

interface ImageRendererProps {
  element: ImageElement
}

export function ImageRenderer({ element }: ImageRendererProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={element.props.src}
      alt={element.props.alt}
      className={toClassName(element.styles)}
      style={toContentStyle(element.styles)}
    />
  )
}
