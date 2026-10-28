# Dashboard routes and interactions

The application uses a dedicated home route:

```text
/      → redirects to /home
/home  → renders apps/personal-dashboard/src/app/home/home.tsx
```

The route setup is in `apps/personal-dashboard/src/app/app.tsx`. Future pages should be added as separate route components under `src/app/` and registered there.

The home page loads its card configuration from `apps/personal-dashboard/src/data/dashboard.json` through `dashboard.api.ts`. Cards are rendered with `react-grid-layout` and can be:

- dragged from the title area, which uses the `.cursor-move` handle;
- resized from the southeast resize handle;
- repositioned responsively using the `layout` entries for each breakpoint.

`DashboardItem` forwards the grid’s injected ref, class, style, event handlers, and resize-handle children to its root section. Keep that forwarding intact when changing card markup.

The Playwright coverage for routing, card rendering, dragging, and resizing is in `../apps/dashboard-e2e/src/home.spec.ts`. Run it with:

```text
npm exec nx e2e @rofrantz/dashboard-e2e
```
