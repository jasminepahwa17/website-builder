@AGENTS.md
# Project: Agentic Frontend Interview Setup
# Stack: Next.js 16, TypeScript, Tailwind CSS
# Agent: Cline (Claude Sonnet)

---

## Ground Rules

- Make the smallest change that satisfies the requirement. Do not rewrite files not mentioned in the task.
- After every implementation step, run: `npm run lint && npx tsc --noEmit`
- Never skip TypeScript types. No `any`. No `// @ts-ignore`.
- Never use inline styles. Use Tailwind utility classes only.
- Always handle three UI states: loading, error, and empty — not just the happy path.

---

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
  components/
    ui/          # Dumb, reusable primitives (Button, Card, Badge, Spinner)
    sections/    # Page-level composed sections
  hooks/         # Custom React hooks (useNotifications, useFetch, etc.)
  lib/           # Utilities, constants, API helpers
  types/         # Shared TypeScript interfaces and types
```

---

## Component Rules

- Every component gets its own file. Name matches the export: `NotificationItem.tsx` exports `NotificationItem`.
- Props interface defined at the top of the file, named `[ComponentName]Props`.
- Server Components by default. Add `"use client"` only when the component uses state, effects, or browser APIs.
- Do not put business logic inside JSX. Extract to a hook or helper first.
- Prefer composition over long prop lists. If a component has more than 6 props, reconsider the design.

---

## TypeScript Rules

- Define all data shapes in `src/types/`. Import from there, never re-declare inline.
- Use `interface` for object shapes, `type` for unions and primitives.
- Async functions must have explicit return types.
- API responses must be typed before use — no implicit `any` from `fetch`.

Example type pattern:
```ts
// src/types/notification.ts
export interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  isArchived: boolean
  createdAt: string
}

export type NotificationFilter = 'all' | 'unread' | 'archived'
```

---

## State Management

- Use `useState` + `useReducer` for local UI state.
- Extract all state logic into a custom hook: `useNotifications`, `useFilters`, etc.
- No prop drilling beyond 2 levels — lift state or use context.
- Derived values (filtered lists, counts) computed inside the hook, not in JSX.

---

## Accessibility (Non-Negotiable)

- All interactive elements must be keyboard accessible.
- Icon-only buttons must have `aria-label`.
- Use semantic HTML: `<button>` for actions, `<nav>` for navigation, `<ul>/<li>` for lists.
- Dynamic content changes must use `aria-live="polite"` where appropriate.
- Never use `div` or `span` as a clickable element.

---

## Styling Rules

- Mobile-first. Base styles for mobile, `md:` and `lg:` for larger screens.
- Use Tailwind's design tokens for spacing, color, and typography — no magic numbers.
- Dark mode support via `dark:` variants where relevant.
- Consistent spacing scale: use `4, 8, 12, 16, 24, 32` (Tailwind: `p-1` through `p-8`).

---

## Data & API

- All mock data lives in `src/lib/mockData.ts`.
- All fetch logic lives in `src/lib/api.ts` — never fetch directly inside a component.
- Use a `useFetch` hook or similar abstraction to handle loading/error/data states uniformly.
- Simulate async delay (300–500ms) in mocks to test loading states.

Mock data helper pattern:
```ts
// src/lib/mockData.ts
export const mockNotifications: Notification[] = [
  { id: '1', title: 'Payment received', message: '...', isRead: false, isArchived: false, createdAt: new Date().toISOString() },
  // ...
]
```

---

## Verification Gates

Run these before marking any task complete:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Build check
npm run build

# 4. Manual browser check
# - Does it render correctly on mobile (375px)?
# - Does loading state show?
# - Does empty state show?
# - Does error state show?
# - Are all interactive elements keyboard accessible?
```

A task is NOT complete until all four gates pass.

---

## When Adding a New Feature (Extension Requirements)

1. Update types in `src/types/` first.
2. Update the relevant custom hook.
3. Update the component.
4. Run verification gates.
5. Do not touch unrelated files.

---

## What NOT to Do

- Do not use `useEffect` for data that can be derived from existing state.
- Do not create new components for one-off styling — use Tailwind classes inline.
- Do not leave `console.log` statements in committed code.
- Do not install new packages without asking first.
- Do not generate placeholder/lorem ipsum content — use realistic mock data.