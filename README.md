# Migrant Community Platform 🌍

A modern, scalable platform designed to help migrants connect with people from their hometown, speak their native language, and build meaningful communities in their new city.

**Initial Launch Location:** Gurugram, India

---

## 🎯 Project Vision

This is **NOT** a dating app, matrimonial platform, job portal, or generic social network. It's a specialized community platform focused on:
- Hometown connections
- Language-based communities  
- Cultural affinity
- Local friend-making
- Reducing loneliness among migrants

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18
- **Language**: JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.2
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Database**: PostgreSQL 15+ (ready for integration)
- **API Style**: REST

---

## 📁 Project Structure

```
migrant-community-platform/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   │   ├── common/  # Buttons, inputs, cards, modals
│   │   │   ├── layout/  # PublicLayout, UserLayout, AdminLayout
│   │   │   ├── shared/  # Feature-specific shared components
│   │   │   ├── charts/  # Chart components
│   │   │   └── widgets/ # Dashboard widgets
│   │   ├── pages/        # Route pages
│   │   │   ├── landing/ # Landing page
│   │   │   ├── auth/    # Login, register, verify
│   │   │   ├── onboarding/ # User onboarding
│   │   │   ├── dashboard/  # User dashboard
│   │   │   ├── discover/   # Discover people
│   │   │   ├── communities/ # Communities
│   │   │   ├── connections/ # Connections
│   │   │   ├── messages/    # Messaging
│   │   │   ├── events/      # Events
│   │   │   ├── profile/     # User profile
│   │   │   ├── notifications/ # Notifications
│   │   │   ├── settings/    # Settings
│   │   │   └── admin/       # Admin portal (17 pages)
│   │   ├── services/     # API service layer
│   │   ├── context/      # React Context providers
│   │   ├── routes/       # Route configuration
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utilities and helpers
│   │   └── styles/       # Global styles
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies
│   ├── vite.config.js    # Vite configuration
│   └── tailwind.config.js # Tailwind configuration
│
├── backend/              # Spring Boot API
│   ├── src/main/
│   │   ├── java/com/migrantcommunity/
│   │   │   ├── auth/         # Authentication
│   │   │   ├── user/         # User management
│   │   │   ├── profile/      # User profiles
│   │   │   ├── discovery/    # People discovery
│   │   │   ├── connection/   # Connections
│   │   │   ├── community/    # Communities
│   │   │   ├── post/         # Posts & comments
│   │   │   ├── messaging/    # Messaging
│   │   │   ├── event/        # Events
│   │   │   ├── notification/ # Notifications
│   │   │   ├── moderation/   # Content moderation
│   │   │   ├── language/     # Languages
│   │   │   ├── location/     # Locations
│   │   │   ├── admin/        # Admin features
│   │   │   ├── config/       # Configuration
│   │   │   ├── security/     # Security (JWT)
│   │   │   └── common/       # Shared utilities
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/ # Flyway migrations
│   ├── pom.xml           # Maven dependencies
│   └── Dockerfile        # Docker configuration
│
├── database/             # Database scripts
├── docs/                 # Documentation
├── .gitignore
└── README.md            # This file
```

---

## 🏃 Quick Start

### Prerequisites
- **Node.js 18+** (`node -v`)
- **Java 21** (`java -version`)
- **Maven 3.8+** (`mvn -version`)
- PostgreSQL 15+ (for production, optional for prototype)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd migrant-community-platform
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`
API base path: `http://localhost:8080/api/v1`

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### 4. Access the Application
- **Landing Page**: http://localhost:5173
- **User Portal**: http://localhost:5173/app/dashboard (after login)
- **Admin Portal**: http://localhost:5173/admin/dashboard (after admin login)

---

## 🎨 Design System

### Color Palette
```
Primary Colors:
- Navy (#202B45) - Primary brand, headers
- Terracotta (#D97757) - Accent, CTAs, highlights
- Lavender (#E9E6F5) - Soft backgrounds
- Beige (#F0E9DD) - Warm neutrals
- Off-white (#F8F7F4) - Base background

Supporting Colors:
- Charcoal (#252525) - Body text
- Grey (#737373) - Secondary text
- Success (#248A61) - Success states
- Warning (#D99A36) - Warning states
- Error (#D9534F) - Error states
```

### Typography
- **Font**: Inter (system fallback: -apple-system, sans-serif)
- **Scale**: Consistent heading hierarchy (h1-h6)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

---

## ✨ Features

### 👤 User Portal
- ✅ Landing page with platform introduction
- ✅ User authentication (register, login, email verification)
- ✅ Interactive onboarding (3-step profile setup)
- ✅ Personalized dashboard
- 🚧 Discover people (by hometown, language, interests, location)
- 🚧 Community management (browse, join, create, participate)
- 🚧 Connection requests and management
- 🚧 Real-time messaging
- 🚧 Event discovery and registration
- 🚧 Profile and privacy settings
- 🚧 Notifications

### 🛡️ Admin Portal
- ✅ Separate admin authentication with role-based access
- ✅ Admin dashboard with metrics and analytics
- 🚧 User management (search, verify, suspend, activate)
- 🚧 Community moderation
- 🚧 Content management (posts, events)
- 🚧 Reports and moderation queue
- 🚧 Language and location management
- 🚧 Administrator management (SUPER_ADMIN only)
- 🚧 Audit logs
- 🚧 Platform settings

**Legend:**
- ✅ Fully implemented
- 🚧 Stub created, ready for implementation

---

## 🔌 API Integration

### Authentication & Authorization
- **User Auth**: JWT-based with access/refresh tokens
- **Admin Auth**: Separate JWT system with role hierarchy
- **Token Refresh**: Automatic refresh on 401 errors
- **Role-Based Access**: Frontend enforces routes, backend enforces endpoints

### Service Layer (All Implemented)
All API services are fully integrated and ready to use:

- `authService` - User registration, login, logout, password reset
- `adminAuthService` - Admin authentication
- `profileService` - Profile CRUD, privacy settings, languages
- `discoveryService` - People discovery with filters
- `connectionService` - Send, accept, reject connections
- `communityService` - Community CRUD, join, leave, invite
- `postService` - Posts, comments, reactions
- `eventService` - Event CRUD, registration
- `messageService` - Conversations, messages
- `notificationService` - Notifications, unread count
- `moderationService` - Report content
- `languageService` - Language list
- `locationService` - Location data
- `uploadService` - File uploads
- `adminService` - Comprehensive admin operations

### API Base URL
- Development: `http://localhost:8080/api/v1`
- The backend uses `/api` as servlet context path
- All endpoints follow REST conventions

---

## 🧩 Component Library

### Common Components (All Implemented)
- Button (6 variants, 3 sizes, loading states)
- Input (with icons, validation, helper text)
- Select, Textarea, Checkbox
- Card (with hover effects)
- Modal (4 sizes, customizable)
- Avatar (6 sizes, online indicator)
- Badge (7 variants)
- Tabs, Pagination
- Loading spinner, Empty state, Toast notifications
- SearchInput (with debounce)

### Layout Components
- PublicLayout - Header, footer, responsive nav
- UserLayout - Sidebar navigation, user profile
- AdminLayout - Dark theme, role-based sidebar

---

## 🛣️ Routing

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify-email` - Email verification

### User Routes (Protected)
- `/app/dashboard` - User dashboard
- `/app/discover` - Discover people
- `/app/communities` - Communities list
- `/app/communities/:id` - Community details
- `/app/connections` - Connections management
- `/app/messages` - Messaging
- `/app/events` - Events list
- `/app/events/:id` - Event details
- `/app/profile` - User profile
- `/app/notifications` - Notifications
- `/app/settings` - Settings

### Admin Routes (Role-Based Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/communities` - Community management
- `/admin/moderation` - Content moderation
- `/admin/posts` - Posts management
- `/admin/events` - Events management
- `/admin/connections` - Connections analytics
- `/admin/analytics` - Platform analytics
- `/admin/languages` - Language management
- `/admin/locations` - Location management
- `/admin/notifications` - Notification broadcast
- `/admin/administrators` - Admin management (SUPER_ADMIN)
- `/admin/audit` - Audit logs
- `/admin/settings` - Platform settings (ADMIN)

---

## 📚 Documentation

Comprehensive documentation available:

- **[frontend/FEATURES.md](frontend/FEATURES.md)** - Complete feature implementation guide
- **[frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md)** - Deployment and development guide
- **[frontend/README.md](frontend/README.md)** - Frontend-specific documentation
- **[backend/README.md](backend/README.md)** - Backend API documentation

---

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
```

### Backend Development
```bash
cd backend
mvn spring-boot:run              # Run application
mvn clean package                # Build JAR
mvn test                         # Run tests
```

### Environment Variables

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ENV=development
```

**Backend** (environment or `application.yml`):
```yaml
JWT_SECRET=your-secret-key-min-32-chars
DB_URL=jdbc:postgresql://localhost:5432/migrant_community
DB_USERNAME=postgres
DB_PASSWORD=your-password
ADMIN_BOOTSTRAP_EMAIL=admin@example.com
ADMIN_BOOTSTRAP_PASSWORD=your-secure-password
```

---

## 🧪 Testing

### Current Status
- Backend: Spring Boot tests infrastructure ready
- Frontend: Test setup pending (Jest + React Testing Library recommended)

### Testing Strategy
1. **Unit Tests**: Test services and utilities
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test complete user flows
4. **Manual Testing**: Comprehensive checklist in DEPLOYMENT.md

---

## 🚀 Deployment

### Frontend Deployment
Supports all modern hosting platforms:
- Netlify, Vercel (zero-config)
- AWS S3 + CloudFront
- Nginx/Apache
- Docker container

See [frontend/DEPLOYMENT.md](frontend/DEPLOYMENT.md) for detailed instructions.

### Backend Deployment
- Standalone JAR: `java -jar backend.jar`
- Docker: `docker build -t migrant-community-backend .`
- Cloud platforms: AWS, Azure, GCP, Heroku

### Database Setup
PostgreSQL with Flyway migrations:
```bash
# Migrations are in backend/src/main/resources/db/migration/
# Auto-applied on application startup
```

---

## 🛡️ Security

### Frontend Security
- JWT tokens in localStorage (consider HttpOnly cookies for production)
- HTTPS required in production
- Input validation on all forms
- XSS protection via React
- CSRF protection for state-changing operations

### Backend Security
- Spring Security with JWT
- BCrypt password hashing
- Role-based access control (RBAC)
- CORS configuration
- SQL injection prevention via JPA
- Request validation

### Admin Role Hierarchy
```
SUPER_ADMIN (Level 5)
  ├── Full system access
  ├── Administrator management
  └── All ADMIN permissions
ADMIN (Level 4)
  ├── Settings management
  ├── User management
  ├── All MODERATOR permissions
MODERATOR (Level 3)
  ├── Content moderation
  ├── Report handling
ANALYST (Level 2)
  ├── Analytics access
  ├── Audit log viewing
SUPPORT (Level 1)
  └── Read-only access
```

---

## 📈 Status & Roadmap

### ✅ Completed (Phase 1)
- Complete project setup and architecture
- Design system and component library
- Authentication (user and admin)
- API integration layer (all 14 services)
- Routing and navigation
- Landing page
- User onboarding
- Basic dashboards

### 🚧 In Progress (Phase 2)
- User discovery page
- Communities management
- Connections management
- Messaging system
- Events system
- Profile pages

### 📋 Planned (Phase 3)
- Real-time features (WebSocket)
- File uploads (profile pictures, images)
- Advanced search and filters
- Admin analytics with charts
- Notification system enhancement
- Mobile responsiveness improvements

### 🔮 Future Enhancements
- Progressive Web App (PWA)
- Mobile apps (React Native)
- Video/voice calls
- Multi-language support (i18n)
- Advanced matching algorithms
- AI-powered recommendations

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Frontend: ESLint with React rules
- Backend: Google Java Style Guide
- Commits: Conventional Commits

---

## 📝 License

This project is proprietary. All rights reserved.

---

## 👥 Team & Support

For questions, issues, or contributions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

## 🎉 Acknowledgments

Built with modern technologies and best practices to create a welcoming platform for migrants to find their community.

**Initial Launch:** Gurugram, India  
**Vision:** Global expansion to all major cities

---

**Status:** Production-Ready Foundation ✅  
**Build Status:** ✅ Passing  
**Last Updated:** 2024
