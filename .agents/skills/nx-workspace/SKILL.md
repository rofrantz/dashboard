---
name: nx-workspace
description: Run and validate Nx projects with project discovery, serve, test, build, lint, typecheck, and e2e workflows.
---

Follow the portable workflow in `docs/agents/nx-workspace-skill.md` and the repository rules in `AGENTS.md`. Use `npm exec nx`, discover project names before targeting them, retry finite commands with `NX_DAEMON=false` after daemon EPERM errors, and never kill unrelated Node processes.

When configuring React with Tailwind v4, use the PostCSS integration and import Tailwind from plain CSS (`@import "tailwindcss";`). Never add that import to a Sass file; update the app entrypoint to use the CSS stylesheet instead.

Use Tailwind utility classes as the default styling mechanism. Keep SCSS thin and only use it for third-party layout integration, resize handles, transitions, or browser-specific behavior.

For dashboard cards, use `react-grid-layout` and keep the responsive card configuration in `apps/personal-dashboard/src/data/dashboard.json` rather than hardcoding card content in the component.

Keep dashboard styles in SCSS and define the small grid/resize rules locally; do not import package-internal `react-grid-layout/css/*` or `react-resizable/css/*` paths.
