# Skill: git-flow

Use this skill when implementation is complete and all verification gates have passed.
Never run this skill before the verify skill has signed off.

---

## Step 1 — Create a feature branch

Branch naming convention:
```
feature/[short-kebab-case-description]
```

Examples:
- `feature/notification-center`
- `feature/task-filter-sort`
- `feature/form-validation`

```bash
git checkout -b feature/[branch-name]
```

Never commit directly to `main`.

---

## Step 2 — Stage all changed files

```bash
git add .
```

Then review what is staged:
```bash
git status
```

Check that:
- [ ] Only files relevant to the task are staged
- [ ] No `.env` files are staged
- [ ] No `node_modules` are staged
- [ ] No build artifacts (`/.next`) are staged

---

## Step 3 — Write a structured commit message

Format:
```
feat: [what was built in max 60 characters]

What was built:
- [file 1] — [one line reason]
- [file 2] — [one line reason]
- [file 3] — [one line reason]

Reusable parts:
- [what can be reused for future features]

Tradeoffs:
- [any decisions made that weren't explicitly specified]
```

Example:
```
feat: add task manager with filter and sort

What was built:
- src/types/task.ts — Task interface and FilterType union
- src/hooks/useTasks.ts — state management with useReducer, filter, sort
- src/components/sections/TaskList.tsx — main UI with all four states
- src/components/ui/TaskItem.tsx — single task row with actions

Reusable parts:
- useTasks hook filter/sort pattern reusable for any list feature
- TaskItem composition pattern reusable for any item-action UI

Tradeoffs:
- Chose useReducer over useState — 5 action types made reducer cleaner
- Chose client-side filter over URL params — scope said local state only
```

---

## Step 4 — Push the branch

```bash
git push -u origin feature/[branch-name]
```

---

## Step 5 — Open a pull request

PR title: same as the commit first line
PR body structure:

```
## What was built
[2-3 sentences describing the feature]

## Files changed
| File | Purpose |
|---|---|
| src/types/[x].ts | [why] |
| src/hooks/[x].ts | [why] |
| src/components/[x].tsx | [why] |

## Reusable parts
- [what can be reused]

## Tradeoffs
- [decisions made and why]

## Verification
- TypeScript ✓
- Lint ✓
- Tests ✓
- Build ✓
- Browser ✓
```

---

## Rules

- Never commit to `main` directly
- Never run this skill before verify has signed off
- Never include unrelated files in the commit
- Commit message must explain the *why*, not just the *what*