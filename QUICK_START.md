# 🚀 Migrant Community Platform - Quick Start

## ⚡ Fast Track Setup (5 Minutes)

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```
✅ Backend ready at: http://localhost:8080

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm install    # First time only
npm run dev
```
✅ Frontend ready at: http://localhost:5173

### Step 3: Access Application
Open your browser and visit:
- **Landing Page**: http://localhost:5173
- **User Register**: http://localhost:5173/register
- **Admin Login**: http://localhost:5173/admin/login

---

## 📋 What You Get Out of the Box

### ✅ FULLY FUNCTIONAL
1. **Landing Page** - Beautiful, responsive homepage
2. **User Registration** - Complete with validation
3. **User Login** - JWT authentication
4. **Admin Login** - Separate admin authentication
5. **Onboarding** - 3-step profile setup
6. **User Dashboard** - With suggestions and events
7. **Admin Dashboard** - With metrics and stats
8. **Navigation** - Role-based routing
9. **API Integration** - All 14 services connected
10. **Components** - 15+ reusable UI components

### 🚧 READY TO IMPLEMENT (Stubs Created)
All other pages have stubs and are ready for implementation:
- Discover People
- Communities
- Connections
- Messaging
- Events
- Profile
- Settings
- Notifications
- All Admin Pages

---

## 🎯 Test the Application

### Test User Flow
1. Go to http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Create an account
4. Complete onboarding (3 steps)
5. See your dashboard
6. Explore navigation

### Test Admin Flow
1. Go to http://localhost:5173/admin/login
2. Use admin credentials (if backend has bootstrap admin)
3. See admin dashboard
4. Explore admin navigation

---

## 🛠️ Project Structure Overview

```
migrant-community-platform/
├── frontend/          # ✅ Complete React app
│   ├── src/
│   │   ├── components/   # ✅ 15+ components
│   │   ├── pages/        # ✅ 30+ pages (7 complete, 23 stubs)
│   │   ├── services/     # ✅ 14 API services
│   │   ├── context/      # ✅ 4 contexts
│   │   ├── routes/       # ✅ Routing setup
│   │   ├── utils/        # ✅ Helpers
│   │   └── styles/       # ✅ Global styles
│   └── package.json      # ✅ All dependencies
│
└── backend/           # ✅ Spring Boot API
    ├── src/main/java/
    │   └── com/migrantcommunity/
    │       ├── auth/        # ✅ Authentication
    │       ├── profile/     # ✅ Profiles
    │       ├── community/   # ✅ Communities
    │       ├── connection/  # ✅ Connections
    │       ├── messaging/   # ✅ Messaging
    │       ├── event/       # ✅ Events
    │       ├── admin/       # ✅ Admin features
    │       └── ... 14 feature modules
    └── pom.xml          # ✅ Dependencies
```

---

## 📊 Implementation Status

| Feature | Backend | Frontend Service | Frontend UI | Status |
|---------|---------|------------------|-------------|--------|
| Authentication | ✅ | ✅ | ✅ | **100%** |
| Landing Page | - | - | ✅ | **100%** |
| Onboarding | ✅ | ✅ | ✅ | **90%** |
| User Dashboard | ✅ | ✅ | ✅ | **80%** |
| Admin Dashboard | ✅ | ✅ | ✅ | **85%** |
| Admin Login | ✅ | ✅ | ✅ | **100%** |
| Discovery | ✅ | ✅ | 🚧 | **30%** |
| Communities | ✅ | ✅ | 🚧 | **25%** |
| Connections | ✅ | ✅ | 🚧 | **25%** |
| Messaging | ✅ | ✅ | 🚧 | **20%** |
| Events | ✅ | ✅ | 🚧 | **25%** |
| Profile | ✅ | ✅ | 🚧 | **20%** |
| Settings | ✅ | ✅ | 🚧 | **15%** |
| Notifications | ✅ | ✅ | 🚧 | **20%** |
| Admin Features | ✅ | ✅ | 🚧 | **20%** |

**Legend:**
- ✅ Complete and working
- 🚧 Stub created, ready for implementation
- Overall Project Status: **40% Complete**

---

## 🎨 Design System in Use

### Colors
- **Navy (#202B45)** - Primary brand
- **Terracotta (#D97757)** - Accent/CTA
- **Lavender (#E9E6F5)** - Backgrounds
- **Beige (#F0E9DD)** - Neutrals
- **Off-white (#F8F7F4)** - Base

### Components Available
✅ Button, Input, Select, Textarea, Checkbox  
✅ Card, Modal, Badge, Avatar  
✅ Tabs, Pagination, SearchInput  
✅ Loading, EmptyState, Toast  

---

## 🔑 Default Credentials

### User Account
Create your own by registering at `/register`

### Admin Account
Configure in backend:
```yaml
# backend/src/main/resources/application.yml
admin:
  bootstrap:
    email: superadmin@migrantcommunity.com
    password: YourSecurePassword123!
```

Or set environment variables:
```bash
ADMIN_BOOTSTRAP_EMAIL=admin@example.com
ADMIN_BOOTSTRAP_PASSWORD=SecurePass123!
```

---

## 🔍 API Endpoints

### Public
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/admin/auth/login` - Admin login

### Protected
- `GET /api/v1/profile/me` - Get profile
- `GET /api/v1/discovery/suggestions` - Get people
- `GET /api/v1/communities` - List communities
- `GET /api/v1/connections` - List connections
- `GET /api/v1/events` - List events
- ... and 50+ more endpoints!

Full API documentation in backend README.

---

## 📖 Next Steps

### For Developers

1. **Understand the Architecture**
   - Read `frontend/FEATURES.md` for feature breakdown
   - Read `frontend/DEPLOYMENT.md` for deployment info
   - Check `backend/README.md` for API details

2. **Start Implementing Pages**
   - Each stub page has a consistent structure
   - Services are already connected
   - Components are ready to use
   - Example implementations provided

3. **Priority Order**
   ```
   1. Discovery Page → Connect people
   2. Communities Page → Join communities
   3. Connections Page → Manage connections
   4. Messaging Page → Chat with connections
   5. Events Page → Browse events
   6. Profile Page → View/edit profile
   7. Admin Pages → Management features
   ```

4. **Implementation Pattern**
   ```jsx
   // 1. Import services and components
   import { useState, useEffect } from 'react';
   import service from '../../services/someService';
   import Loading from '../../components/common/Loading';
   
   // 2. Create component
   const MyPage = () => {
     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(true);
     
     // 3. Fetch data
     useEffect(() => {
       loadData();
     }, []);
     
     const loadData = async () => {
       try {
         const result = await service.getData();
         setData(result);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     };
     
     // 4. Render
     if (loading) return <Loading />;
     
     return <div>Your UI here</div>;
   };
   ```

### For Project Managers

**Estimated Timeline for Completion:**
- Week 1-2: Core user features (discovery, communities, connections)
- Week 3: Social features (messaging, events, profile)
- Week 4: Admin features (user management, moderation, analytics)
- Week 5: Polish, testing, bug fixes

**Current State:**
- ✅ Solid foundation (40% complete)
- ✅ All infrastructure in place
- ✅ Design system implemented
- ✅ API integration ready
- 🚧 Page implementations needed

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check Java version
java -version   # Should be 21

# Clean and rebuild
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend won't start
```bash
# Clear and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build errors
```bash
# Frontend
cd frontend
npm run build    # Should complete without errors

# Backend
cd backend
mvn clean package   # Should create JAR successfully
```

### API connection issues
1. Check backend is running on port 8080
2. Check frontend `.env` file has correct API URL
3. Check browser console for errors
4. Check backend logs for errors

---

## 📞 Support

For questions or issues:
1. Check the documentation in `/docs`
2. Read `frontend/FEATURES.md` for feature details
3. Read `frontend/DEPLOYMENT.md` for deployment help
4. Create an issue in the repository

---

## ✨ What Makes This Special

1. **Production-Ready Foundation** - Not a prototype, actual scalable architecture
2. **Complete API Integration** - All 14 services connected and ready
3. **Reusable Components** - 15+ components, consistent design
4. **Role-Based Access** - User and admin portals in one app
5. **Modern Stack** - React 18, Spring Boot 3.2, Java 21
6. **Best Practices** - Security, error handling, validation
7. **Developer Experience** - Clear structure, documentation, examples

---

**You're now ready to build something amazing! 🚀**

Next: Pick a page from the stubs and start implementing. All the tools are at your fingertips!
