import { create } from 'zustand'
import type { SiteDocument, Page, Element, GlobalStyles } from '@/types'
import type { HistoryEntry } from '@/types'
import { DEFAULT_DOCUMENT } from '@/lib/mockData/defaultDocument'

const MAX_HISTORY = 50

interface DocumentStoreState {
  document: SiteDocument
  past: HistoryEntry[]
  future: HistoryEntry[]
}

interface DocumentStoreActions {
  addElement: (parentId: string, index: number, element: Element) => void
  updateElement: (id: string, patch: Partial<Element>) => void
  moveElement: (id: string, newParentId: string, newIndex: number) => void
  deleteElement: (id: string) => void
  addPage: (page: Page) => void
  renamePage: (id: string, title: string) => void
  deletePage: (id: string) => void
  updateGlobalStyles: (patch: Partial<GlobalStyles>) => void
  undo: () => void
  redo: () => void
}

export type DocumentStore = DocumentStoreState & DocumentStoreActions

function pushHistory(past: HistoryEntry[], current: SiteDocument, label: string): HistoryEntry[] {
  const entry: HistoryEntry = { document: current, timestamp: Date.now(), label }
  const next = [...past, entry]
  return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next
}

function findAndUpdateElement(
  children: Element[],
  id: string,
  updater: (el: Element) => Element,
): Element[] {
  return children.map((child) => {
    if (child.id === id) return updater(child)
    if ('children' in child && child.children) {
      return { ...child, children: findAndUpdateElement(child.children, id, updater) }
    }
    return child
  })
}

function findAndDeleteElement(children: Element[], id: string): Element[] {
  return children
    .filter((child) => child.id !== id)
    .map((child) => {
      if ('children' in child && child.children) {
        return { ...child, children: findAndDeleteElement(child.children, id) }
      }
      return child
    })
}

function findAndInsertElement(
  children: Element[],
  parentId: string,
  index: number,
  element: Element,
): Element[] {
  return children.map((child) => {
    if (child.id === parentId && 'children' in child && child.children) {
      const next = [...child.children]
      next.splice(index, 0, element)
      return { ...child, children: next }
    }
    if ('children' in child && child.children) {
      return { ...child, children: findAndInsertElement(child.children, parentId, index, element) }
    }
    return child
  })
}

function extractElement(children: Element[], id: string): [Element | null, Element[]] {
  let found: Element | null = null
  const remaining = children
    .filter((child) => {
      if (child.id === id) {
        found = child
        return false
      }
      return true
    })
    .map((child) => {
      if ('children' in child && child.children) {
        const [el, next] = extractElement(child.children, id)
        if (el) found = el
        return { ...child, children: next }
      }
      return child
    })
  return [found, remaining]
}

function applyToPages(
  pages: Page[],
  transform: (root: Element[]) => Element[],
): Page[] {
  return pages.map((page) => ({
    ...page,
    rootElement: {
      ...page.rootElement,
      children: transform(page.rootElement.children),
    },
  }))
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  document: DEFAULT_DOCUMENT,
  past: [],
  future: [],

  addElement: (parentId, index, element) => {
    const { document, past } = get()
    set({
      past: pushHistory(past, document, `Add ${element.type}`),
      future: [],
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        pages: applyToPages(document.pages, (children) =>
          findAndInsertElement(children, parentId, index, element),
        ),
      },
    })
  },

  updateElement: (id, patch) => {
    const { document, past } = get()
    set({
      past: pushHistory(past, document, 'Update element'),
      future: [],
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        pages: applyToPages(document.pages, (children) =>
          findAndUpdateElement(children, id, (el) => ({ ...el, ...patch } as Element)),
        ),
      },
    })
  },

  moveElement: (id, newParentId, newIndex) => {
    const { document, past } = get()
    const pages = document.pages.map((page) => {
      const [found, remaining] = extractElement(page.rootElement.children, id)
      if (!found) return page
      const withInserted = findAndInsertElement(remaining, newParentId, newIndex, found)
      return { ...page, rootElement: { ...page.rootElement, children: withInserted } }
    })
    set({
      past: pushHistory(past, document, 'Move element'),
      future: [],
      document: { ...document, updatedAt: new Date().toISOString(), pages },
    })
  },

  deleteElement: (id) => {
    const { document, past } = get()
    set({
      past: pushHistory(past, document, 'Delete element'),
      future: [],
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        pages: applyToPages(document.pages, (children) => findAndDeleteElement(children, id)),
      },
    })
  },

  addPage: (page) => {
    const { document, past } = get()
    set({
      past: pushHistory(past, document, 'Add page'),
      future: [],
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        pages: [...document.pages, page],
      },
    })
  },

  renamePage: (id, title) => {
    const { document, past } = get()
    set({
      past: pushHistory(past, document, 'Rename page'),
      future: [],
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        pages: document.pages.map((p) => (p.id === id ? { ...p, title } : p)),
      },
    })
  },

  deletePage: (id) => {
    const { document, past } = get()
    set({
      past: pushHistory(past, document, 'Delete page'),
      future: [],
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        pages: document.pages.filter((p) => p.id !== id),
      },
    })
  },

  updateGlobalStyles: (patch) => {
    const { document, past } = get()
    set({
      past: pushHistory(past, document, 'Update global styles'),
      future: [],
      document: {
        ...document,
        updatedAt: new Date().toISOString(),
        globalStyles: { ...document.globalStyles, ...patch },
      },
    })
  },

  undo: () => {
    const { past, document, future } = get()
    if (past.length === 0) return
    const previous = past[past.length - 1]
    set({
      past: past.slice(0, -1),
      future: [{ document, timestamp: Date.now(), label: 'redo' }, ...future],
      document: previous.document,
    })
  },

  redo: () => {
    const { future, document, past } = get()
    if (future.length === 0) return
    const next = future[0]
    set({
      future: future.slice(1),
      past: pushHistory(past, document, 'redo'),
      document: next.document,
    })
  },
}))
