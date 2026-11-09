# Migrant Community Platform - Frontend Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:8080`

### Installation & Development

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```
   
   Build output will be in the `dist/` directory

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Application Structure

### User Flow
1. Landing page → Register/Login
2. Onboarding (profile setup)
3. User Dashboard
4. Discover people, join communities, send connections
5. Messaging, events, profile management

### Admin Flow
1. Admin login at `/admin/login`
2. Admin dashboard
3. Manage users, communities, content, moderation
4. Analytics, settings, audit logs

## Features Implemented

### ✅ Core Infrastructure
- React 18 with Vite
- React Router v6 with role-based routing
- Axios API client with interceptors
- Context API for state management
- Tailwind CSS for styling

### ✅ Authentication
- User registration and login
- Admin login (separate authentication)
- JWT token management with auto-refresh
- Protected routes
- Email verification flow (UI ready, backend integration)

### ✅ API Integration
- Complete service layer for all backend endpoints
- Centralized API client with error handling
- Token refresh on 401 errors
- Request/response interceptors

### ✅ User Portal
- Landing page with features, how it works
- User dashboard with suggestions and events
- Onboarding flow (3 steps)
- Profile management (stub - ready for implementation)
- Discover people (stub - ready for implementation)
- Communities (stub - ready for implementation)
- Connections (stub - ready for implementation)
- Messaging (stub - ready for implementation)
- Events (stub - ready for implementation)
- Settings (stub - ready for implementation)

### ✅ Admin Portal
- Admin dashboard with metrics
- Users management (stub - ready for implementation)
- Communities management (stub - ready for implementation)
- Content moderation (stub - ready for implementation)
- Analytics (stub - ready for implementation)
- Languages & locations management (stubs)
- Administrator management (stub - SUPER_ADMIN only)
- Audit logs (stub)
- Platform settings (stub - ADMIN/SUPER_ADMIN only)

### ✅ Component Library
- Button, Input, Select, Textarea, Checkbox
- Card, Modal, Badge, Avatar
- Tabs, Pagination, SearchInput
- Toast notifications
- Loading states
- Empty states

### ✅ Utilities
- Date/time formatters
- Number formatters
- Validation helpers
- Constants and enums

## Next Steps for Full Implementation

### High Priority
1. **Complete Discovery Page** - Implement filters, search, and people cards
2. **Complete Communities Page** - List, create, join communities
3. **Complete Messaging** - Real-time chat with WebSocket
4. **Complete Events** - Create, browse, register for events
5. **Complete Connections Page** - Send requests, accept/reject, manage connections

### Admin Portal Enhancement
1. **Complete User Management** - Search, filter, suspend, verify users
2. **Complete Moderation Queue** - Review reports, take actions
3. **Complete Analytics Dashboard** - Charts with Recharts
4. **Complete Settings Panel** - Platform configuration

### Additional Features
1. **Notifications** - Real-time notifications with polling/WebSocket
2. **File Upload** - Profile pictures, event images, post images
3. **Search** - Global search across users, communities, events
4. **Filters** - Advanced filtering on all list pages
5. **Pagination** - Implement on all list views

## API Integration Status

### ✅ Fully Integrated Services
- authService.js - User authentication
- adminAuthService.js - Admin authentication
- profileService.js - Profile management
- communityService.js - Community operations
- connectionService.js - Connection management
- messageService.js - Messaging
- eventService.js - Events
- postService.js - Posts and comments
- notificationService.js - Notifications
- discoveryService.js - People discovery
- moderationService.js - Content reporting
- adminService.js - All admin operations
- languageService.js - Languages
- locationService.js - Locations
- uploadService.js - File uploads

All services are ready to use - just call them from your components!

## Environment Variables

### Development
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ENV=development
```

### Production
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_ENV=production
```

## Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Static Hosting (Netlify, Vercel, AWS S3)
1. Build the app: `npm run build`
2. Deploy the `dist/` folder
3. Configure redirects for SPA routing:
   - Netlify: Create `_redirects` file
   - Vercel: Automatic with Next.js config
   - AWS S3: CloudFront redirect rules

### Docker
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Security Considerations

1. **Never commit .env files**
2. **API tokens stored in localStorage** - Consider more secure alternatives for production
3. **HTTPS required in production**
4. **Configure CORS properly** on backend
5. **Implement rate limiting** on sensitive endpoints
6. **Input validation** on all forms

## Testing Strategy

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Admin login
- [ ] Profile updates
- [ ] Discovery and search
- [ ] Sending connection requests
- [ ] Joining communities
- [ ] Creating posts
- [ ] Registering for events
- [ ] Messaging
- [ ] Admin operations

### Automated Testing (Future)
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress or Playwright
- API integration tests

## Troubleshooting

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### API Connection Issues
- Verify backend is running on port 8080
- Check CORS configuration in backend
- Check browser console for errors
- Verify API_BASE_URL in .env

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT token expiration
- Verify refresh token logic

## Performance Optimization

### Current
- Vite for fast builds
- Code splitting by route
- Lazy loading of images
- CSS purging with Tailwind

### Future Improvements
- Image optimization
- Service worker for offline support
- React.lazy for code splitting
- Memoization for expensive components
- Virtual scrolling for long lists

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing
1. Create feature branch from `main`
2. Follow existing code style
3. Test thoroughly
4. Submit PR with description

## Support
For issues or questions, contact the development team.
