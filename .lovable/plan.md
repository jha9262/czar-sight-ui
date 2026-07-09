# CZAR Production — Admin Dashboard Build Plan

Enterprise-grade admin UI for hardware manufacturing, inventory, and IoT dispenser management. Industrial/technical SaaS aesthetic: dark slate sidebar, light content, blue primary, semantic status colors.

## Scope for this build (frontend-only, mock data)

You listed 9 page areas. To ship something high-quality rather than 9 shallow stubs, I'll build in two waves:

**Wave 1 — MVP (this turn):**
1. Design system (tokens, sidebar, topbar, shell, badges, data table, empty/loading states)
2. Auth flow — Login, OTP/TOTP verify, MFA setup (QR + manual key) — UI only, no backend
3. Dashboard — KPI cards, recent stock entries table, bulk vs serialized chart, quick actions
4. Warehouses — table with filters/pagination + create/edit side-panel form
5. Item Instances (Stock) — serialized/bulk tabs + adaptive "Add Stock" form

**Wave 2 (next turn, after you confirm Wave 1 looks right):**
6. Parts (Part Types + Part Masters)
7. Item Templates + Item Sourcing
8. Product Models (Companies, Dispenser Models, Blueprints)
9. BOM list + hierarchical tree detail + Add BOM Item
10. Stock Entry Templates (with Deleted tab + restore), Stock Entries, Stock Ledger
11. Users management (admin-only) with edit modal + delete confirm

Splitting this way keeps each screen polished. If you'd rather I build all 9 areas in one pass at lower fidelity per screen, say so and I'll flatten it.

## Assumptions (tell me if any are wrong)

- **No backend this turn.** All data is mocked in-memory so you can see the full UI. Lovable Cloud (auth, DB, RLS) comes later when you're ready to wire real data — I'll ask before enabling it.
- **Role gating is visual only** — Admin-only links render, but there's no real auth check yet.
- **Soft-delete/restore** shown as a "Deleted" tab with a Restore action, driven by mock state.
- **Chart** uses Recharts (already fine on this stack).
- **Dark sidebar + light content by default**, with a full dark-mode toggle in the topbar.

## Design system

- Tokens in `src/styles.css` (oklch): slate-based neutrals, blue primary (`~oklch(0.55 0.17 255)`), semantic `--success` (green), `--warning` (amber), `--destructive` (red), `--info` (blue). Sidebar uses its own dark slate token set so it stays dark even in light mode.
- Typography: Inter for body, JetBrains Mono for codes/serials/part numbers (loaded via `<link>` in `__root.tsx`).
- Shadcn components customized via variants — no ad-hoc `text-white`/`bg-[#...]` in components.
- Reusable primitives: `StatusBadge`, `KpiCard`, `DataTable` (sort/filter/paginate/row actions), `PageHeader` (title + breadcrumbs + actions), `FormDrawer`, `EmptyState`, `TableSkeleton`.

## Routes (TanStack Start, file-based)

```
src/routes/
  __root.tsx                 shell + fonts + head
  index.tsx                  redirect → /dashboard (or /login)
  login.tsx                  email+password → optional OTP step
  mfa-setup.tsx              QR + manual key + verify
  _app.tsx                   authenticated layout (sidebar + topbar + <Outlet/>)
  _app.dashboard.tsx
  _app.warehouses.tsx
  _app.inventory.parts.tsx        (wave 2)
  _app.inventory.items.tsx        item templates + sourcing (wave 2)
  _app.inventory.stock.tsx        serialized/bulk tabs (wave 1)
  _app.product-models.tsx         (wave 2)
  _app.bom.tsx / _app.bom.$id.tsx (wave 2)
  _app.stock.entries.tsx          (wave 2)
  _app.stock.templates.tsx        (wave 2)
  _app.stock.ledger.tsx           (wave 2)
  _app.users.tsx                  (wave 2)
  _app.settings.tsx               (wave 2)
```

`_app.tsx` renders the sidebar + topbar shell and an `<Outlet />`. Sidebar uses shadcn `Sidebar` with `collapsible="icon"`; active route highlighted from `useRouterState`.

## Technical notes

- Mock data lives in `src/lib/mock/*.ts` and is imported directly by pages.
- Forms use `react-hook-form` + `zod` with inline error messages under fields.
- Toasts via `sonner` (already in template).
- No `og:image` set on child routes yet (no hero images generated); each route sets its own `title`/`description` via `head()`.

## After Wave 1

I'll show you the running preview and you tell me: (a) proceed to Wave 2 as-listed, (b) adjust the visual direction first, or (c) wire Lovable Cloud auth + DB before adding more screens.
