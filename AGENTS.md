# Nx workspace instructions

This repository is an Nx workspace. Use the repository's installed Nx version through `npm exec nx`.

## Project discovery

- Start with `npm exec nx show projects`; project names may differ from folder and package names.
- Inspect targets with `npm exec nx show project <project>` before choosing a target when configuration is unclear.

## Common commands

- Run an app: `npm exec nx serve <app-project>`
- Unit tests: `npm exec nx test <project>`
- End-to-end tests: `npm exec nx e2e <e2e-project>`
- Build: `npm exec nx build <project>`
- Lint: `npm exec nx lint <project>`
- Typecheck: `npm exec nx typecheck <project>` when that target exists
- Workspace checks: `npm exec nx run-many -t lint,test,build --all`
- Affected projects: `npm exec nx show projects --affected`

Use `npm exec nx run <project>:<target>` when an explicit target invocation is preferable. Treat `serve` as a long-running process and preserve its terminal/session.

## Troubleshooting and safety

- If Nx reports an EPERM daemon socket error, retry finite commands with `NX_DAEMON=false` before investigating further.
- Do not kill arbitrary Node processes to resolve a lock. Identify the owning dev server or ask the user to stop it.
- After renaming folders, rediscover project names; do not infer Nx names from paths.

Always report the exact command, project, target, and pass/fail/running result.

## Tailwind and Sass

- Use Tailwind utility classes for component and layout styling by default.
- Keep SCSS thin and limited to third-party integration selectors, grid transitions, resize handles, and browser-specific rules that cannot be expressed cleanly with utilities.
- Tailwind v4 must be imported from a plain CSS entrypoint with `@import "tailwindcss";`.
- Do not put `@import "tailwindcss";` in a `.scss` file; Dart Sass reports it as deprecated.

## Dashboard layout

- The home dashboard is driven by `apps/personal-dashboard/src/data/dashboard.json`.
- Each configured card has an `id`, `title`, optional `description`, `items`, and responsive layouts under `layout`.
- Use the installed `react-grid-layout` package for dragging and resizing; do not reimplement grid interactions unless the requirements change substantially.
- Do not import `react-grid-layout/css/styles.css` or `react-resizable/css/styles.css` from package subpaths; keep the required grid and resize rules in the dashboard's local `.scss` file because those package CSS paths are not exported by the installed version.
