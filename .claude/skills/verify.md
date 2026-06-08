# Skill: verify

Use this skill after every implementation step and always before marking
any task complete. Run the full checklist every time — do not skip sections.

---

## Part 1 — Terminal checks

Run in this order. Fix failures before moving to the next check.

```bash
# 1. Type check — run after every file
npx tsc --noEmit

# 2. Lint — run after every file
npm run lint

# 3. Tests — run after completing a feature
npm run test

# 4. Build — run before final sign-off only
npm run build
```

Zero errors expected on all four. If any fail — fix immediately, do not proceed.

---

## Part 2 — Browser checklist

Open the app on `localhost:3000` and verify every applicable item.

### Functionality
- [ ] Happy path renders correctly — data loads and displays
- [ ] Loading state is visible (spinner, skeleton, or loading text)
- [ ] Empty state is visible when there is no data — not a blank screen
- [ ] Error state is visible when data fails — not a blank screen
- [ ] All buttons and interactive elements work as expected
- [ ] Filters work correctly — correct items shown per filter
- [ ] Sorting works correctly if implemented
- [ ] Pagination works correctly if implemented — correct page, correct count
- [ ] Forms validate correctly — errors shown on submit and on blur
- [ ] Forms preserve input on error — user data not lost
- [ ] Submit button disabled while submitting

### Responsive layout
- [ ] 375px — mobile: no overflow, no broken layout
- [ ] 768px — tablet: layout adapts correctly
- [ ] 1280px — desktop: layout adapts correctly
- [ ] No horizontal scrollbar at any breakpoint

### Accessibility
- [ ] Tab through every interactive element — focus ring visible at all times
- [ ] All buttons have visible text or `aria-label`
- [ ] All form inputs have a visible `<label>`
- [ ] Error messages are linked to inputs via `aria-describedby`
- [ ] Lists use `<ul>/<li>` — not `<div>`
- [ ] Dynamic content updates use `aria-live="polite"` where applicable
- [ ] No `onClick` on `<div>` or `<span>`
- [ ] Page or section has a landmark with `aria-label`

### Console
- [ ] Zero errors in browser DevTools console
- [ ] Zero warnings in browser DevTools console

---

## Part 3 — Code review checklist

Read through the diff and confirm:
- [ ] No `any` types introduced
- [ ] No inline styles introduced
- [ ] No `console.log` left in code
- [ ] No business logic inside JSX
- [ ] No prop drilling beyond 2 levels
- [ ] No new packages installed without discussion
- [ ] All new files follow the project structure in CLAUDE.md
- [ ] Every decision that wasn't explicitly specified is documented in the diff summary

---

## If any check fails

1. Fix the issue immediately
2. Re-run the specific failed check to confirm it passes
3. Re-run the full verify skill from Part 1

Do not move to the next task until every check passes.

---

## Sign-off

Only output this line when every applicable check above passes:

> Verification complete. TypeScript ✓ — Lint ✓ — Tests ✓ — Build ✓ — Browser ✓ — Ready.