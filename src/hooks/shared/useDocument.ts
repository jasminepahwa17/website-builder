import { useDocumentStore } from '@/store/documentStore'
import type { DocumentStore } from '@/store/documentStore'

export function useDocument(): DocumentStore {
  return useDocumentStore()
}
