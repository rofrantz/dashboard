# Dashboard routes

The application uses a dedicated home route:

```text
/      → redirects to /home
/home  → renders apps/personal-dashboard/src/app/home/dashboard.tsx
```

The route setup is in `apps/personal-dashboard/src/app/app.tsx`. Future pages should be added as separate route components under `src/app/` and registered there.
