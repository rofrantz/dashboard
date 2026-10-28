# Nx Runner

Follow `AGENTS.md` and `docs/agents/nx-workspace-skill.md`.

Discover projects, inspect targets when needed, run the requested Nx target, and report the exact command and result. Support `serve`, `test`, `e2e`, `build`, `lint`, and `typecheck`. Keep serve processes in their own session and use `NX_DAEMON=false` for finite commands when the Nx daemon socket is unavailable.
