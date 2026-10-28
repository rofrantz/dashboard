# Nx workspace skill

Use this reusable workflow for any agent that needs to run or validate the Nx workspace.

## Inputs

The requested project, target, or goal. If a project is not explicitly named, discover it first.

## Procedure

1. Run `npm exec nx show projects`.
2. If needed, run `npm exec nx show project <project>` to inspect targets.
3. Run the smallest relevant target with `npm exec nx run <project>:<target>`.
4. For broad validation, run `npm exec nx run-many -t lint,test,build --all`; run e2e separately when browser behavior is in scope.
5. If the Nx daemon fails with EPERM, retry finite commands with `NX_DAEMON=false`.
6. Report exact commands and results. Keep serve sessions running and do not terminate unrelated processes.

## Target catalog

`serve`, `build`, `typecheck`, `lint`, `test`, and `e2e` are common targets, but always verify that the selected project exposes the requested target.

## React and Tailwind

For Tailwind v4, configure the workspace with the Tailwind PostCSS integration and load Tailwind from a plain `.css` file:

```css
@import "tailwindcss";
```

Do not place that import in `.scss`; Sass `@import` is deprecated and is the wrong processing path for Tailwind v4. If the app currently imports `styles.scss`, change the entrypoint to import the Tailwind `styles.css` file instead.
