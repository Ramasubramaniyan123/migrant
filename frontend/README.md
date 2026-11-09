# Migrant Community Platform - Frontend

A modern React application for connecting migrants with their hometown communities, language speakers, and local networks.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons, illustrations
│   ├── components/     # Reusable components
│   │   ├── common/    # Buttons, inputs, cards, modals
│   │   ├── layout/    # Layouts for public, user, admin
│   │   ├── shared/    # Shared across features
│   │   ├── charts/    # Chart components
│   │   └── widgets/   # Dashboard widgets
│   ├── pages/          # Page components
│   │   ├── landing/   # Landing page
│   │   ├── auth/      # Login, register, verify
│   │   ├── onboarding/ # User onboarding flow
│   │   ├── dashboard/  # User dashboard
│   │   ├── discover/   # Discover people
│   │   ├── hometown/   # Hometown connections
│   │   ├── communities/ # Community features
│   │   ├── connections/ # Connection management
│   │   ├── messages/    # Messaging
│   │   ├── profile/     # User profile
│   │   ├── notifications/ # Notifications
│   │   ├── settings/    # User settings
│   │   └── admin/       # Admin portal
│   ├── services/       # API services
│   │   ├── api/        # API client
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── communityService.js
│   │   └── ...
│   ├── context/        # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── UserContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/          # Custom hooks
│   ├── routes/         # Route configuration
│   ├── data/           # Static data
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── .env.example        # Environment variables template
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8080

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   cd migrant-community-platform/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Features

### User Portal
- Landing page with platform introduction
- User authentication (register, login, email verification)
- Interactive onboarding flow
- Personalized dashboard
- Discover people by hometown, language, interests
- Community management (join, create, participate)
- Connection requests and management
- Real-time messaging
- Event discovery and registration
- Profile and privacy settings
- Notifications

### Admin Portal
- Admin dashboard with analytics
- User management (search, verify, suspend)
- Community moderation
- Content management
- Event management
- Reports and moderation queue
- Language and location management
- Administrator management
- Audit logs
- Platform settings

## API Integration

The frontend communicates with the Spring Boot backend API:

- **Base URL**: `http://localhost:8080/api/v1`
- **Authentication**: JWT tokens via Authorization header
- **CORS**: Configured for localhost development

All API calls go through centralized services in `src/services/`.

## Design System

### Color Palette
- **Navy (#202B45)**: Primary brand color
- **Terracotta (#D97757)**: Accent and CTA
- **Lavender (#E9E6F5)**: Soft backgrounds
- **Beige (#F0E9DD)**: Warm neutrals
- **Offwhite (#F8F7F4)**: Base background

### Typography
- Font: Inter
- Consistent hierarchy
- Accessible contrast ratios

### Components
- Rounded cards (12px radius)
- Soft shadows
- Clean spacing system
- Responsive design (mobile-first)

## Routing

- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/onboarding` - New user onboarding
- `/app/*` - User portal (authenticated)
- `/admin/*` - Admin portal (admin roles only)

## State Management

- **AuthContext**: Authentication state and user session
- **UserContext**: User profile and preferences
- **NotificationContext**: Real-time notifications
- **ThemeContext**: UI theme preferences

## Development Guidelines

1. **Component Structure**: Keep components small and focused
2. **API Integration**: Always use service layer, never direct axios calls
3. **Error Handling**: Handle loading, success, error states
4. **Accessibility**: Use semantic HTML and ARIA labels
5. **Responsiveness**: Mobile-first approach
6. **Code Style**: Follow ESLint configuration

## License

Proprietary - All rights reserved
