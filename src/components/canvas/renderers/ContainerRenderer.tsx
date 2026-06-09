import type { CSSProperties } from 'react'
import type { ContainerLike } from '@/types'
import { toContentStyle, toClassName } from '@/lib/utils/elementStyles'
import { ElementRenderer } from '../ElementRenderer'

interface ContainerRendererProps {
  element: ContainerLike
}

export function ContainerRenderer({ element }: ContainerRendererProps) {
  const flexStyles: CSSProperties =
    element.layoutMode === 'flow'
      ? {
          display: 'flex',
          ...(element.styles.flexDirection !== undefined && { flexDirection: element.styles.flexDirection }),
          ...(element.styles.gap !== undefined && { gap: element.styles.gap }),
          ...(element.styles.alignItems !== undefined && { alignItems: element.styles.alignItems }),
          ...(element.styles.justifyContent !== undefined && { justifyContent: element.styles.justifyContent }),
        }
      : {}

  const style: CSSProperties = { ...toContentStyle(element.styles), ...flexStyles }

  return (
    <div className={toClassName(element.styles)} style={style}>
      {element.children.map((child) => (
        <ElementRenderer key={child.id} element={child} parentLayoutMode={element.layoutMode} />
      ))}
    </div>
  )
}
