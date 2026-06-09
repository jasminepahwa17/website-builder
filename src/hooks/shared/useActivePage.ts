import { useDocumentStore } from '@/store/documentStore'
import { useEditorStore } from '@/store/editorStore'
import type { Page } from '@/types'

export function useActivePage(): Page | undefined {
  const pages = useDocumentStore((state) => state.document.pages)
  const activePageId = useEditorStore((state) => state.activePageId)
  return pages.find((p) => p.id === activePageId)
}
