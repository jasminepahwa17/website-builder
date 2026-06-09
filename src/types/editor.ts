import type { ElementType } from './document'

export type PreviewMode = 'desktop' | 'tablet' | 'mobile'

export type PanelTab = 'design' | 'content' | 'layout'

export interface DragState {
  elementId: string | null
  elementType?: ElementType
  originParentId: string | null
  originIndex: number
}

export interface EditorState {
  activePageId: string
  selectedElementId: string | null
  hoveredElementId: string | null
  dragState: DragState | null
  previewMode: PreviewMode
  panelTab: PanelTab
}
