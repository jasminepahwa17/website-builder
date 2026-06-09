import type { HeadingElement } from '@/types'
import { toContentStyle, toClassName } from '@/lib/utils/elementStyles'

interface HeadingRendererProps {
  element: HeadingElement
}

const headingTags = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const

export function HeadingRenderer({ element }: HeadingRendererProps) {
  const Tag = headingTags[element.props.level]
  return (
    <Tag className={toClassName(element.styles)} style={toContentStyle(element.styles)}>
      {element.props.content}
    </Tag>
  )
}
