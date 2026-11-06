# Architecture

## System separation

The platform is split into three independently runnable pieces:

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Frontend | `frontend/` | React + TypeScript single-page app (Vite). Talks to the backend over REST and can also run against local mock JSON while the API is incomplete. |
| Backend | `backend/` | Spring Boot 3.2 / Java 21 REST API. Owns all business logic and, eventually, all database access. |
| Database | `database/` | PostgreSQL 15+ with the PostGIS extension. Schema and seed data are versioned as SQL. |

The frontend and backend are deployed and developed independently and communicate only through REST calls. The frontend never talks to the database directly.

## Backend package layout

The backend uses a **feature-based** package layout. Each feature owns its own layers rather than grouping all controllers, services and repositories together.

```
com.migrantcommunity
├── common/                  # cross-cutting building blocks
│   ├── response/            # ApiResponse<T> envelope
│   ├── exception/           # custom exceptions + global handler
│   ├── enums/               # shared enums (connection status, etc.)
│   ├── util/                # small stateless helpers (distance, ...)
│   └── validation/          # reusable validation patterns
├── auth/
├── user/
├── profile/
├── language/
├── location/
├── discovery/
├── connection/
├── community/
├── post/
├── messaging/
├── notification/
├── moderation/
└── admin/
```

Each feature package is split into layers:

```
<feature>/
├── controller/   # HTTP entry points, DTO in / DTO out
├── service/      # business logic
├── dto/          # request/response records
└── repository/   # data access (deferred for this prototype)
└── entity/       # JPA entities    (deferred for this prototype)
```

For this prototype only `controller/`, `service/` and `dto/` are scaffolded. The `repository/` and `entity/` layers are intentionally omitted so that nothing forces a live database connection at startup. Feature packages must not depend on one another directly — shared concerns belong in `common/`.

## Layered request flow

Requests are handled in one direction, with each layer having a single job:

```
HTTP request
   │
   ▼
controller   → maps the URL, validates input, returns a DTO
   │
   ▼
service      → business logic, orchestration, transactions
   │
   ▼
repository   → data access (deferred for this prototype)
   │
   ▼
database     → PostgreSQL / PostGIS
```

## Architectural rules

- **No database queries in controllers.** Controllers only translate HTTP to a service call and back.
- **Business logic lives in services.** Controllers stay thin.
- **DTOs instead of entities.** JPA entities are never returned directly from an endpoint; response records are defined in each feature's `dto/` package.
- **Mock data stays separate from production services.** The frontend keeps mock JSON under `frontend/src/data/` and switches to it via `VITE_USE_MOCK_DATA`, so mock data never leaks into the real API path.
- **Credentials come from environment variables.** Secrets such as the JWT key and database password are read from env vars (see `.env.example` files), never hard-coded.
- **Validation and centralised exception handling.** Requests are validated and failures surface as a consistent `ApiResponse` error payload via `GlobalExceptionHandler`.
- **PostgreSQL / PostGIS for geography.** Proximity and discovery queries rely on PostGIS rather than application-side scanning.
- **Location privacy and minimisation.** Only approximate locations (with an accuracy radius) are stored and shared; exact coordinates are never exposed to other users.

## Current prototype state

Database integration is deliberately deferred. The service layer returns clearly-commented placeholder data, the JPA `DataSource`/Hibernate/Flyway auto-configuration is excluded in `application.yml`, and the `repository/` and `entity/` layers are not yet created.
