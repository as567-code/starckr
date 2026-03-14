# Ownership & Advancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebrand, modernize, visually overhaul, and extend this MERN boilerplate into a fully personal project with RBAC and comprehensive test coverage.

**Architecture:** Monorepo with Express/MongoDB backend and Vite/React frontend. Roles stored as a string array on the User document. MUI custom theme with dark-first design tokens. Playwright for E2E, Vitest + RTL for frontend unit tests, Jest + Supertest for backend.

**Tech Stack:** Node 20, TypeScript, Express, MongoDB/Mongoose, Passport.js, React 18, Vite, Material UI v5, Framer Motion, Playwright, Vitest, Jest, Supertest

---

## PHASE 1 — Make It Yours

---

### Task 1: Rebrand package.json files

**Files:**
- Modify: `package.json`
- Modify: `client/package.json`
- Modify: `server/package.json`

**Step 1: Update root `package.json`**

Change the following fields:
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "repository": "https://github.com/YOUR_USERNAME/YOUR_REPO.git",
  "description": "Your personal full-stack TypeScript web application starter"
}
```
Remove the `"heroku-postbuild"` script (no longer needed).

**Step 2: Update `client/package.json`**

Change `"name"` to match your project (e.g. `"your-project-name-client"`).

**Step 3: Update `server/package.json`**

Change `"name"` to match your project (e.g. `"your-project-name-server"`).

**Step 4: Commit**
```bash
git add package.json client/package.json server/package.json
git commit -m "chore: rebrand package.json files"
```

---

### Task 2: Rewrite README.md

**Files:**
- Modify: `README.md`

**Step 1: Rewrite README**

Replace the entire contents with a README that:
- Has your project name as the H1
- Describes what the project is (your personal full-stack TypeScript starter)
- Lists features (auth, RBAC, dark mode UI, tested)
- Has Setup, Usage (`yarn dev`, `yarn test`), and Deployment sections
- No mention of Hack4Impact

**Step 2: Commit**
```bash
git add README.md
git commit -m "docs: rewrite README for personal ownership"
```

---

### Task 3: Remove unused directories and dead code

**Files:**
- Delete: `infrastructure/modules (unused)/` directory
- Modify: `Procfile` — update app name if present

**Step 1: Delete unused infrastructure modules**
```bash
rm -rf "infrastructure/modules (unused)"
```

**Step 2: Search for any remaining Hack4Impact references**
```bash
rg -r "hack4impact" --ignore-case .
```
Fix any hits by replacing with your name/brand.

**Step 3: Commit**
```bash
git add -A
git commit -m "chore: remove unused files and Hack4Impact references"
```

---

### Task 4: Modernize Node target and TypeScript config

**Files:**
- Modify: `tsconfig.json`
- Modify: `server/tsconfig.json`
- Modify: `client/tsconfig.json`

**Step 1: Update root `tsconfig.json`**

Set:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

**Step 2: Update `server/tsconfig.json`**

Ensure it extends the root and sets `"outDir": "dist"`, `"rootDir": "."`.

**Step 3: Update `client/tsconfig.json`**

Set `"target": "ES2022"`, `"lib": ["ES2022", "DOM", "DOM.Iterable"]`.

**Step 4: Run the TypeScript compiler to check for errors**
```bash
cd server && npx tsc --noEmit
```
Fix any type errors that surface.

**Step 5: Commit**
```bash
git add tsconfig.json server/tsconfig.json client/tsconfig.json
git commit -m "chore: update TypeScript targets to ES2022/Node20"
```

---

### Task 5: Migrate client from Create React App to Vite

**Files:**
- Modify: `client/package.json`
- Create: `client/vite.config.ts`
- Create: `client/index.html`
- Delete: `client/src/react-app-env.d.ts`
- Delete: `client/src/reportWebVitals.ts`
- Delete: `client/src/setupTests.ts`
- Modify: `client/src/index.tsx`

**Step 1: Install Vite and remove CRA**

```bash
cd client
yarn remove react-scripts
yarn add --dev vite @vitejs/plugin-react vitest @testing-library/react @testing-library/jest-dom jsdom
```

Update scripts in `client/package.json`:
```json
{
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  }
}
```

**Step 2: Create `client/vite.config.ts`**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

**Step 3: Create `client/index.html`**

Vite requires an `index.html` at the project root (not in `public/`):
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your App Name</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

**Step 4: Create `client/src/setupTests.ts`**

```typescript
import '@testing-library/jest-dom';
```

**Step 5: Delete CRA-specific files**
```bash
rm client/src/react-app-env.d.ts client/src/reportWebVitals.ts
```

**Step 6: Update `client/src/index.tsx`**

Remove the `reportWebVitals` import and call. File should just be:
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Step 7: Verify it starts**
```bash
cd client && yarn start
```
Expected: Vite dev server running at http://localhost:3000

**Step 8: Commit**
```bash
git add -A
git commit -m "chore: migrate client from Create React App to Vite"
```

---

### Task 6: Upgrade all dependencies to current versions

**Files:**
- Modify: `package.json`
- Modify: `client/package.json`
- Modify: `server/package.json`

**Step 1: Use npm-check-updates to find outdated packages**
```bash
npx npm-check-updates -u
cd client && npx npm-check-updates -u
cd ../server && npx npm-check-updates -u
```

**Step 2: Re-install everything from root**
```bash
cd .. && yarn install
```

**Step 3: Run the app and tests to confirm nothing broke**
```bash
yarn dev   # check both client and server start
yarn test  # check server tests pass
```

Fix any breaking changes from upgrades.

**Step 4: Commit**
```bash
git add package.json client/package.json server/package.json yarn.lock
git commit -m "chore: upgrade all dependencies to latest versions"
```

---

## PHASE 2A — UI Overhaul

---

### Task 7: Set up dark/light theme system with MUI

**Files:**
- Create: `client/src/theme/theme.ts`
- Create: `client/src/theme/ThemeContext.tsx`
- Modify: `client/src/App.tsx`

**Step 1: Create `client/src/theme/theme.ts`**

```typescript
import { createTheme, Theme } from '@mui/material/styles';

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0a0a0a', paper: '#111111' },
    primary: { main: '#3b82f6' },
    secondary: { main: '#8b5cf6' },
    text: { primary: '#ffffff', secondary: '#a1a1aa' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
});

export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#fafafa', paper: '#ffffff' },
    primary: { main: '#3b82f6' },
    secondary: { main: '#8b5cf6' },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 8 },
});
```

**Step 2: Create `client/src/theme/ThemeContext.tsx`**

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme';

type ColorMode = 'dark' | 'light';

interface ThemeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colorMode: 'dark',
  toggleColorMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    return (localStorage.getItem('colorMode') as ColorMode) ?? 'dark';
  });

  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  const toggleColorMode = () =>
    setColorMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
      <MuiThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
```

**Step 3: Wrap `App.tsx` with the provider**

In `client/src/App.tsx`, wrap the entire app:
```typescript
import { AppThemeProvider } from './theme/ThemeContext';
// ...
return (
  <AppThemeProvider>
    {/* existing router/routes */}
  </AppThemeProvider>
);
```

**Step 4: Verify dark mode applies**

Run `yarn dev`, open the browser — background should be near-black by default.

**Step 5: Commit**
```bash
git add client/src/theme/ client/src/App.tsx
git commit -m "feat: add dark/light theme system with MUI and localStorage persistence"
```

---

### Task 8: Add Inter font and theme toggle button

**Files:**
- Modify: `client/index.html`
- Create: `client/src/components/ThemeToggle.tsx`

**Step 1: Add Inter font via Google Fonts in `client/index.html`**

Add inside `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Step 2: Create `client/src/components/ThemeToggle.tsx`**

```typescript
import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from '../theme/ThemeContext';

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useThemeContext();
  return (
    <Tooltip title={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton onClick={toggleColorMode} color="inherit">
        {colorMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
```

**Step 3: Install MUI icons if not already installed**
```bash
cd client && yarn add @mui/icons-material
```

**Step 4: Commit**
```bash
git add client/index.html client/src/components/ThemeToggle.tsx
git commit -m "feat: add Inter font and ThemeToggle component"
```

---

### Task 9: Redesign auth pages (Login, Register)

**Files:**
- Modify: `client/src/Authentication/LoginPage.tsx`
- Modify: `client/src/Authentication/RegisterPage.tsx`

**Step 1: Install Framer Motion**
```bash
cd client && yarn add framer-motion
```

**Step 2: Redesign `LoginPage.tsx`**

Replace the existing layout with a two-column design:
- Left panel (hidden on mobile): dark gradient with brand name, tagline, decorative element
- Right panel: centered form card with glassmorphism effect

```typescript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/ThemeToggle';
import { loginUser } from './api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await loginUser(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/home');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Brand panel */}
      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' },
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0a0a0a 100%)',
        p: 6,
      }}>
        <Typography variant="h3" fontWeight={700} color="white">Your App</Typography>
        <Typography variant="body1" color="grey.400" mt={2} textAlign="center">
          Your personal full-stack starter — ready to build.
        </Typography>
      </Box>
      {/* Form panel */}
      <Box sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', p: 4,
        position: 'relative',
      }}>
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ThemeToggle />
        </Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <Typography variant="h4" fontWeight={700} mb={1}>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Sign in to your account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
            <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 1, py: 1.5, fontWeight: 600 }}>
              Sign in
            </Button>
          </Box>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link to="/reset-password" style={{ color: 'inherit', fontSize: 14 }}>Forgot password?</Link>
            <Typography variant="body2" color="text.secondary" mt={1}>
              No account? <Link to="/register" style={{ color: '#3b82f6' }}>Create one</Link>
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
```

**Step 3: Apply the same two-column layout to `RegisterPage.tsx`**

Use the same structure as LoginPage, with fields for first name, last name, email, password, confirm password.

**Step 4: Verify visually**

Run `yarn dev`, navigate to `/login` and `/register`. Confirm dark background, two-column layout, animation on load.

**Step 5: Commit**
```bash
git add client/src/Authentication/
git commit -m "feat: redesign auth pages with bold dark-first split layout"
```

---

### Task 10: Redesign Admin Dashboard with sidebar layout

**Files:**
- Create: `client/src/components/Sidebar.tsx`
- Create: `client/src/components/AppLayout.tsx`
- Modify: `client/src/AdminDashboard/AdminDashboardPage.tsx`

**Step 1: Create `client/src/components/Sidebar.tsx`**

```typescript
import React from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Admin', path: '/admin' },
];

export function Sidebar() {
  return (
    <Box sx={{
      width: 220, flexShrink: 0,
      borderRight: '1px solid', borderColor: 'divider',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
    }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700}>Your App</Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
```

**Step 2: Create `client/src/components/AppLayout.tsx`**

```typescript
import React from 'react';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}
```

**Step 3: Wrap `AdminDashboardPage.tsx` with `AppLayout`**

```typescript
import { AppLayout } from '../components/AppLayout';
// ...
return (
  <AppLayout>
    {/* existing dashboard content */}
  </AppLayout>
);
```

**Step 4: Commit**
```bash
git add client/src/components/ client/src/AdminDashboard/
git commit -m "feat: add sidebar layout and wrap admin dashboard"
```

---

## PHASE 2B — RBAC

---

### Task 11: Update User model from boolean admin to roles array

**Files:**
- Modify: `server/src/models/user.model.ts`
- Modify: `server/src/controllers/auth.controller.ts`
- Modify: `server/src/controllers/admin.controller.ts`
- Modify: `server/src/controllers/admin.middleware.ts`
- Modify: `server/src/controllers/auth.middleware.ts`

**Step 1: Read current `user.model.ts`**

Open and inspect the current User schema. Note where `admin: boolean` is defined.

**Step 2: Update the User schema**

Replace:
```typescript
admin: { type: Boolean, default: false }
```
With:
```typescript
roles: { type: [String], default: ['user'] }
```

Add a helper method:
```typescript
userSchema.methods.hasRole = function(role: string): boolean {
  return this.roles.includes(role);
};
```

**Step 3: Update `admin.middleware.ts`**

Replace the `isAdmin` check (which was `req.user.admin === true`) with:
```typescript
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.sendStatus(401);
  const user = req.user as IUser;
  if (!user.roles.includes('admin') && !user.roles.includes('superadmin')) {
    return res.sendStatus(403);
  }
  return next();
};

export const hasRole = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.sendStatus(401);
    const user = req.user as IUser;
    const hasAny = roles.some((r) => user.roles.includes(r));
    if (!hasAny) return res.sendStatus(403);
    return next();
  };
```

**Step 4: Update admin controller's promote function**

Change the promote endpoint to accept a `role` in the request body instead of toggling a boolean:
```typescript
// PUT /api/admin/promote/:userId
export const promoteUser = async (req: Request, res: Response) => {
  const { role } = req.body; // e.g. 'admin', 'moderator'
  const validRoles = ['user', 'moderator', 'admin', 'superadmin'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });
  await User.findByIdAndUpdate(req.params.userId, { roles: [role] });
  return res.sendStatus(200);
};
```

**Step 5: Run server tests to see what breaks**
```bash
cd server && yarn test
```
Note all failures — they'll be fixed in Task 13 (test updates).

**Step 6: Commit**
```bash
git add server/src/models/user.model.ts server/src/controllers/
git commit -m "feat: replace admin boolean with roles array on User model"
```

---

### Task 12: Update frontend for RBAC

**Files:**
- Create: `client/src/util/useHasRole.ts`
- Modify: `client/src/AdminDashboard/PromoteUserButton.tsx`
- Modify: `client/src/AdminDashboard/UserTable.tsx`
- Modify: `client/src/AdminDashboard/api.tsx`

**Step 1: Create `client/src/util/useHasRole.ts`**

```typescript
import { useContext } from 'react';
import UserContext from './UserContext'; // existing context

export function useHasRole(...roles: string[]): boolean {
  const { user } = useContext(UserContext);
  if (!user) return false;
  return roles.some((r) => user.roles?.includes(r));
}
```

**Step 2: Update `PromoteUserButton.tsx`**

Replace the binary promote button with a role selector dropdown:
```typescript
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Render a Select with options: user, moderator, admin
// On change, call the updated promote API with the selected role
```

**Step 3: Update `api.tsx`**

Update the `promoteUser` call to send `{ role }` in the body instead of toggling.

**Step 4: Commit**
```bash
git add client/src/util/useHasRole.ts client/src/AdminDashboard/
git commit -m "feat: update admin UI for role-based user management"
```

---

## PHASE 2C — Test Coverage

---

### Task 13: Expand backend tests — auth routes

**Files:**
- Modify: `server/src/routes/__tests__/`
- Look at existing test files to understand the pattern before writing new ones

**Step 1: Read the existing test files**

Open all files in `server/src/routes/__tests__/` to understand the in-memory MongoDB setup and Supertest usage.

**Step 2: Write failing tests for missing auth edge cases**

Add tests for:
- `POST /api/auth/register` — duplicate email returns 409
- `POST /api/auth/login` — wrong password returns 401
- `POST /api/auth/login` — unverified account returns 401
- `GET /api/auth/logout` — unauthenticated returns 401 (if protected)
- `POST /api/auth/reset-password` — invalid token returns 400
- `POST /api/auth/reset-password` — expired token returns 400

For each:
```typescript
it('returns 409 for duplicate email', async () => {
  await createUser({ email: 'test@test.com' }); // helper
  const res = await request(app).post('/api/auth/register').send({
    email: 'test@test.com', password: 'Password1!',
    firstName: 'Test', lastName: 'User',
  });
  expect(res.status).toBe(409);
});
```

**Step 3: Run to confirm they fail**
```bash
cd server && yarn test
```

**Step 4: Fix any implementation gaps revealed by the tests**

If the controller doesn't return the right status code, update it.

**Step 5: Run again to confirm all pass**
```bash
cd server && yarn test
```

**Step 6: Commit**
```bash
git add server/src/routes/__tests__/
git commit -m "test: expand auth route test coverage with edge cases"
```

---

### Task 14: Expand backend tests — admin routes with role guards

**Files:**
- Modify or Create: `server/src/routes/__tests__/admin.test.ts`

**Step 1: Write tests for admin routes**

Test matrix — for each endpoint, test with: unauthenticated, `user` role, `moderator` role, `admin` role:

```typescript
describe('GET /api/admin/users', () => {
  it('returns 401 when not logged in', async () => { ... });
  it('returns 403 when logged in as user role', async () => { ... });
  it('returns 403 when logged in as moderator role', async () => { ... });
  it('returns 200 when logged in as admin role', async () => { ... });
});

describe('DELETE /api/admin/users/:id', () => {
  it('returns 403 for moderator role', async () => { ... });
  it('returns 200 for admin role', async () => { ... });
});

describe('PUT /api/admin/promote/:id', () => {
  it('returns 400 for invalid role string', async () => { ... });
  it('returns 200 for valid role, admin authenticated', async () => { ... });
});
```

**Step 2: Run and fix until all pass**
```bash
cd server && yarn test --coverage
```
Target: 80%+ coverage shown in the coverage report.

**Step 3: Commit**
```bash
git add server/src/routes/__tests__/
git commit -m "test: add admin route tests covering role guards"
```

---

### Task 15: Add frontend unit tests with Vitest + RTL

**Files:**
- Create: `client/src/Authentication/__tests__/LoginPage.test.tsx`
- Create: `client/src/AdminDashboard/__tests__/AdminDashboardPage.test.tsx`

**Step 1: Create `LoginPage.test.tsx`**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import * as api from '../api';

vi.mock('../api');

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows error message on failed login', async () => {
    vi.mocked(api.loginUser).mockResolvedValue({ error: 'Invalid credentials' });
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials'));
  });
});
```

**Step 2: Run frontend tests**
```bash
cd client && yarn test
```
Expected: both tests pass.

**Step 3: Create `AdminDashboardPage.test.tsx`**

Test that:
- The user table renders with mocked user data
- Delete button calls the delete API
- Role dropdown calls the promote API with correct role

**Step 4: Run all tests**
```bash
cd client && yarn test
```

**Step 5: Commit**
```bash
git add client/src/Authentication/__tests__/ client/src/AdminDashboard/__tests__/
git commit -m "test: add frontend unit tests with Vitest and RTL"
```

---

### Task 16: Add Playwright end-to-end tests

**Files:**
- Create: `e2e/auth.spec.ts`
- Create: `e2e/admin.spec.ts`
- Create: `playwright.config.ts`

**Step 1: Install Playwright**
```bash
yarn add --dev @playwright/test
npx playwright install chromium
```

**Step 2: Create `playwright.config.ts` at project root**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 3: Create `e2e/auth.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test('login page renders', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test('shows error on wrong credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('nobody@test.com');
  await page.getByLabel(/password/i).fill('wrongpassword');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByRole('alert')).toBeVisible();
});
```

**Step 4: Create `e2e/admin.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test('redirects unauthenticated users away from /admin', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).not.toHaveURL('/admin');
});
```

**Step 5: Add E2E script to root `package.json`**

```json
"e2e": "playwright test"
```

**Step 6: Run E2E tests**
```bash
yarn e2e
```

**Step 7: Commit**
```bash
git add e2e/ playwright.config.ts package.json
git commit -m "test: add Playwright E2E tests for auth and admin flows"
```

---

## Final Checklist

Run this before calling the project done:

```bash
# All server tests pass with 80%+ coverage
cd server && yarn test --coverage

# All client unit tests pass
cd client && yarn test

# E2E tests pass
yarn e2e

# No lint errors
yarn lint

# App builds cleanly
cd client && yarn build
cd ../server && npx tsc --noEmit

# Zero references to Hack4Impact
rg -r "hack4impact" --ignore-case .
```
