# Skill: scaffold-hook

Use this skill whenever building any custom React hook from scratch.

---

## Step 1 — Understand the hook

Answer these before writing anything:
- What is this hook's single responsibility?
- What state does it manage?
- What does it return — values, derived data, actions?
- Does it fetch data, manage local UI state, or both?
- Is there an existing hook in `src/hooks/` that can be extended instead?

---

## Step 2 — File location

All hooks go in `src/hooks/useHookName.ts`
Never use `.tsx` unless the hook returns JSX — which it should not.

---

## Step 3 — Define the return type first

Always type what the hook returns before writing the implementation.
This forces clarity on what the hook actually does.

```ts
interface Use[Feature]Return {
  // Raw state
  items: Item[]
  isLoading: boolean
  error: Error | null

  // Derived state — computed, not stored
  filteredItems: Item[]
  count: number

  // Actions
  setFilter: (filter: FilterType) => void
  handleCreate: (data: CreateInput) => void
  handleUpdate: (id: string, data: UpdateInput) => void
  handleDelete: (id: string) => void
  retry: () => void
}
```

---

## Step 4 — Choose the right state primitive

### Use `useState` when:
- Managing a single, isolated value
- State transitions are simple (toggle, set, clear)

### Use `useReducer` when:
- 3 or more related state values
- State has 3 or more distinct action types
- State transitions depend on previous state

```ts
// Action union — exhaustive, no catch-all
type Action =
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error }
  | { type: 'SET_DATA'; payload: Item[] }
  | { type: 'CREATE_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: { id: string; changes: Partial<Item> } }
  | { type: 'DELETE_ITEM'; payload: string }

// Reducer — pure function, no side effects
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_DATA':
      return { ...state, items: action.payload, isLoading: false, error: null }
    case 'CREATE_ITEM':
      return { ...state, items: [...state.items, action.payload] }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.changes }
            : item
        ),
      }
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) }
    default:
      return state
  }
}
```

---

## Step 5 — Data fetching pattern

Always simulate async delay in mocks. Never fetch directly in a component.

```ts
const fetchData = useCallback(async () => {
  dispatch({ type: 'SET_LOADING', payload: true })
  try {
    // Replace with real API call when available
    await new Promise(resolve => setTimeout(resolve, 400))
    const data = mockItems // or: await api.getItems()
    dispatch({ type: 'SET_DATA', payload: data })
  } catch (err) {
    dispatch({ type: 'SET_ERROR', payload: err as Error })
  }
}, [])

useEffect(() => {
  fetchData()
}, [fetchData])
```

---

## Step 6 — Derived values with useMemo

Never compute derived values in JSX. Always in the hook.

```ts
// Filtering
const filteredItems = useMemo(() => {
  switch (state.filter) {
    case 'active':   return state.items.filter(item => item.isActive)
    case 'archived': return state.items.filter(item => item.isArchived)
    default:         return state.items
  }
}, [state.items, state.filter])

// Counts
const activeCount = useMemo(
  () => state.items.filter(item => item.isActive).length,
  [state.items]
)

// Sorting
const sortedItems = useMemo(
  () => [...filteredItems].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ),
  [filteredItems]
)
```

---

## Step 7 — Pagination pattern (if required)

```ts
const ITEMS_PER_PAGE = 10

const paginatedItems = useMemo(() => {
  const start = (state.page - 1) * ITEMS_PER_PAGE
  return filteredItems.slice(start, start + ITEMS_PER_PAGE)
}, [filteredItems, state.page])

const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
```

---

## Step 8 — Return exactly what components need

Nothing more, nothing less. Components access only the values and functions the hook exposes.

```ts
return {
  // State
  isLoading: state.isLoading,
  error: state.error,
  filter: state.filter,

  // Derived
  items: filteredItems,
  count: activeCount,
  totalPages,

  // Actions — named clearly for what they do
  setFilter: (filter: FilterType) => dispatch({ type: 'SET_FILTER', payload: filter }),
  createItem: (data: CreateInput) => { /* ... */ },
  updateItem: (id: string, changes: Partial<Item>) => dispatch({ type: 'UPDATE_ITEM', payload: { id, changes } }),
  deleteItem: (id: string) => dispatch({ type: 'DELETE_ITEM', payload: id }),
  retry: fetchData,
}
```

---

## Output checklist — do not mark done until all pass

- [ ] Return type interface defined before implementation
- [ ] State shape chosen and justified (useState vs useReducer)
- [ ] Reducer has no catch-all default that swallows unknown actions
- [ ] All derived values use `useMemo`
- [ ] Data fetching simulates async delay
- [ ] Loading, error, and empty states handled inside the hook
- [ ] No business logic in components — all in the hook
- [ ] No `any` types
- [ ] `npx tsc --noEmit` passes