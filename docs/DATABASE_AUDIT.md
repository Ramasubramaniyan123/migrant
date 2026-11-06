# Database Audit

**Audit date:** 2026-11-06  
**Scope:** Spring datasource/JPA/Flyway configuration, migration files, schema SQL, database docs, and test configuration. No database or schema was modified.

## Result

**Database readiness: NOT READY.** The repository contains PostgreSQL-oriented SQL drafts, but the application globally disables datasource, Hibernate/JPA, and Flyway auto-configuration. No application test connects to PostgreSQL or applies a migration. A fresh-database migration test was therefore not performed.

## Findings

### DB-01 — Critical — Database and migrations are disabled in every profile

- **Module:** Application configuration
- **Description:** `application.yml` excludes `DataSourceAutoConfiguration`, `HibernateJpaAutoConfiguration`, and `FlywayAutoConfiguration`. This base configuration applies to development, test, and production profiles.
- **Steps to reproduce:** Start the test context; the current tests succeed without a database because those auto-configurations are excluded. Review the global exclusions in `application.yml`.
- **Expected:** The service connects to PostgreSQL and Flyway applies migrations on a fresh database.
- **Actual:** No datasource, JPA, or Flyway wiring runs; SQL files are inert resources.
- **Recommended solution:** Remove the global exclusions when integration is implemented; provide test-profile isolation (for example a disposable Testcontainers PostgreSQL instance) and verify migrations against an empty database.
- **Status:** Open.

### DB-02 — High — Existing schema is incomplete for the declared product

- **Module:** Schema
- **Description:** The eight Flyway files cover users/profiles, languages, connections/blocks, communities, posts/comments, messaging, notifications, and reports. They do not define administrator accounts/roles/permissions, audit logs, events/participants, refresh/reset tokens, or a dedicated locations table. `database/README.md` lists `locations`, but the SQL schema stores location columns on `user_profiles` and has no `CREATE TABLE locations`.
- **Steps to reproduce:** Compare migrations V1–V8 and `database/schema.sql` with the required modules and the table list in `database/README.md`.
- **Expected:** A complete, versioned schema covering every persisted module and the configured auth/session lifecycle.
- **Actual:** Multiple promised feature tables are absent; schema docs disagree with SQL.
- **Recommended solution:** Model missing tables/constraints and update the database docs and Flyway migrations as a reviewed schema change.
- **Status:** Open.

### DB-03 — High — Fresh migration and rollback/recovery are unverified

- **Module:** Migrations/operations
- **Description:** No database integration tests or Testcontainers dependencies/configuration exist. No migration test result, backup/restore test, rollback/recovery runbook, or recovery verification is present.
- **Steps to reproduce:** Run `mvn test`: tests do not bootstrap a PostgreSQL test instance and global exclusions prevent migration execution.
- **Expected:** An empty test database is created, all migrations execute, constraints are verified, and recovery procedure is exercised.
- **Actual:** None of those database operations are executed by the application test suite.
- **Recommended solution:** Add isolated PostgreSQL integration tests, migration validation, and a tested backup/restore/recovery process before production.
- **Status:** Open.

### DB-04 — Medium — Spatial column/index design needs validation

- **Module:** Geospatial discovery
- **Description:** User profiles hold latitude/longitude as numeric columns, and the SQL creates a GIST index on `ST_MakePoint(current_location_lng, current_location_lat)`. No location query uses that index; there is no spatial entity or Hibernate Spatial dependency. Location output currently returns literal coordinates.
- **Steps to reproduce:** Inspect V1 and `DiscoveryService`/`LocationService`; there is no PostGIS query implementation.
- **Expected:** A tested spatial representation and indexed distance query that returns intentionally coarsened results only.
- **Actual:** PostGIS extension/index are SQL-only; no runtime usage or performance test exists.
- **Recommended solution:** Choose and validate a geography/geometry storage/query approach, ensure SRID and index-compatible expressions, and test privacy and query plans with PostGIS.
- **Status:** Open.

## Observed schema coverage

The current migrations define 15 tables: `users`, `user_profiles`, `languages`, `user_languages`, `connections`, `blocks`, `communities`, `community_members`, `posts`, `comments`, `conversations`, `conversation_members`, `messages`, `notifications`, and `reports`. They include some foreign keys, uniqueness constraints, and indexes, but not the complete application domain.

The connection uniqueness constraint is directional (`UNIQUE(requester_id, receiver_id)`) and has no check preventing self-connections; it does not prevent a reverse-direction duplicate. These business rules therefore need service enforcement and/or suitable database constraints before persistence is enabled.

The migrations do **not** declare reverse/undo migrations. Flyway does not make production rollback safe by itself; use forward corrective migrations and documented backup/restore procedures.

## Environment notes

- Development config includes a static local database username/password pair and verbose SQL logging; the datasource remains disabled by the global exclusions.
- Production config requires `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, and bootstrap admin variables, but its database values are not currently consumed by an active datasource.
- SQL in `database/schema.sql` is a separate manual setup path from Flyway; no automated parity check compares it to V1–V8.
