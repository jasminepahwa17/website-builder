# Command: /test

Only run this command if /review returned TESTS REQUIRED: yes.
Do not run speculatively.

Run the test-strategy skill from .claude/skills/test-strategy.md.

If all tests pass — next step is /ship.

If any test fails:
1. Fix the failure.
2. Ask: what did the fix touch?
   - **Test file only** (wrong assertion, missing mock, wrong selector) → re-run /test directly.
   - **Code changed** (bug exposed, logic corrected) → stop. Run /verify → /review on the new diff. Only re-run /test after /review returns APPROVED.

Do not proceed to /ship with failing tests.
