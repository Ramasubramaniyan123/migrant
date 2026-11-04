# Database

This folder contains the database schema and seed data for the Migrant Community Platform.

## Database Technology

- **Database**: PostgreSQL 15+
- **Extension**: PostGIS (for geographical location queries)

## Tables

| Table | Purpose |
|-------|---------|
| users | Authentication and account details |
| user_profiles | Personal information |
| languages | Available languages |
| user_languages | User-language relationships |
| locations | Approximate user locations |
| connections | Connection requests |
| communities | Language communities |
| community_members | Community memberships |
| posts | Community posts |
| comments | Post comments |
| conversations | Chat conversations |
| conversation_members | Conversation participants |
| messages | Chat messages |
| notifications | User notifications |
| reports | Abuse reports |
| blocks | Blocked users |

## Setup

1. Install PostgreSQL 15+ with PostGIS extension
2. Create a database:
   ```sql
   CREATE DATABASE migrant_community;
   ```

3. Run the schema:
   ```bash
   psql -U your_username -d migrant_community -f schema.sql
   ```

4. Run the seed data (optional):
   ```bash
   psql -U your_username -d migrant_community -f seed-data.sql
   ```

## Location Privacy

Location data is stored with accuracy information (in kilometers) to protect user privacy. Approximate locations are used for discovery features, not exact coordinates.

## Migrations

The backend uses Flyway for database migrations. Migration files are located in `backend/src/main/resources/db/migration/`.
