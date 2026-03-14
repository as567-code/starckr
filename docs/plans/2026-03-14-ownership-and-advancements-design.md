# Ownership & Advancements — Design Document

**Date:** 2026-03-14  
**Status:** Approved

---

## Goal

Transform the Hack4Impact boilerplate into a fully personal, modern, production-grade full-stack TypeScript starter — rebranded, modernized, visually overhauled, and extended with granular role-based access control and comprehensive test coverage.

---

## Phase 1 — Make It Yours

### 1.1 Rebrand & Clean Up

Remove all Hack4Impact and boilerplate-s2022 references. Update:
- `package.json` (name, repository URL, description)
- `README.md` — rewrite for personal use
- All code comments referencing the original org
- `tsconfig.json`, `docker-compose.yml`, Terraform variables referencing old naming

Delete dead/unused code:
- `infrastructure/modules (unused)/` directory
- Any commented-out code blocks

### 1.2 Stack Modernization

| Current | Target |
|---|---|
| Node 14 target | Node 20 LTS |
| Create React App | Vite + React |
| yarn v1 classic | yarn v4 (berry) or pnpm |
| Outdated deps | Latest stable versions |

Key changes:
- Replace `react-scripts` with `vite` and `@vitejs/plugin-react`
- Update all `package.json` files with current dependency versions
- Replace CRA-specific files (`react-app-env.d.ts`, `reportWebVitals.ts`, `setupTests.ts`) with Vite equivalents
- Update `tsconfig.json` targets to ES2022 / Node 20

---

## Phase 2 — Advancements

### 2.1 Full UI Overhaul — Bold & Dark-First

**Design Language:**
- Dark mode as default; light mode toggle persisted in localStorage
- Font: Inter (via `@fontsource/inter`) or Geist
- Palette: near-black background (`#0a0a0a`), white text, vivid accent (electric blue `#3b82f6` or violet `#8b5cf6`)
- Rounded corners: `8px` standard, `12px` for cards
- Subtle glassmorphism on auth cards
- Framer Motion for page transitions and micro-animations

**Pages to redesign:**
- Login, Register, Verify Account, Reset Password, Invite Register — unified split-screen layout (brand panel left, form right)
- Admin Dashboard — proper sidebar navigation, stats cards at top, data table below
- 404 Not Found — branded, animated

**Component additions:**
- `ThemeToggle` button in navbar
- `Sidebar` layout shell for authenticated pages
- `Toast` notification system (replacing any raw `alert()` calls)

### 2.2 Granular Roles & Permissions (RBAC)

**Current state:** binary `admin: boolean` on the User model.

**Target state:** flexible role system.

User model change:
```
roles: string[]  // e.g. ['user'], ['admin'], ['superadmin', 'moderator']
```

Roles defined:
| Role | Permissions |
|---|---|
| `user` | Access own profile, basic app features |
| `moderator` | View all users, cannot delete/promote |
| `admin` | View, delete, promote users to moderator/admin |
| `superadmin` | All admin actions + promote to superadmin |

**Implementation:**
- `hasRole(req, ...roles)` middleware replacing current `isAdmin` check
- `useHasRole(...roles)` React hook for UI-level guards
- Admin dashboard: role assignment dropdown per user (replacing binary promote button)
- Migration: existing `admin: true` users → assigned `['admin']` role

### 2.3 Real Test Coverage

**Backend (Jest + Supertest):**
- Auth routes: register, login, logout, verify email, reset password, invite flow
- Admin routes: list users, delete user, promote user, all with role-guard checks
- Edge cases: duplicate email, invalid tokens, expired tokens, unauthorized access
- Target: 80%+ coverage on controllers and routes

**Frontend (React Testing Library + Vitest):**
- LoginPage: renders, validation errors, successful submit, error response
- RegisterPage: field validation, password match, submit
- AdminDashboardPage: table renders users, delete/promote actions trigger correctly
- Custom hooks: `useHasRole`

**End-to-End (Playwright):**
- Full register → verify email → login → logout flow
- Password reset flow
- Admin: login as admin, delete a user, promote a user

---

## Architecture Notes

- Backend stays Express + MongoDB + Passport — no changes to core auth mechanism
- Frontend moves to Vite but stays React + React Router v6 + MUI (custom themed)
- Roles stored on the User document, no separate permissions table (YAGNI)
- Theme preference stored in `localStorage`, applied via MUI `ThemeProvider` with `createTheme`

---

## Success Criteria

- [ ] Zero references to Hack4Impact or boilerplate-s2022 in any file
- [ ] App runs cleanly on Node 20 with Vite dev server
- [ ] Dark mode default, toggle works and persists
- [ ] Auth pages look visually distinct and polished
- [ ] Admin dashboard supports 4 roles with correct guards
- [ ] Backend test coverage ≥ 80% on routes/controllers
- [ ] Playwright E2E tests pass for auth and admin flows
