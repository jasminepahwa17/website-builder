# ROADMAP — Wix-like Website Builder

> Planned 2026-06-10. No code written yet — awaiting confirmation.

---

## 1. Requirement Restatement

Build a browser-based, drag-and-drop website builder in Next.js / TypeScript / Tailwind.
Users visually compose pages from a palette of element types (text, image, button, container, etc.),
edit properties in a side panel, and get a serialisable site document they can save and reload.

**In scope**
- Visual canvas that renders a live site document
- Palette → drag element onto canvas
- Click-to-select + property editor panel
- Undo / redo
- Multi-page site (add / rename / delete pages)
- Persistence via localStorage + JSON export / import
- Responsive preview (desktop / tablet / mobile viewport toggle)
- Inline text editing
- Basic layout containers (column, row, grid)

**Out of scope** (v1)
- Real publishing / hosting
- Auth or multi-user collaboration
- Server-side persistence / database
- Custom code injection
- Animation editor
- E-commerce / form submission backends

---

## 2. Clarifying Questions

1. **Positioning model** — absolutely positioned elements (Wix-style free canvas) or flow-based layout (Webflow-style)? This changes drag behaviour and the CSS rendered to the page significantly. *Recommendation: flow-based with flexbox containers; avoids z-index hell and maps to real HTML better.*
2. **Rendering target** — does the canvas render actual HTML/CSS (iframe or shadow DOM) or a React-component tree that mirrors the document? *Recommendation: React component tree in the same page, simpler to start; iframe isolation adds complexity.*
3. **Collaboration requirement** — any multi-user or real-time sync now or soon? *If yes, state must be CRDT-friendly from day one.*

---

## 3. Core Data Model

All types live in `src/types/`. One file per concern.

### `src/types/document.ts`

```
SiteDocument
  id: string
  name: string
  pages: Page[]
  globalStyles: GlobalStyles       // fonts, colour palette, spacing tokens
  createdAt: ISO string
  updatedAt: ISO string

Page
  id: string
  title: string
  slug: string                     // used for preview URL
  rootElement: ContainerElement    // every page has one implicit root container
  meta: PageMeta                   // <title>, description, og tags

Element  (discriminated union — see below)
  id: string
  type: ElementType
  styles: ElementStyles            // maps to CSS — position, size, spacing, colour…
  props: {}                        // type-specific: TextElement.props.content, ImageElement.props.src…
  children?: Element[]             // only Container, Row, Column, Grid carry children

ElementType = 'text' | 'heading' | 'image' | 'button' | 'divider'
            | 'container' | 'row' | 'column' | 'grid' | 'spacer'

ElementStyles
  width, height, padding, margin   // spacing tokens only — no arbitrary values
  background, color, borderRadius
  flexDirection, gap, alignItems, justifyContent  // layout containers
  fontSize, fontWeight, fontFamily, textAlign    // text elements

GlobalStyles
  fontPrimary, fontSecondary
  colorPalette: Record<string, string>   // e.g. { brand: '#3B82F6', … }
  spacingScale: number[]
```

### `src/types/editor.ts`

```
EditorState
  activePageId: string
  selectedElementId: string | null
  hoveredElementId: string | null
  dragState: DragState | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  panelTab: 'design' | 'content' | 'layout'
  historyIndex: number              // pointer into undo stack

DragState
  elementId: string | null          // null when dragging from palette (new element)
  elementType?: ElementType         // set when dragging from palette
  originParentId: string | null
  originIndex: number
```

### `src/types/history.ts`

```
HistoryEntry
  document: SiteDocument            // full snapshot (simpler than diff patches for v1)
  timestamp: number
  label: string                     // 'Add text', 'Move element', …

HistoryStack
  past: HistoryEntry[]              // max 50 entries, oldest dropped
  future: HistoryEntry[]
```

---

## 4. Canvas Rendering Model

The canvas is a recursive React component tree that walks the `Element[]` tree.

```
<Canvas>                              ← renders activePage.rootElement
  <ElementRenderer element={root}>   ← dispatches to correct renderer by element.type
    <ContainerRenderer>
      {children.map(child =>
        <ElementRenderer element={child} />
      )}
    </ContainerRenderer>
  </ElementRenderer>
</Canvas>
```

Each renderer:
- Applies `element.styles` as Tailwind classes (via a `stylesToClasses(styles)` util)
- Wraps its output in `<SelectionWrapper>` which adds click-to-select, hover ring, and drag handles
- Is a pure function of the element node — no internal state

**Why not an iframe?** Same-origin React tree keeps the dev loop simple. When a real preview/publish pipeline is needed, a serialiser converts the `SiteDocument` to plain HTML + CSS — that's a separate step.

---

## 5. State Management

Two stores, cleanly separated:

### Document store — `src/store/documentStore.ts`
Holds the `SiteDocument`. All mutations are actions on this store.
Uses **Zustand** (or `useReducer` behind a context) — updates are high-frequency during drag/resize.
Every mutation that the user would want to undo pushes a `HistoryEntry` before applying.

Key actions:
- `addElement(parentId, index, element)`
- `updateElement(id, patch)` — merge partial styles or props
- `moveElement(id, newParentId, newIndex)`
- `deleteElement(id)`
- `addPage / renamePage / deletePage`
- `updateGlobalStyles(patch)`

### Editor store — `src/store/editorStore.ts`
Holds `EditorState`. Never persisted — reset on load.
Uses **Zustand** (UI state changes are frequent; context re-renders would be expensive).

Key actions:
- `selectElement(id)`
- `hoverElement(id)`
- `setDragState(state)`
- `setPreviewMode(mode)`
- `setPanelTab(tab)`

### Undo / redo
Lives in the document store as `past[]` and `future[]` stacks.
`undo()` pops `past`, pushes current to `future`, restores snapshot.
Max stack depth: 50.

### Component → store wiring rule
Components **never** import stores directly. Each domain gets a hook:
- `useDocument()` → reads/writes document store slices
- `useEditor()` → reads/writes editor store slices
- `useActivePage()` → derived: `useDocument().pages.find(p => p.id === editorState.activePageId)`

---

## 6. Persistence & Serialisation

### Auto-save (localStorage)
After every document mutation, debounce 800 ms, then:
```
localStorage.setItem('site-document', JSON.stringify(document))
```
On load, rehydrate from localStorage if present; otherwise start with `DEFAULT_DOCUMENT`.

### Export / Import (JSON)
`lib/utils/serialise.ts` exposes:
- `exportDocument(doc: SiteDocument): string` — `JSON.stringify` with a schema version field
- `importDocument(json: string): SiteDocument | Error` — validates schema version, strips unknown keys

Schema version is a top-level `"v": 1` field. Migrations run on import when `v` is older.

### Publish preview (future)
`lib/utils/renderToHtml.ts` walks the `SiteDocument` tree and emits a self-contained HTML string.
Not needed for v1; design the serialiser interface to support it later without touching the stores.

---

## 7. Dependency-Ordered Feature Roadmap

Each item is one ship unit — implement fully (types → hooks → components → tests) before starting the next.

| # | Feature | Depends on | What it proves |
|---|---------|-----------|----------------|
| 1 | ✅ **Foundation: types + stores + default document** | — | All later features have a type-safe contract to build against |
| 2 | **Canvas renderer** (read-only, no interaction) | 1 | Element tree → visible HTML; validates data model |
| 3 | **Click-to-select + selection ring** | 2 | `editorStore.selectedElementId` wired to canvas |
| 4 | **Properties panel** (edit styles + props of selected element) | 3 | Full read/write loop; first real user interaction |
| 5 | **Element palette + add element** | 3 | `addElement` action; palette → canvas |
| 6 | **Drag to reorder within canvas** | 5 | `moveElement` action; most complex interaction |
| 7 | **Delete element** | 3 | Keyboard shortcut (Delete/Backspace) + toolbar button |
| 8 | **Undo / redo** | 4–7 | History stack; validates that all mutations push entries |
| 9 | **Inline text editing** | 4 | `contentEditable` in canvas; `updateElement` on blur |
| 10 | **Page management** (add / rename / delete / switch) | 1 | Multi-page; `addPage / deletePage` actions |
| 11 | **LocalStorage auto-save + restore on load** | 10 | Persistence loop fully exercised |
| 12 | **JSON export / import** | 11 | Serialiser utility; user can share sites |
| 13 | **Layout containers** (row, column, grid) | 6 | Nested element trees; flexbox/grid in canvas |
| 14 | **Global styles panel** (colour palette, fonts) | 4 | `updateGlobalStyles`; CSS variables injected into canvas |
| 15 | **Responsive preview** (viewport toggle) | 2 | Canvas width clamp; no new state needed |
| 16 | **Drag from palette onto canvas position** | 6, 13 | Drop zone detection in nested containers |
| 17 | **Resize handles** | 3 | `updateElement` with new width/height on mouse-up |
| 18 | **Multi-select + group** | 7, 13 | `selectedElementIds: string[]`; group into container |
| 19 | **Copy / paste element** | 7 | Clipboard serialise/deserialise element subtree |
| 20 | **Publish preview** (render to HTML string, open in new tab) | 12 | End-to-end: document → real HTML |

---

## 8. Reusability Notes

- `stylesToClasses(styles: ElementStyles): string` — used by every element renderer and the property panel; keep it pure and tested.
- `useHistory()` — the undo/redo pattern is generic; any future feature needing history inherits it for free.
- `exportDocument / importDocument` — the serialiser is the foundation for cloud save, version history, and the publish pipeline.
- `ElementRenderer` — the dispatcher component is the extension point; adding a new element type is one new renderer file + one entry in the `ElementType` union.
- The `editorStore` pattern (UI-only state, never persisted) applies to any future modal, tooltip, or panel system.

---

## 9. Open Decisions (flag before building)

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Global state library | Zustand vs Context+useReducer | **Zustand** — drag/resize updates are too frequent for context without memoisation everywhere |
| Element positioning | Absolute vs flow-based | **Flow-based** — maps to real HTML; absolute is a dead end for responsive |
| Canvas isolation | Same-page React vs iframe | **Same-page React** for v1; add iframe later for preview |
| Styling strategy | Tailwind class map vs inline styles | **Inline styles for dynamic values** (width, custom colours); Tailwind for structural/layout classes |
| State library approval | Zustand requires `npm install zustand` | Confirm before Feature 1 |

---

*Awaiting confirmation to begin Feature 1.*
