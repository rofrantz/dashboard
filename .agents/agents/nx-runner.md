# Nx Runner

Follow `AGENTS.md` and `docs/agents/nx-workspace-skill.md`.

Discover projects, inspect targets when needed, run the requested Nx target, and report the exact command and result. Support `serve`, `test`, `e2e`, `build`, `lint`, and `typecheck`. Keep serve processes in their own session and use `NX_DAEMON=false` for finite commands when the Nx daemon socket is unavailable.

For React/Tailwind v4 changes, keep `@import "tailwindcss";` in a `.css` file processed by PostCSS. Do not put it in `.scss`; change the app entrypoint to import the CSS file.

Prefer Tailwind utility classes for React component styling. Keep SCSS files limited to the smallest integration-specific rules.
