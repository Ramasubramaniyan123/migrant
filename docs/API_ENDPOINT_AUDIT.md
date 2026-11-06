# API Endpoint Audit

**Audit date:** 2026-11-06  
**Scope:** Spring MVC mappings, global servlet context path, endpoint security, request validation, existing API tests, and documented/frontend contracts.

## Findings

### API-01 — High — User route prefixes combine with a second `/api` context path

- **Module:** Routing / user API
- **Description:** `application.yml` sets servlet context path `/api`; user controllers also use mappings such as `/api/auth`, `/api/user`, and `/api/location`. The externally callable routes therefore start `/api/api/...` (for example `/api/api/auth/login`), whereas the admin mappings `/v1/admin/...` become `/api/v1/admin/...`.
- **Steps to reproduce:** Compare `server.servlet.context-path` with the controller-level `@RequestMapping` values. The user API overview itself notes the doubled prefix.
- **Expected:** One canonical versioned prefix, consistently used by backend, API documentation, Vite proxy, and both clients.
- **Actual:** User and admin APIs use different conventions; documented and likely client paths can diverge.
- **Recommended solution:** Choose a single route scheme (for example context `/api` plus controller `/v1/...`) and update contracts and clients together.
- **Status:** Open.

### API-02 — High — Most user endpoints are unauthenticated and synthetic

- **Module:** User API/security
- **Description:** `SecurityConfig` ends with `anyRequest().permitAll()`. User-facing mappings have no independent authentication requirements. This includes `/api/api/user/me`, `/api/api/profile/me`, `/api/api/location/nearby`, messaging, reports, and other feature routes.
- **Steps to reproduce:** Inspect the security chain and the controller mappings; no bearer-token guard is applied to those paths.
- **Expected:** Only explicitly public routes (such as registration/login/language reference data) are public; protected routes require an authenticated principal and resource ownership checks.
- **Actual:** Any caller can reach every non-admin route; several return fixed demo content today.
- **Recommended solution:** Configure explicit public routes and secure all other user resources with a real user token and object-level authorization.
- **Status:** Open.

### API-03 — High — Required API workflows are missing

- **Module:** User API
- **Description:** The API has a small subset of listing/create routes. Missing endpoints include registration, logout, password reset, profile updates, language preferences, hometown matching, connection accept/reject/cancel, community join/leave, comments, event registration, block/unblock, user report submission, and privacy settings.
- **Steps to reproduce:** Inventory controller mappings under `backend/src/main/java/com/migrantcommunity`; only one user auth controller and a limited set of feature controllers are present.
- **Expected:** The user workflows described in the platform prompt are exposed and independently tested.
- **Actual:** Several feature folders contain only DTOs/services; some have no controller at all.
- **Recommended solution:** Agree versioned API contracts with both frontends and implement missing use cases incrementally.
- **Status:** Open.

### API-04 — Medium — Success contract and validation differ from documentation

- **Module:** API contract
- **Description:** `docs/api-overview.md` says every response is wrapped as `ApiResponse<T>`. Controllers return raw records, lists, and maps. Most request bodies are `Map<String,String>` or unvalidated objects; only admin login uses `@Valid`.
- **Steps to reproduce:** Compare `docs/api-overview.md` to controller return types and request annotations.
- **Expected:** Documented, validated request/response structures with consistent errors and status codes.
- **Actual:** Direct success payloads, generic input maps, sparse validation, and no generated OpenAPI contract.
- **Recommended solution:** Add DTOs and bean validation, publish OpenAPI, and test the serialized response shapes and error codes.
- **Status:** Open.

## Current endpoint inventory

All paths below are controller mappings; prepend the configured `/api` context path to obtain the externally served URL.

| Area | Controller mappings | Current implementation / access |
|---|---|---|
| User auth | `GET /api/auth/me`, `POST /api/auth/login` | Public; synthetic placeholder session |
| User/profile | `GET /api/user/me`, `GET /api/profile/me` | Public due catch-all; fixed data |
| Languages | `GET /api/language/list` | Public; sample list |
| Location/discovery | `GET /api/location/nearby`, `GET /api/discovery/suggestions` | Public due catch-all; fixed results |
| Connections | `GET /api/connection/list`, `POST /api/connection/request` | Public due catch-all; synthetic |
| Communities | `GET /api/community/list`, `POST /api/community/create` | Public due catch-all; synthetic |
| Posts | `GET /api/post/feed`, `POST /api/post/create` | Public due catch-all; synthetic |
| Messaging | `GET /api/messaging/conversations`, `POST /api/messaging/send` | Public due catch-all; synthetic |
| Notifications | `GET /api/notification/list` | Public due catch-all; sample data |
| User moderation | `GET /api/moderation/reports` | Public due catch-all; sample reports |
| Legacy admin | `GET /api/admin/stats` | Requires authentication, but response is sample statistics |
| Admin auth | `/v1/admin/auth/login`, `/logout`, `/forgot-password`, `/reset-password` | Login/forgot/reset are public; logout requires JWT; reset is not implemented |
| Admin dashboard | `GET /v1/admin/dashboard/overview`, `/statistics` | Authenticated; synthetic |
| Admin users | `/v1/admin/users` list/detail/activity/status/verify actions | Authenticated; in-memory |
| Admin communities | `/v1/admin/communities` list/detail/create/update/active/delete/members/stats | Authenticated; in-memory |
| Admin languages | `/v1/admin/languages` list/create/update/active/stats | Authenticated; in-memory |
| Admin locations | `/v1/admin/locations/cities`, `/localities`, `/stats` and locality mutations | Authenticated; in-memory |
| Admin moderation | `/v1/admin/moderation/reports`, details, resolve/dismiss/history | Moderator/admin route gate; in-memory |
| Admin posts/events | `/v1/admin/posts/**`, `/v1/admin/events/**` | Authenticated; in-memory |
| Admin analytics/audit | `/v1/admin/analytics/**`, `/v1/admin/audit-logs` | Role-gated; synthetic/in-memory |
| Admin settings/notifications/connections | `/v1/admin/settings/**`, `/notifications/**`, `/connections/**` | Mostly authenticated only; in-memory |
| Admin management | `/v1/admin/administrators/**` | `SUPER_ADMIN`; in-memory |

## Test evidence and limits

- Maven exercised only admin auth/access routes through MockMvc; see [test execution report](./TEST_EXECUTION_REPORT.md).
- No independent tests were found for the listed user endpoints, request validation, API response schemas, pagination/sorting, or object ownership.
- Do not treat this inventory as a tested endpoint contract: there is no OpenAPI dependency/configuration, and the frontends currently use mock services.
