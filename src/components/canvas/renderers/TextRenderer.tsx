import type { TextElement } from '@/types'
import { toContentStyle, toClassName } from '@/lib/utils/elementStyles'

interface TextRendererProps {
  element: TextElement
}

export function TextRenderer({ element }: TextRendererProps) {
  return (
    <p className={toClassName(element.styles)} style={toContentStyle(element.styles)}>
      {element.props.content}
    </p>
  )
}
