# Command: /review

Run the reviewer agent from .claude/agents/reviewer.md against the current diff.

To get the diff, run:
```bash
git diff HEAD
```

Pass the full diff to the reviewer agent.

If the verdict is BLOCKED — stop. Fix every blocker and re-run /review before proceeding.

If the verdict is APPROVED:
- Check the TESTS REQUIRED flag in the report.
- If TESTS REQUIRED: yes — next step is /test.
- If TESTS REQUIRED: no — next step is /ship.
