# Command: /test

Only run this command if /review returned TESTS REQUIRED: yes.
Do not run speculatively.

Run the test-strategy skill from .claude/skills/test-strategy.md.

If all tests pass — next step is /ship.
If any test fails — fix immediately, re-run /test. Do not proceed to /ship with failing tests.
