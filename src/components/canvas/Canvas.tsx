'use client'

import { useActivePage } from '@/hooks/shared/useActivePage'
import { ElementRenderer } from './ElementRenderer'

export function Canvas() {
  const page = useActivePage()

  if (!page) return null

  const { rootElement } = page

  return (
    <div
      style={{
        position: 'relative',
        width: rootElement.styles.width,
        height: rootElement.styles.height,
        background: rootElement.styles.background,
        overflow: 'hidden',
      }}
    >
      {rootElement.children.map((child) => (
        <ElementRenderer key={child.id} element={child} parentLayoutMode={rootElement.layoutMode} />
      ))}
    </div>
  )
}
