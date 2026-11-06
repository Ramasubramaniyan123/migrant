# Frontend

React 18 + TypeScript single-page application for the Migrant Community Platform, built with Vite and styled with Tailwind CSS.

## Prerequisites

- **Node.js 18+** and npm

## Install and run

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on **port 5173** at `http://localhost:5173`.

Other scripts:

```bash
npm run build     # type-check and produce a production build
npm run preview   # preview the production build
npm run lint      # run ESLint
```

The Vite dev server proxies `/api` requests to the Spring Boot backend at `http://localhost:8080`.

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL of the backend REST API (default `http://localhost:8080/api`). |
| `VITE_USE_MOCK_DATA` | When `true`, services read from the local mock JSON in `src/data/` instead of calling the API. |

## Folder structure

```
frontend/src
├── context/        # React context providers (Auth, User, Connection, Notification)
├── data/           # mock JSON data used when VITE_USE_MOCK_DATA=true
├── hooks/          # reusable React hooks (useAuth, useDiscovery, ...)
├── routes/         # route configuration and guards (AppRoutes, ProtectedRoute, AdminRoute)
├── services/       # API/mock data access layer (authService, discoveryService, ...)
├── styles/         # global CSS, design variables and animations
├── types/          # shared TypeScript type definitions
├── utils/          # helpers, formatters, validators and distance calculator
├── App.tsx         # root component wiring providers and routes
├── main.tsx        # application entry point
└── vite-env.d.ts   # Vite environment typings
```

> Note: `routes/AppRoutes.tsx` already imports screen components from a `pages/`
> directory and shared layout components from a `components/` directory. Those two
> directories are referenced by the routing but are not yet present in the repository.

## Demo credentials

| Role | Email | Password |
|------|-------|----------|
| User | `aarav.sharma@example.com` | `password123` |
| Admin | `admin@migrant.app` | `password123` |

## Screens

- **Landing** — public marketing page
- **Auth** — login, register and forgot-password
- **Onboarding** — first-run setup for new users
- **Dashboard** — overview of activity
- **Discover** — find nearby people to connect with
- **Hometown Match** — connect with people from your hometown
- **Communities** — browse language communities and a community detail view
- **Connections** — manage connection requests and connections
- **Messages** — conversations list and chat view
- **Profile** — own profile, edit profile and other users' profiles
- **Notifications** — activity notifications
- **Settings** — account and app settings
- **Admin** — admin dashboard, user management, report management and community management
