# Command: /review

Run the reviewer agent from .claude/agents/reviewer.md against the current diff.

To get the diff, run:
```bash
git diff HEAD
```

Pass the full diff to the reviewer agent.

If the verdict is BLOCKED — stop. Do not proceed to /verify until every
BLOCKER listed in the report is fixed and /review is re-run clean.

If the verdict is APPROVED — proceed to /verify.
