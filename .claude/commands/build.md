# Command: /build
Before writing any file, restate the confirmed plan from /plan in one line.
Run the scaffold-hook skill, then the scaffold-component skill, in that order.
Follow the plan confirmed in /plan exactly.

---

## Per-file gate — run after EVERY file before moving on

After writing each file, run this gate before starting the next file.
Do not batch — catch violations at the source, not in review.

### 1. Type check
```bash
node_modules/.bin/tsc --noEmit
```
Zero errors required. Fix before continuing.

### 2. CLAUDE.md quick-check
Answer each question for the file you just wrote:

- **State in hook?** Any `useState`, `useReducer`, or `useEffect` in a component file is a violation. Move it to `src/hooks/`.
- **No logic in JSX?** Any function call, ternary with side effects, or browser API (`window`, `document`) directly in JSX is a violation. Extract to a named function before the return.
- **No arbitrary Tailwind values?** Any class with `[...]` bracket syntax (e.g. `h-[42px]`, `text-[13px]`, `min-h-[200px]`) is a violation. Use only the named Tailwind scale.
- **Correct `"use client"`?** Only add it if the file uses `useState`, `useEffect`, `useRef`, event handlers, or browser APIs. Never add it to a file that doesn't need it.
- **Prop count ≤ 6?** If a component has more than 6 props, reconsider the design before continuing.

If any answer is "no" — fix the file now, re-run tsc, then continue.

---

## After all files are complete

Next step: /verify
