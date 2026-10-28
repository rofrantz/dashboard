# Nx workspace skill

Use this reusable workflow for any agent that needs to run or validate the Nx workspace.

## Inputs

The requested project, target, or goal. If a project is not explicitly named, discover it first.

## Procedure

1. Run `npm exec -- nx show projects --skip-nx-cache`.
2. If needed, run `npm exec -- nx show project <project> --skip-nx-cache` to inspect targets.
3. Run the smallest relevant target with `npm exec -- nx run <project>:<target> --skip-nx-cache`.
4. For broad validation, run `npm exec -- nx run-many -t lint,test,build --all --skip-nx-cache`; run e2e separately when browser behavior is in scope.
5. If the Nx daemon fails with EPERM, retry finite commands with `NX_DAEMON=false`.
6. Report exact commands and results. Keep serve sessions running and do not terminate unrelated processes.

Always use `--skip-nx-cache`: this installed Nx version reports it as `Cache: Skipped` and does not reliably support the literal `--skip-cache` form. Place the flag on the Nx command itself, not after a `--` separator that forwards it to the underlying target command.

## Target catalog

`serve`, `build`, `typecheck`, `lint`, `test`, and `e2e` are common targets, but always verify that the selected project exposes the requested target.

## React and Tailwind

For Tailwind v4, configure the workspace with the Tailwind PostCSS integration and load Tailwind from a plain `.css` file:

```css
@import "tailwindcss";
```

Do not place that import in `.scss`; Sass `@import` is deprecated and is the wrong processing path for Tailwind v4. Use Tailwind utility classes for component styling and keep SCSS limited to integration rules that need selectors or pseudo-elements.

The active dashboard configuration is loaded from `apps/personal-dashboard/src/data/dashboard.json` through `src/app/dashboard/dashboard.api.ts`. Keep its required `id`, `type`, and `layout` fields aligned with `src/app/dashboard/dashboard.types.ts`.

Keep dashboard styling in SCSS. The installed grid package does not expose CSS subpath imports reliably, so use local SCSS for the grid placeholder and resize handle rules.
