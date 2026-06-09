# Command: /ship

Run the git-flow skill.

Only run after the full chain has signed off:
- /verify passed clean
- /review returned APPROVED
- /test passed (if TESTS REQUIRED was yes)

Stop if any of the above have not been completed — fix and re-run the
failed step first.