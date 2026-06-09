# Skill: test-strategy

Use this skill only when the reviewer agent has flagged TESTS REQUIRED: yes.
Do not run this skill speculatively or by default.

---

## Step 0 — Verify test infrastructure is installed

Before writing a single test, confirm a test runner exists:

```bash
npm test -- --passWithNoTests 2>&1 | head -5
```

If the output contains "no test runner", "command not found", or similar — **stop**.
Install the minimum required packages before continuing:

```bash
# Jest + Testing Library (recommended for this project)
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom ts-jest @types/jest
```

Then add to `package.json` scripts:
```json
"test": "jest"
```

And add `jest.config.ts` at the project root. Only proceed to Step 1 once `npm test` runs without a configuration error.
---

## Step 1 — Read the reviewer's output

Pull the TESTS REQUIRED section from the /review output:
- What logic or behaviour warranted testing?
- What test types were recommended (unit / integration / e2e)?

---

## Step 2 — Determine the minimum test surface

Write the minimum tests that validate the behaviour described by the reviewer.
Do not write tests for every function or every line — only for observable behaviour.

Ask:
- What does the user see or do that could break?
- What branching logic has a meaningful consequence if wrong?
- What state transition, if incorrect, would go unnoticed without a test?

One test per distinct behaviour. Not one test per function.

---

## Step 3 — Choose test type

### Unit test — use when:
- Testing a hook in isolation (state transitions, derived values, actions)
- Testing a pure utility function
- Testing a reducer

File location: `src/__tests__/[name].test.ts`

### Integration test — use when:
- Testing a component that depends on a hook or context
- Testing form submission including validation feedback

File location: `src/__tests__/[name].test.tsx`

### E2E (Playwright) — use only when:
- Routing changed (navigation between pages)
- Auth flow changed (login, logout, session)
- Form submission flow changed end-to-end
- Critical user journey changed

File location: `e2e/[feature-name].spec.ts`
Run with: `npx playwright test --headed`

Never run E2E for styling, copy, icon, or simple component changes.

---

## Step 4 — Write tests

Rules:
- Test behaviour the user sees — not implementation details, props, or internal state
- Role-based selectors only: `getByRole` → `getByLabel` → `getByText` → `getByPlaceholder`
- Never use CSS selectors or raw element selectors
- One `describe` block per feature, one `it` per behaviour
- Test names read as plain English: `it('shows an error when email is invalid')`

---

## Step 5 — Run and fix

```bash
npm test                   # unit and integration
npx playwright test        # e2e only if written
```

Fix every failure before proceeding. Do not skip or comment out failing tests.
Re-run after every fix to confirm no regressions.

---

## Sign-off

Only output this when all tests pass:

> Tests complete. Unit ✓ / Integration ✓ / E2E ✓ — Ready for /ship.
