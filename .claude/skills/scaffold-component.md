# Skill: scaffold-component

Use this skill whenever building any new React component from scratch.

---

## Step 1 — Understand the component

Answer these before writing anything:
- What is this component's single responsibility?
- Is it a primitive (ui/) or a composed section (sections/)?
- Does it need client interactivity? If yes → `"use client"`. If no → server component.
- What props does it accept?
- What data does it render, and where does that data come from?
- What existing primitives in `src/components/ui/` can be reused?

---

## Step 2 — Decide file location

| Type | Location |
|---|---|
| Generic reusable UI primitive | `src/components/ui/ComponentName.tsx` |
| Page-level feature section | `src/components/sections/ComponentName.tsx` |
| Layout element | `src/components/layout/ComponentName.tsx` |

---

## Step 3 — Define types first

If this component needs data shapes not already in `src/types/`, add them there before writing the component.

```ts
// src/types/[domain].ts
export interface [EntityName] {
  id: string
  // ...fields
}

export type [FilterType] = 'all' | 'active' | 'archived' // example — adapt to problem
```

---

## Step 4 — Write the props interface

At the top of the component file, before the component function:

```tsx
interface [ComponentName]Props {
  // data props
  items: Item[]
  isLoading: boolean
  error: Error | null
  // action props
  onAction: (id: string) => void
}
```

---

## Step 5 — Scaffold the component body

Follow this internal order strictly:

```tsx
"use client" // only if needed

export function ComponentName({ prop1, prop2, onAction }: ComponentNameProps) {
  // 1. Early returns for UI states (loading, error, empty) — always first
  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading...</div>
  if (error) return <p role="alert" className="p-4 text-red-500">{error.message}</p>
  if (items.length === 0) return <p className="p-4 text-center text-gray-500">Nothing here yet.</p>

  // 2. Derived values — never in JSX
  const derivedValue = items.filter(...)

  // 3. Event handlers
  const handleAction = (id: string) => {
    onAction(id)
  }

  // 4. JSX — clean, minimal logic
  return (
    <section aria-label="[Descriptive label]">
      {/* content */}
    </section>
  )
}
```

---

## Step 6 — Handle all UI states explicitly

Every component rendering async or conditional data must handle:

- **Loading** — use `<Spinner />` from `src/components/ui/Spinner` if it exists, otherwise a plain loading div
- **Error** — `<p role="alert">` with the error message and a retry button if applicable
- **Empty** — a helpful message, never a blank screen
- **Populated** — the happy path

```tsx
// Loading
if (isLoading) return <Spinner /> // or <div className="p-4 text-center">Loading...</div>

// Error
if (error) return (
  <div role="alert" className="p-4 text-red-500">
    <p>{error.message}</p>
    <button onClick={onRetry} className="mt-2 text-sm underline">Try again</button>
  </div>
)

// Empty
if (items.length === 0) return (
  <div className="p-8 text-center text-gray-500">
    <p>No items found.</p>
  </div>
)
```

---

## Step 7 — Form components (if applicable)

If this component includes a form:
- Controlled inputs only
- Validate on submit and on blur
- Inline error per field, linked via `aria-describedby`
- Disable submit while submitting
- Never clear the form on error

```tsx
<form onSubmit={handleSubmit} noValidate>
  <div>
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      value={values.email}
      onChange={e => setField('email', e.target.value)}
      onBlur={() => validateField('email')}
      aria-describedby={errors.email ? 'email-error' : undefined}
      aria-invalid={!!errors.email}
    />
    {errors.email && (
      <p id="email-error" role="alert" className="text-red-500 text-sm mt-1">
        {errors.email}
      </p>
    )}
  </div>
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

---

## Step 8 — Accessibility checklist

Before finishing, verify every item:
- [ ] All `<button>` elements have visible text or `aria-label`
- [ ] Lists use `<ul>/<li>`, not `<div>`
- [ ] All interactive elements reachable by Tab
- [ ] Dynamic content updates use `aria-live="polite"`
- [ ] No `onClick` on `<div>` or `<span>`
- [ ] All form inputs have associated `<label>`
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Section or main landmark has `aria-label`

---

## Step 9 — Styling checklist

- [ ] Mobile-first base classes, `md:` for desktop
- [ ] No inline styles
- [ ] No arbitrary Tailwind values — use spacing scale only
- [ ] Dark mode `dark:` variants where needed

---

## Output checklist — do not mark done until all pass

- [ ] Types defined in `src/types/` before component was written
- [ ] Props interface at top of file
- [ ] All four UI states handled (loading, error, empty, populated)
- [ ] No `any` types
- [ ] No inline styles
- [ ] Accessibility checklist complete
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes