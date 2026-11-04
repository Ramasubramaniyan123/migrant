# Migrant Community Platform

A scalable platform designed to help migrants connect with others from their hometown, speak their language, and build communities in their new location.

## Tech Stack

### Frontend
- **Framework**: React.js 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA + Hibernate
- **Database**: PostgreSQL 15+ with PostGIS

## Project Structure

```
migrant-community-platform/
├── frontend/          # React + TypeScript frontend
├── backend/           # Java + Spring Boot backend
├── database/          # Database schema and seed data
├── docs/              # Project documentation
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Java 21
- Maven 3.8+
- PostgreSQL 15+ with PostGIS extension

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd migrant-community-platform
   ```

2. **Setup Database**
   ```bash
   # Create database
   createdb migrant_community

   # Run schema
   psql -U your_username -d migrant_community -f database/schema.sql

   # Run seed data (optional)
   psql -U your_username -d migrant_community -f database/seed-data.sql
   ```

3. **Setup Backend**
   ```bash
   cd backend

   # Configure database connection in src/main/resources/application.yml

   # Run the application
   mvn spring-boot:run
   ```

   Backend will run on `http://localhost:8080`

4. **Setup Frontend**
   ```bash
   cd frontend

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Database
- PostgreSQL: `localhost:5432`
- Database name: `migrant_community`

## Features

- **User Authentication**: Registration, login, and password recovery
- **Profile Management**: Personal information, languages, and location
- **Discovery**: Find people from your hometown or who speak your language
- **Connections**: Send and manage connection requests
- **Communities**: Join language-based communities
- **Messaging**: Real-time chat with connections
- **Notifications**: Stay updated with activities
- **Admin Panel**: User and content moderation

## Architecture Rules

- Frontend and backend run independently
- Communication via REST APIs
- No database queries in controllers
- Business logic in service classes
- Use DTOs instead of exposing JPA entities
- Mock data separate from production API services
- Environment variables for credentials
- Proper validation and exception handling
- PostgreSQL/PostGIS for geographical discovery
- Location data privacy protected

## API Documentation

API documentation will be available at `http://localhost:8080/swagger-ui.html` once the backend is running.

## License

[Your License Here]
