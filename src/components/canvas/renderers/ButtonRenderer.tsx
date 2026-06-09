import type { ButtonElement } from '@/types'
import { toContentStyle, toClassName } from '@/lib/utils/elementStyles'

interface ButtonRendererProps {
  element: ButtonElement
}

export function ButtonRenderer({ element }: ButtonRendererProps) {
  const className = toClassName(element.styles)
  const style = toContentStyle(element.styles)

  if (element.props.href) {
    return (
      <a href={element.props.href} className={className} style={style}>
        {element.props.label}
      </a>
    )
  }

  return (
    <button type="button" className={className} style={style}>
      {element.props.label}
    </button>
  )
}
