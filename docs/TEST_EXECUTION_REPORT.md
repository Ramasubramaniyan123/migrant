# Test Execution Report

**Audit date:** 2026-11-06  
**Commands executed:** `mvn -f backend/pom.xml test`; `npm --prefix frontend run build`; `npm --prefix admin-portal run build`.

## Results

| Suite | Result | Counts / details |
|---|---|---|
| Backend Maven tests | **PASS** | 10 run, 0 failures, 0 errors, 0 skipped |
| `AdminAuthControllerTest` | **PASS** | 6 tests: login, unauthenticated denial, valid token, analyst denied from administrator management, logout revocation, invalid credentials |
| `AdminAuthServiceTest` | **PASS** | 4 tests: login success, wrong password, unknown email, duplicate admin |
| User-facing API tests | **Not present** | No user auth or business-module controller tests |
| Database integration tests | **Not present** | No Testcontainers dependency/configuration; datasource/JPA/Flyway excluded globally |
| API/contract tests beyond admin auth | **Not present** | No REST Assured suite or response-contract coverage |
| Security/performance tests | **Not present** | No load test, security suite, coverage plugin, or results |
| User frontend build | **PASS** | TypeScript + Vite production build completed |
| Admin portal build | **FAIL** | `tsc -b` reports `tsconfig.json(22,27): error TS5103: Invalid value for '--ignoreDeprecations'.` Installed TypeScript is 5.9.3; config uses `"ignoreDeprecations": "6.0"`. |

## Coverage and skipped tests

- The backend test source contains two test classes. The test output reported no skipped or ignored tests.
- No JaCoCo plugin/configuration or coverage threshold exists in `backend/pom.xml`; coverage was not measured.
- The passing Maven suite starts a Spring context with database auto-configuration disabled. It does not establish that PostgreSQL, migrations, or any business module works.
- All backend test evidence is limited to admin authentication and a small set of role/login behaviors.

## Conclusions

The current passing Maven result is not a backend readiness signal. Add service and controller tests for every module, isolated PostgreSQL migration/repository tests, negative authorization/ownership cases, business-rule cases, and coverage instrumentation. Resolve the admin portal TypeScript configuration error before claiming both frontends build.
