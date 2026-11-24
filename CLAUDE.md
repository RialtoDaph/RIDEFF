# RIDEFF: rules for Claude sessions

## ElevenLabs agent tests cost real credits (read before running any)

On 2026-11-23 two test suites burned about 30.8K credits (about $5.70) in one afternoon:
each simulated run costs roughly 680-700 credits (full agent prompt, several tool calls),
and `repeat_count` multiplies it (6 tests x 5 = 30 runs = 20.3K credits).

There is no test script or CI job in this repo that calls ElevenLabs (CI runs lint,
typecheck and build only, without secrets). The runs came from agent sessions calling
`agents_run_tests` / `agents_run_attached_tests` / `agents_create_simulation_test`.
So these rules are the guard:

1. **Do not run ElevenLabs tests unless the user asks for it in that message.**
   Never as a side effect of "verify", "check" or "make sure it works".
2. **`repeat_count` defaults to 1.** Raise it only if the user names a number, and
   never above 3.
3. **State the estimate first**: runs x ~700 credits (about $0.18 per run), and
   wait for a yes if it is above 5 runs.
4. **Iterate prompts on the cheap model** (`deepseek-v41-flash`). Use
   `claude-sonnet-4-6` only for one final validation pass.
5. **Run tests on a branch or a TEST copy, never loop**: no retry on failure,
   no re-running a suite to "see if it is flaky" without asking.
6. **Delete throwaway TEST agents when done**, but first save failing results
   (rationale and transcript) in the PR or notes: results are gone with the agent.
7. Do not poll `convai` text/simulate endpoints in a loop. Each message is billed.

Hard stop stays in ElevenLabs: spend limit and budget alerts (see TODO.md → Nana).
