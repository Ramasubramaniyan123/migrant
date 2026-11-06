# Backend

Spring Boot 3.2 REST API for the Migrant Community Platform, written in Java 21 and built with Maven.

## Prerequisites

- **Java 21** (`java -version` should report 21)
- **Maven 3.8+** (`mvn -version`)

No database is required to run the prototype (see below).

## Running

```bash
cd backend
mvn spring-boot:run
```

The API starts on **port 8080**. A health check is available at `GET /health`.

To build a runnable jar instead:

```bash
mvn -f backend/pom.xml clean package
java -jar backend/target/migrant-community-backend-1.0.0.jar
```

## Configuration

Application configuration lives under `src/main/resources/`:

| File | Purpose |
|------|---------|
| `application.yml` | Base configuration: application name, active profile (`dev`), server port `8080`, servlet context path `/api`, JWT settings and logging. |
| `application-dev.yml` | Development profile: local datasource and verbose logging. |
| `application-prod.yml` | Production profile: datasource read from `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` environment variables. |

Datasource credentials are supplied through environment variables in production. See `backend/.env.example` for the expected variable names.

> **Routing note:** `application.yml` sets a servlet context path of `/api`, and each
> feature controller additionally declares an `/api/<feature>` mapping. The effective
> externally callable path is therefore `/api/api/<feature>/...`. This context path is
> part of the pre-existing configuration and has been left untouched.

## Admin authentication

The admin API under `/v1/admin/**` requires a signed bearer token. Admin passwords
are BCrypt-hashed, and the initial `SUPER_ADMIN` is created only when both
`ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` are configured. The password
must be at least 12 characters. No default administrator credentials are provided.

Set `JWT_SECRET` to a random value of at least 32 bytes in production. In development,
an ephemeral signing key is generated when it is omitted, so issued tokens are
invalidated when the application restarts. Admin logout revocation is also held in
memory and is lost on restart; persistent revocation and administrator storage are
part of the pending database integration.

Role gates currently protect administrator management (`SUPER_ADMIN`), settings
(`SUPER_ADMIN` or `ADMIN`), moderation (`SUPER_ADMIN`, `ADMIN` or `MODERATOR`), and
analytics/audit reads (`SUPER_ADMIN`, `ADMIN` or `ANALYST`). Other admin endpoints
require an authenticated administrator.

Password reset endpoints return `501 Not Implemented` until a reset-token store and
email delivery provider are configured.

## Flyway migrations

Database migrations live in `src/main/resources/db/migration/` as `V*.sql` files:

```
V1__create_users.sql
V2__create_languages.sql
V3__create_connections.sql
V4__create_communities.sql
V5__create_posts.sql
V6__create_messaging.sql
V7__create_notifications.sql
V8__create_reports.sql
```

These are not executed yet because database integration is deferred for the prototype.

## Package layout

The backend follows a feature-based package structure under `com.migrantcommunity`:

```
common/        # ApiResponse, exceptions, enums, utils, validation (shared, cross-cutting)
auth/          # one package per feature, each with controller/ service/ dto/
user/
profile/
language/
location/
discovery/
connection/
community/
post/
messaging/
notification/
moderation/
admin/
```

Each feature package contains a `controller/`, a `service/` and a `dto/` layer. The `repository/` and `entity/` layers are intentionally **not** present in this prototype so that nothing requires a live database connection.

## Database state

**The database is not wired up yet for this prototype.** `DataSourceAutoConfiguration`, `HibernateJpaAutoConfiguration` and `FlywayAutoConfiguration` are excluded in `application.yml`, and the service layer returns clearly-commented placeholder data. The schema and seed data are ready under `database/` for when integration begins.

## Tests

```bash
mvn -f backend/pom.xml test
```
