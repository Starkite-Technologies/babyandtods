# Documentation

## Prototype Reference

The original single-file prototype is preserved at `docs/prototype.html`. It defines the academy palette, dashboard rhythm, role switcher, cards, stats, tables, and private management workflows used as the visual reference for the current platform.

## Current Scope

- Public informational website pages are implemented in `apps/web/src/app`.
- Private parent, teacher, and admin routes use shared dashboard components and mock data.
- The backend exposes `GET /health` and contains module folders for the planned academy domains.
- Prisma is configured for future database work, but no live database is required.
