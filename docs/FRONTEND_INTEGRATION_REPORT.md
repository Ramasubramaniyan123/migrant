# Frontend Integration Report

**Audit date:** 2026-11-06  
**Scope:** User frontend and admin portal API adapter configuration, current service behavior, route conventions, and production builds.

## Result

**Frontend integration: NOT READY.** Both frontends currently operate against local/mock data. A real request path exists in the user API helper, but the service modules do not use it as their data source. Admin services use `mockRequest`/`MockStore` exclusively.

## Findings

### INT-01 — High — Both frontends still use mock data rather than backend APIs

- **Module:** User and admin frontend integration
- **Description:** User services invoke `mockResponse` and local JSON/localStorage stores; `USE_MOCK_DATA` defaults to `true`. Admin services call `mockRequest` and localStorage `MockStore`; the configured admin `API_BASE_URL` is only a placeholder for later API calls.
- **Steps to reproduce:** Inspect the service imports and call sites in both frontends. `request()`/the configured admin URL are not used by feature services.
- **Expected:** Login, protected requests, and feature CRUD call the agreed backend API using bearer credentials and handle its response/error contract.
- **Actual:** User/admin state remains in browser memory/localStorage; backend operations do not occur.
- **Recommended solution:** Implement API-backed service implementations, token attachment/refresh handling, and end-to-end integration tests. Keep mock mode explicit and non-production.
- **Status:** Open.

### INT-02 — High — User API paths and admin portal API paths use different contracts

- **Module:** API routing
- **Description:** User API base URL defaults to `/api`, while controller mappings also begin `/api`; with the backend context path `/api`, actual routes are `/api/api/...`. Admin base URL defaults to `http://localhost:8080/api/v1`, matching `/v1/admin/...` plus the context path. These contracts are not consolidated or verified by actual client requests.
- **Steps to reproduce:** Compare `frontend/src/utils/constants.ts`, `application.yml`, controller mappings, and `admin-portal/src/services/api.ts`.
- **Expected:** Both portals use documented, versioned paths that route to working backend handlers.
- **Actual:** User endpoints have a doubled prefix; admin paths line up syntactically, but admin services do not call them.
- **Recommended solution:** Standardize controller mappings and bases, then test through the Vite proxy and deployed origin.
- **Status:** Open.

### INT-03 — High — Response schema documented for clients is not implemented consistently

- **Module:** API contract
- **Description:** `docs/api-overview.md` promises an `ApiResponse<T>` envelope for all responses. Controllers return raw DTOs/lists/maps, and frontend adapters have no integrated typed API contracts.
- **Steps to reproduce:** Compare the API overview with controller method return types and the frontend service interfaces.
- **Expected:** Generated/documented endpoint schemas match what the backend serializes.
- **Actual:** Contract mismatch has not been resolved or integration-tested.
- **Recommended solution:** Adopt DTO schemas and OpenAPI, generate/maintain typed client contracts, and add contract tests.
- **Status:** Open.

### INT-04 — Medium — Admin portal production build currently fails

- **Module:** Admin portal build
- **Description:** `npm --prefix admin-portal run build` fails at TypeScript compilation because `admin-portal/tsconfig.json` sets `ignoreDeprecations` to `6.0` while the installed TypeScript is 5.9.3.
- **Steps to reproduce:** Run the command above with the current installed dependencies.
- **Expected:** Both portal production builds complete.
- **Actual:** Admin build stops with TS5103; user frontend build passes.
- **Recommended solution:** Align the TypeScript compiler and configuration to a supported version, lock dependencies, and add both builds to CI.
- **Status:** Open.

## Execution evidence

- User frontend: production build passed.
- Admin portal: production build failed with TS5103.
- No end-to-end browser/API test was executed; neither UI currently consumes the backend feature APIs.
- The Vite development proxies forward `/api` to port 8080, but proxying does not correct a contract mismatch or replace production CORS configuration.
