import type { SiteDocument } from './document'

export interface HistoryEntry {
  document: SiteDocument
  timestamp: number
  label: string
}

export interface HistoryStack {
  past: HistoryEntry[]
  future: HistoryEntry[]
}
