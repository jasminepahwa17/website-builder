import { useEditorStore } from '@/store/editorStore'
import type { EditorStore } from '@/store/editorStore'

export function useEditor(): EditorStore {
  return useEditorStore()
}
