'use client'

import type { CSSProperties, ReactNode, MouseEvent } from 'react'
import type { Element } from '@/types'
import { useEditor } from '@/hooks/shared/useEditor'
import { toWrapperStyle } from '@/lib/utils/elementStyles'

interface SelectionWrapperProps {
  element: Element
  parentLayoutMode: 'absolute' | 'flow'
  children: ReactNode
}

export function SelectionWrapper({ element, parentLayoutMode, children }: SelectionWrapperProps) {
  const { selectedElementId, selectElement } = useEditor()
  const isSelected = selectedElementId === element.id

  const style: CSSProperties = {
    ...toWrapperStyle(element.styles, parentLayoutMode),
    outline: isSelected ? '2px solid #3B82F6' : undefined,
    cursor: 'default',
  }

  function handleClick(e: MouseEvent) {
    e.stopPropagation()
    selectElement(element.id)
  }

  return (
    <div style={style} onClick={handleClick}>
      {children}
    </div>
  )
}
