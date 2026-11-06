# Security Audit

**Audit date:** 2026-11-06  
**Scope:** Static review of authentication, authorization, location privacy, request validation, configuration, and security-related tests. This was not an external penetration test; no third-party targets or production data were used.

## Result

**Security posture: NOT READY for real users or production.**

## Findings

### SEC-01 — Critical — User authentication is a placeholder and all non-admin routes are permitted

- **Module:** User auth/API authorization
- **Description:** `AuthService.login` returns a fixed `placeholder-token` for arbitrary credentials. `currentSession` returns a fixed user. `SecurityConfig` permits every request except the explicitly matched admin routes. User controllers do not resolve an authenticated principal.
- **Steps to reproduce:** Send any credentials to the user login route; inspect the returned implementation. Call a non-admin route without an Authorization header; the security chain's final matcher is `permitAll()`.
- **Expected:** Verify stored password hashes, issue a real token, reject invalid credentials, and require authentication/ownership for private endpoints.
- **Actual:** Credentials are not checked; user endpoints are public and responses are sample data.
- **Recommended solution:** Implement user identity/authentication and explicit authorization rules before connecting real data.
- **Status:** Open.

### SEC-02 — High — Location endpoint returns coordinate-level data without authentication

- **Module:** Location privacy
- **Description:** `/api/location/nearby` resolves to an unauthenticated endpoint and returns literal latitude `19.0760` / longitude `72.8777` with `accuracyKm=5.0`. Four-decimal coordinates are much more precise than a five-kilometre accuracy label, and the API cannot currently associate the result with a principal or privacy setting.
- **Steps to reproduce:** Inspect `LocationController`, `LocationService`, and the catch-all public authorization rule. The service constructs the response with fixed coordinates.
- **Expected:** Authenticate the user; never return exact residential coordinates; apply consent/privacy controls and intentional coarsening.
- **Actual:** The endpoint returns raw coordinate values to any caller (currently sample values).
- **Recommended solution:** Remove coordinate fields from public responses or produce coarsened, policy-checked location results server-side.
- **Status:** Open.

### SEC-03 — High — Admin permissions are incomplete for management endpoints

- **Module:** Admin RBAC
- **Description:** Role rules explicitly restrict administrator management, settings, audit, moderation, and analytics. Other `/v1/admin/**` routes fall through to `.authenticated()`, so every admin role—including `SUPPORT` and `ANALYST`—can invoke mutations on user, community, language, location, event, post, notification, and connection endpoints.
- **Steps to reproduce:** A valid token with a low-privilege admin role satisfies the general admin route rule for an unlisted mutation route; no method-level restriction is present on most controllers.
- **Expected:** Each route/action is assigned least-privilege roles; read-only/support roles cannot mutate platform state.
- **Actual:** Authentication alone grants access to most admin functions.
- **Recommended solution:** Define route/method-level authorization for every admin operation and test each role against positive and negative cases.
- **Status:** Open.

### SEC-04 — High — JWT revocation and administrator status/role changes are not durable or rechecked

- **Module:** Admin sessions
- **Description:** Revoked token IDs are stored in a process-local set. The filter trusts role claims embedded in the token and does not reload the administrator or check its current active status. With a stable configured signing secret (as in production), a revoked token may work again after restart; a suspended/demoted admin's token retains claims until expiry.
- **Steps to reproduce:** With a stable test signing secret, issue a token, revoke it, restart the service, then use it; or change the admin role/status while retaining an issued token. The filter validates signature/expiry/revocation set only.
- **Expected:** Durable revocation and immediate/defined enforcement of account and role changes.
- **Actual:** Revocation is lost on restart; current admin state is not checked at request time.
- **Recommended solution:** Persist session/refresh-token state and revoke sessions on status/role changes, or use appropriately short-lived tokens with a durable revocation/version check.
- **Status:** Open.

### SEC-05 — High — Refresh tokens and password-reset flows are missing

- **Module:** Authentication lifecycle
- **Description:** User registration, logout, refresh-token rotation/revocation, password reset, and suspended-account handling are not implemented. Admin reset endpoints call methods that throw `UnsupportedOperationException` and resolve to HTTP 501.
- **Steps to reproduce:** Inspect `AuthController` mappings and invoke admin forgot/reset routes; see `AdminAuthService` implementation and exception handler.
- **Expected:** Secure lifecycle flows with expiring, single-use reset/refresh tokens and safe account-state checks.
- **Actual:** No user lifecycle routes; admin reset explicitly unimplemented.
- **Recommended solution:** Implement token storage/rotation, reset delivery, account status checks, and appropriate rate limiting.
- **Status:** Open.

### SEC-06 — High — Moderation reports are exposed through a public user route

- **Module:** Report confidentiality
- **Description:** `GET /api/moderation/reports` returns report records, and the current catch-all rule permits it without authentication. Report details can reveal sensitive reporter/target information once connected to real records.
- **Steps to reproduce:** Inspect `ModerationController` mapping and `SecurityConfig` authorization. Current response is sample data.
- **Expected:** Restrict report access to authorized moderation roles; avoid exposing reporter identity unnecessarily.
- **Actual:** The route is public and the sample is returned.
- **Recommended solution:** Remove the public route or secure it with moderator/admin role checks and field-level privacy.
- **Status:** Open.

### SEC-07 — Medium — No explicit CORS, rate limiting, or sensitive endpoint abuse controls

- **Module:** API perimeter
- **Description:** No CORS configuration, rate limiting, or login/reset throttling implementation was found. The two Vite apps run on ports 5173/5174 and backend 8080; dev proxying does not define production CORS policy.
- **Steps to reproduce:** Inspect backend security/config packages and application config; no CORS or rate-limit implementation is present.
- **Expected:** Explicit allowed production origins and abuse controls on login, reset, registration, and broadcast endpoints.
- **Actual:** No project-specific policy is configured.
- **Recommended solution:** Add restrictive CORS and rate-limit policies at application/gateway layers; set request-size limits and HTTPS at deployment.
- **Status:** Open.

## Positive controls observed (limited)

- Admin passwords use BCrypt through a Spring `PasswordEncoder`.
- Admin login issues signed expiring JWTs and validates their signature/expiry.
- The production YAML requires a JWT secret and bootstrap credentials.
- Some role gates and MockMvc checks exist, but they do not cover the user API or all admin roles/actions.
