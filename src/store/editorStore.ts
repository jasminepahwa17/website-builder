import { create } from 'zustand'
import type { EditorState, DragState, PreviewMode, PanelTab } from '@/types'
import { DEFAULT_DOCUMENT } from '@/lib/mockData/defaultDocument'

interface EditorStoreActions {
  selectElement: (id: string | null) => void
  hoverElement: (id: string | null) => void
  setDragState: (state: DragState | null) => void
  setPreviewMode: (mode: PreviewMode) => void
  setPanelTab: (tab: PanelTab) => void
  setActivePage: (id: string) => void
}

export type EditorStore = EditorState & EditorStoreActions

const initialState: EditorState = {
  activePageId: DEFAULT_DOCUMENT.pages[0].id,
  selectedElementId: null,
  hoveredElementId: null,
  dragState: null,
  previewMode: 'desktop',
  panelTab: 'design',
}

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  selectElement: (id) => set({ selectedElementId: id }),
  hoverElement: (id) => set({ hoveredElementId: id }),
  setDragState: (state) => set({ dragState: state }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setPanelTab: (tab) => set({ panelTab: tab }),
  setActivePage: (id) => set({ activePageId: id }),
}))
