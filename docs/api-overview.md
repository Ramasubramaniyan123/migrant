# API Overview

Planned REST endpoints exposed by the backend feature controllers.

> The backend declares a servlet context path of `/api` (`application.yml`) and each
> feature controller declares its own `/api/<feature>` mapping. The **Paths** column
> below lists the mapping declared on the controller, consistent with the generated code.

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| GET | `/api/auth/me` | Return the current authenticated session. | Public (session lookup) |
| POST | `/api/auth/login` | Authenticate with email and password. | Public |
| GET | `/api/user/me` | Get the current user's account details. | Required |
| GET | `/api/profile/me` | Get the current user's profile (bio, languages, hometown). | Required |
| GET | `/api/language/list` | List the languages supported by the platform. | Public |
| GET | `/api/location/nearby` | Get the current user's approximate location used for discovery. | Required |
| GET | `/api/discovery/suggestions` | Suggest nearby users to connect with. | Required |
| GET | `/api/connection/list` | List the current user's connections. | Required |
| POST | `/api/connection/request` | Send a connection request to another user. | Required |
| GET | `/api/community/list` | List language communities. | Required |
| POST | `/api/community/create` | Create a new language community. | Required |
| GET | `/api/post/feed` | Get the community post feed. | Required |
| POST | `/api/post/create` | Publish a post to a community. | Required |
| GET | `/api/messaging/conversations` | List the current user's conversations. | Required |
| POST | `/api/messaging/send` | Send a message in a conversation. | Required |
| GET | `/api/notification/list` | List the current user's notifications. | Required |
| GET | `/api/moderation/reports` | List abuse reports for moderation. | Admin / Moderator |
| GET | `/api/admin/stats` | Get aggregate platform statistics for the admin dashboard. | Admin |

All responses are wrapped in the common `ApiResponse<T>` envelope
(`{ "success": boolean, "message": string, "data": T }`).
