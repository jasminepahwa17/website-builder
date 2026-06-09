# Project: Agentic Frontend
# Stack: Next.js 16, TypeScript, Tailwind CSS
# Agent: Claude Code

---

## Agentic Workflow — Follow This Order Every Time

Every task follows this sequence without exception:

### Step 1 — Understand the problem
Before writing any code:
- Restate the requirement in your own words
- List what is explicitly in scope
- List what is out of scope
- If anything is ambiguous, ask one clarifying question before proceeding

### Step 2 — Identify reusable capabilities
Before creating anything new:
- Check `src/components/ui/` for existing primitives
- Check `src/hooks/` for existing hooks to extend
- Check `src/lib/` for existing utilities
- List what can be reused and what must be created fresh

### Step 3 — Reuse or set up skills and agents
- Use the planner agent to produce an implementation plan
- Use the scaffold-component skill when building any component
- Use the scaffold-hook skill when building any custom hook
- Use the verify skill after completing a feature
- Only prompt directly for small, one-off fixes that don't fit a skill

### Step 4 — Create a short implementation plan
Write a bullet list of every file to create or modify, in order.
Get confirmation before starting if the plan touches more than 3 files.
Always follow this order: types → hooks → components → page wiring → tests

### Step 5 — Implement in small reviewable steps
- One file at a time
- Summarise in one line what was added after each file
- Do not move to the next file until the current one compiles cleanly
- Never write more than one logical unit before running a check

### Step 6 — Review diffs and decisions
After completing all files:
- List every file changed with a one-line summary
- Flag every decision that wasn't explicitly specified and explain why you made it

### Step 7 — Run verification gates
Run the verify skill. Fix every failure before proceeding.
Do not accumulate failures across steps.

### Step 8 — Fix issues found by verification
Fix immediately. Re-run the failed check. Then re-run the full verify skill.

### Step 9 — Final quality gate
Run `npm run build` as the hard final gate.
A task is NOT complete until the build passes clean.

### Step 10 — Explain the solution
After completing the task provide:
- What was built and why each file exists
- Which parts are reusable for future features
- What tradeoffs were made
- What would change if the feature needed to scale or be extended

---

## Project Structure

```
src/
  app/              # Next.js App Router — pages and layouts only
  components/
    ui/             # Dumb, reusable primitives — no business logic
    sections/       # Page-level composed sections
    layout/         # Navbar, Footer, Sidebar
  hooks/            # Custom React hooks — all state and data logic lives here
  lib/              # Utilities, mock data, API helpers, constants
  types/            # All TypeScript interfaces and types
```

---

## Component Rules

- One component per file. Filename matches the export.
- Props interface at the top of the file, named `[ComponentName]Props`.
- Server Component by default. Add `"use client"` only when using: useState, useEffect, useRef, event handlers, or browser APIs.
- No business logic inside JSX. Extract to a hook or helper first.
- If a component has more than 6 props, reconsider the design.
- Check `src/components/ui/` before creating any new primitive.

---

## TypeScript Rules

- No `any`. No `// @ts-ignore`. No implicit types.
- All data shapes defined in `src/types/` — never inline.
- Use `interface` for object shapes, `type` for unions and primitives.
- All async functions have explicit return types.
- API responses typed before use.

---

## State Management Rules

- All state logic lives in custom hooks in `src/hooks/` — never in components.
- Use `useState` for simple, isolated values.
- Use `useReducer` when there are 3 or more related actions.
- No prop drilling beyond 2 levels — lift state or use context.
- Derived values computed with `useMemo` inside the hook, never in JSX.

---

## Global State Rules

### When to use global state
Reach for global state only when all of the following are true:
- The value is read or written by components in more than one branch of the tree
- Prop drilling to reach a consumer would exceed 2 levels
- Lifting to the nearest common ancestor is impractical

When none of the above apply, keep state local in a hook. Do not use
global state for UI-only state (panel open/closed, hover, tooltip) —
that stays local always.

### Choosing a solution
Assess before choosing. In order of preference:

1. **React Context + useReducer** — use when updates are low-frequency
   and consumers are few. No package required.

2. **Dedicated state library** — use when any of the following apply:
   - Updates are high-frequency (selection, drag, live input)
   - Many independent consumers need different slices of the same state
   - Time-travel (undo/redo) is a requirement

   If a library is needed: propose the choice with a one-line justification
   and wait for approval before installing.

Never choose a library to avoid thinking about state shape.

### Structure — applies regardless of solution chosen
- Global state lives in `src/store/`. One file per domain (e.g. `editorStore.ts`, `pagesStore.ts`).
- Never import a store or context directly in a component. Always wrap
  in a hook in `src/hooks/` that returns only what the component needs.
- Mutations live inside the store or reducer — never in components or hooks.
- Components subscribe to the smallest slice they need — not the whole store.

---

## Data and API Rules

- All mock data lives in `src/lib/mockData.ts`.
- All fetch logic lives in `src/lib/api.ts` — never fetch directly inside a component.
- Always simulate async delay (300–500ms) in mocks to exercise loading states.
- Use a shared `useFetch` hook or similar abstraction for consistent loading/error/data handling.

---

## UI State Rules — Non-Negotiable

Every component that renders async data must handle all four states:
- **Loading** — spinner, skeleton, or loading text. Never blank.
- **Empty** — helpful message explaining why it's empty. Never blank.
- **Error** — clear error message with retry if possible.
- **Populated** — the happy path.

---

## Form and Validation Rules

- Controlled inputs only — no uncontrolled refs for form state.
- Validate on submit and on blur, not on every keystroke.
- Show inline error messages below each field, not in an alert.
- Disable submit button while submitting. Show loading state.
- Never clear a form on error — preserve user input.

---

## Accessibility Rules — Non-Negotiable

- All interactive elements keyboard accessible via Tab.
- Icon-only buttons must have `aria-label`.
- Semantic HTML: `<button>` for actions, `<nav>` for navigation, `<ul>/<li>` for lists, `<form>` for forms.
- Dynamic content updates must use `aria-live="polite"`.
- Never put `onClick` on `<div>` or `<span>`.
- Form inputs must have associated `<label>` elements.
- Error messages linked to inputs via `aria-describedby`.

---

## Styling Rules

- Mobile-first. Base classes for mobile, `md:` and `lg:` for larger screens.
- Tailwind utility classes only — no inline styles, no CSS modules unless specified.
- Consistent spacing scale: `p-2, p-3, p-4, p-6, p-8` only — no arbitrary values.
- Dark mode support via `dark:` variants.

---

## Testing Rules

- Playwright e2e tests are optional
- If written, tests live in `e2e/[feature-name].spec.ts`.
- Test behaviour the user sees — not implementation details, internal state, or component props.
- Use role-based selectors in order: `getByRole` → `getByLabel` → `getByText` → `getByPlaceholder`.
- Never use CSS selectors or raw element selectors.
- Run with `--headed` so the browser is visible.

---

## Verification Gates — Run After Every Step

```bash
# Type check — run after every file
npx tsc --noEmit

# Lint — run after every file
npm run lint

# Playwright e2e — optional, run if tests were written
npx playwright test

# Build — run only before final sign-off
npm run build
```

All gates must pass before a task is complete.
Fix failures immediately — never accumulate them.

---

## Ground Rules

- Make the smallest change that satisfies the requirement.
- Do not modify files not mentioned in the current task.
- Do not install packages without asking first.
- Do not leave `console.log` in code.
- Do not use lorem ipsum — use realistic mock data.
- Do not generate code you cannot explain.