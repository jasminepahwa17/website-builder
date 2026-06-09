import type { DividerElement } from '@/types'
import { toContentStyle, toClassName } from '@/lib/utils/elementStyles'

interface DividerRendererProps {
  element: DividerElement
}

export function DividerRenderer({ element }: DividerRendererProps) {
  return (
    <hr className={toClassName(element.styles)} style={toContentStyle(element.styles)} />
  )
}
