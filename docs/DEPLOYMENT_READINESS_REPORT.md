# Deployment Readiness Report

**Audit date:** 2026-11-06  
**Result:** **NOT READY for staging or production.**

## Findings

### DEP-01 — High — No reproducible container or CI deployment definition

- **Module:** Build/deployment
- **Description:** No backend Dockerfile, Docker Compose file, or GitHub Actions workflow was found. There is no automated pipeline to test, package, migrate, and gate a deployment.
- **Steps to reproduce:** Inspect repository root and backend files; only Maven source/configuration and project documentation are present.
- **Expected:** Reproducible backend/database images and CI validation of compilation, tests, migrations, and packaging.
- **Actual:** No container/CI workflow is available to run or verify.
- **Recommended solution:** Add container and CI configuration after DB startup/migrations are implemented; validate a fresh deployment in an isolated environment.
- **Status:** Open.

### DEP-02 — Critical — Production database migration path is disabled

- **Module:** Runtime startup
- **Description:** Base configuration excludes datasource, JPA, and Flyway auto-configuration, including under `prod`; provided DB environment variables are therefore not enough to activate persistence/migrations.
- **Steps to reproduce:** Inspect global exclusions in `application.yml` and profile-specific `application-prod.yml`.
- **Expected:** Production startup connects to the configured PostgreSQL service and applies versioned schema migrations.
- **Actual:** The application is configured as a database-free prototype.
- **Recommended solution:** Enable DB wiring and demonstrate successful fresh-database migration before deployment.
- **Status:** Open.

### DEP-03 — Medium — Health endpoint and operational monitoring are minimal

- **Module:** Health/observability
- **Description:** Health handler returns a plain text string; no Actuator dependency, readiness/liveness checks, metrics, tracing, or error-monitoring integration was found. Because context path is `/api`, the route is `/api/health`, not `/health` as stated in the backend README.
- **Steps to reproduce:** Inspect `HealthController`, `application.yml`, Maven dependencies, and README.
- **Expected:** Liveness/readiness distinguish app from database health; monitoring exposes actionable operational signals.
- **Actual:** A static text response cannot report dependency readiness, and docs list the wrong external path.
- **Recommended solution:** Add appropriate health/metrics instrumentation and update route documentation once DB integration is enabled.
- **Status:** Open.

### DEP-04 — Medium — No tested backup, restore, or recovery procedure

- **Module:** Data operations
- **Description:** No backup automation or tested restore/recovery procedure is documented.
- **Steps to reproduce:** Search repository deployment/runbook documentation.
- **Expected:** Documented, tested backup cadence, retention, restore, and migration recovery procedures.
- **Actual:** No operational evidence exists.
- **Recommended solution:** Add database operations/runbooks and perform restore drills using isolated data.
- **Status:** Open.

## Configuration and build evidence

- Production YAML uses environment variables for DB/JWT/bootstrap values, but the DB settings are inactive because of the base exclusions.
- Development YAML contains static local database credentials and verbose SQL logging; those are not production credentials, but should remain local and be removed or clearly isolated from shared environments.
- Backend `mvn test` passed, but no packaged-image deployment or production-profile startup was verified.
- The user frontend build passed; the admin portal build failed with TS5103 (see [frontend integration report](./FRONTEND_INTEGRATION_REPORT.md)).
