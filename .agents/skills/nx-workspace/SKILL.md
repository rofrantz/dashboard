---
name: nx-workspace
description: Run and validate Nx projects with project discovery, serve, test, build, lint, typecheck, and e2e workflows.
---

Follow the portable workflow in `docs/agents/nx-workspace-skill.md` and the repository rules in `AGENTS.md`. Use `npm exec nx`, discover project names before targeting them, retry finite commands with `NX_DAEMON=false` after daemon EPERM errors, and never kill unrelated Node processes.
