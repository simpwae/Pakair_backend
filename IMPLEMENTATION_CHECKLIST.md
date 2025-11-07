# PakAir Backend Implementation Checklist

Use this checklist to track your implementation progress.

---

## ✅ Phase 1: Database Setup (COMPLETED)

- [x] Create User schema
- [x] Create CitizenReport schema
- [x] Create AQIStation schema
- [x] Create HealthGuidance schema
- [x] Create PolicyAdvisory schema
- [x] Create Notification schema
- [x] Create database connection handler
- [x] Create model index file
- [x] Create .env.example file
- [x] Update main index.js with database connection
- [x] Create comprehensive documentation

---

## 📋 Phase 2: Basic Setup (TODO)

### 2.1 Environment Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Set `MONGODB_URI` in `.env`
- [ ] Set `JWT_SECRET` in `.env`
- [ ] Set `PORT` in `.env`
- [ ] Install required packages: `npm install mongoose bcryptjs jsonwebtoken cors multer`

### 2.2 Database Connection
- [ ] Start MongoDB server
- [ ] Test database connection: `npm run dev`
- [ ] Verify connection in console logs
- [ ] Test health check endpoint: `GET http://localhost:3000/health`

---

## 🔐 Phase 3: Authentication (TODO)

### 3.1 Password Hashing
- [ ] Install bcryptjs: `npm install bcryptjs`
- [ ] Add pre-save hook in User model for password hashing
- [ ] Create password comparison method

**File**: `src/models/User.js`
```javascript
// Add before export
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### 3.2 JWT Token Generation
- [ ] Install jsonwebtoken: `npm install jsonwebtoken`
- [ ] Create JWT utility functions
- [ ] Create token generation method

**File**: `src/utils/jwt.js`
```javascript
import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

### 3.3 Authentication Middleware
- [ ] Create auth middleware file
- [ ] Implement protect middleware
- [ ] Implement role-based middleware

**File**: `src/middlewares/auth.js`
```javascript
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
};
```

---

## 📤 Phase 4: File Upload (TODO)

### 4.1 Multer Setup
- [ ] Install multer: `npm install multer`
- [ ] Create upload middleware
- [ ] Configure storage (local or cloud)
- [ ] Add file validation

**File**: `src/middlewares/upload.js`
```javascript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter
});

export default upload;
```

### 4.2 Upload Directory
- [ ] Create `uploads` folder in project root
- [ ] Add `uploads/` to `.gitignore`
- [ ] Set up static file serving in index.js

```javascript
// In index.js
app.use('/uploads', express.static('uploads'));
```

---

## 🎮 Phase 5: Controllers (TODO)

### 5.1 Auth Controller
- [ ] Create auth controller file
- [ ] Implement register function
- [ ] Implement login function
- [ ] Implement logout function
- [ ] Implement get current user function

**File**: `src/controllers/authController.js`

### 5.2 Report Controller
- [ ] Create report controller file
- [ ] Implement create report function
- [ ] Implement get all reports function
- [ ] Implement get single report function
- [ ] Implement update report function
- [ ] Implement delete report function
- [ ] Implement verify report function (officials only)

**File**: `src/controllers/reportController.js`

### 5.3 Station Controller
- [ ] Create station controller file
- [ ] Implement create station function
- [ ] Implement get all stations function
- [ ] Implement get single station function
- [ ] Implement update station function
- [ ] Implement delete station function
- [ ] Implement verify station function (officials only)

**File**: `src/controllers/stationController.js`

### 5.4 User Controller
- [ ] Create user controller file
- [ ] Implement get profile function
- [ ] Implement update profile function
- [ ] Implement change password function
- [ ] Implement update preferences function

**File**: `src/controllers/userController.js`

---

## 🛣️ Phase 6: Routes (TODO)

### 6.1 Auth Routes
- [ ] Create auth routes file
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me

**File**: `src/routes/authRoutes.js`

### 6.2 Report Routes
- [ ] Create report routes file
- [ ] POST /api/reports (protected)
- [ ] GET /api/reports
- [ ] GET /api/reports/:id
- [ ] PATCH /api/reports/:id (protected, owner only)
- [ ] DELETE /api/reports/:id (protected, owner only)
- [ ] PATCH /api/reports/:id/verify (protected, officials only)

**File**: `src/routes/reportRoutes.js`

### 6.3 Station Routes
- [ ] Create station routes file
- [ ] POST /api/stations (protected)
- [ ] GET /api/stations
- [ ] GET /api/stations/:id
- [ ] PATCH /api/stations/:id (protected, owner only)
- [ ] DELETE /api/stations/:id (protected, owner only)
- [ ] PATCH /api/stations/:id/verify (protected, officials only)

**File**: `src/routes/stationRoutes.js`

### 6.4 User Routes
- [ ] Create user routes file
- [ ] GET /api/users/profile (protected)
- [ ] PATCH /api/users/profile (protected)
- [ ] PATCH /api/users/password (protected)
- [ ] PATCH /api/users/preferences (protected)

**File**: `src/routes/userRoutes.js`

### 6.5 Mount Routes in index.js
- [ ] Import all route files
- [ ] Mount auth routes
- [ ] Mount report routes
- [ ] Mount station routes
- [ ] Mount user routes

```javascript
// In index.js
import authRoutes from './src/routes/authRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import stationRoutes from './src/routes/stationRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/users', userRoutes);
```

---

## 🛡️ Phase 7: Middleware & Validation (TODO)

### 7.1 Error Handling
- [ ] Create error handler middleware
- [ ] Create async handler wrapper
- [ ] Add global error handler to index.js

**File**: `src/middlewares/errorHandler.js`

### 7.2 Validation
- [ ] Install express-validator: `npm install express-validator`
- [ ] Create validation middleware
- [ ] Add validation for register
- [ ] Add validation for login
- [ ] Add validation for create report
- [ ] Add validation for create station

**File**: `src/middlewares/validation.js`

### 7.3 CORS
- [ ] Install cors: `npm install cors`
- [ ] Configure CORS in index.js
- [ ] Set allowed origins from .env

```javascript
// In index.js
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### 7.4 Rate Limiting
- [ ] Install express-rate-limit: `npm install express-rate-limit`
- [ ] Create rate limiter
- [ ] Apply to auth routes
- [ ] Apply to API routes

**File**: `src/middlewares/rateLimiter.js`

---

## 🧪 Phase 8: Testing (TODO)

### 8.1 API Testing
- [ ] Install REST client (Thunder Client, Postman, or Insomnia)
- [ ] Test user registration
- [ ] Test user login
- [ ] Test create report (with file upload)
- [ ] Test get reports
- [ ] Test create station
- [ ] Test get stations
- [ ] Test protected routes
- [ ] Test role-based access

### 8.2 Create Test Data
- [ ] Create test users (citizen and official)
- [ ] Create test reports
- [ ] Create test stations
- [ ] Verify relationships work correctly

---

## 🔧 Phase 9: Additional Features (TODO)

### 9.1 Geospatial Queries
- [ ] Implement get reports near location
- [ ] Implement get stations near location
- [ ] Test geospatial queries

### 9.2 Pagination
- [ ] Create pagination utility
- [ ] Add pagination to get reports
- [ ] Add pagination to get stations
- [ ] Add pagination to get notifications

### 9.3 Search & Filtering
- [ ] Add search by location (city, province)
- [ ] Add filter by verification status
- [ ] Add filter by date range
- [ ] Add filter by severity

### 9.4 Notifications
- [ ] Create notification service
- [ ] Send notification on report verification
- [ ] Send notification on station approval
- [ ] Send notification on new policy advisory

---

## 📚 Phase 10: Documentation (TODO)

### 10.1 API Documentation
- [ ] Install swagger: `npm install swagger-ui-express swagger-jsdoc`
- [ ] Create swagger configuration
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Add authentication documentation

### 10.2 Code Documentation
- [ ] Add JSDoc comments to functions
- [ ] Document complex logic
- [ ] Create README for each module

---

## 🚀 Phase 11: Frontend Integration (TODO)

### 11.1 Update Frontend Forms
- [ ] Update SignupPage to call /api/auth/register
- [ ] Update LoginPage to call /api/auth/login
- [ ] Update ReportSmog to call /api/reports
- [ ] Update station form to call /api/stations
- [ ] Store JWT token in localStorage/context
- [ ] Add token to all protected requests

### 11.2 Create API Service
- [ ] Create axios instance with base URL
- [ ] Add request interceptor for auth token
- [ ] Add response interceptor for errors
- [ ] Create service functions for all endpoints

**File**: `pakair-dashboard/src/services/api.js`

---

## 🏭 Phase 12: Production Preparation (TODO)

### 12.1 Security
- [ ] Add helmet: `npm install helmet`
- [ ] Add express-mongo-sanitize: `npm install express-mongo-sanitize`
- [ ] Add xss-clean: `npm install xss-clean`
- [ ] Add hpp: `npm install hpp`
- [ ] Review all security best practices

### 12.2 Performance
- [ ] Add compression: `npm install compression`
- [ ] Optimize database queries
- [ ] Add database indexes (already done in schemas)
- [ ] Consider caching strategy

### 12.3 Logging
- [ ] Install morgan: `npm install morgan`
- [ ] Add request logging
- [ ] Add error logging
- [ ] Consider winston for advanced logging

### 12.4 Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up performance monitoring
- [ ] Set up uptime monitoring

---

## 📦 Phase 13: Deployment (TODO)

### 13.1 Database
- [ ] Set up MongoDB Atlas account
- [ ] Create production cluster
- [ ] Configure network access
- [ ] Create database user
- [ ] Update MONGODB_URI in production .env

### 13.2 File Storage
- [ ] Choose storage solution (AWS S3, Cloudinary, etc.)
- [ ] Set up storage account
- [ ] Update upload middleware for cloud storage
- [ ] Test file uploads to cloud

### 13.3 Backend Deployment
- [ ] Choose hosting (Heroku, Railway, DigitalOcean, etc.)
- [ ] Set up production environment variables
- [ ] Deploy backend
- [ ] Test production API

### 13.4 Frontend Deployment
- [ ] Update API base URL to production
- [ ] Deploy frontend (Vercel, Netlify, etc.)
- [ ] Test end-to-end functionality

---

## 📊 Progress Summary

### Completed: Phase 1 ✅
- Database schemas created
- Documentation complete
- Project structure set up

### Current Phase: Phase 2 ⏳
- Basic setup and configuration

### Total Progress: ~10% Complete

---

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install mongoose bcryptjs jsonwebtoken cors multer express-validator

# Set up environment
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev

# Test API
curl http://localhost:3000/health
```

---

## 📝 Notes

- Mark items as complete by changing `[ ]` to `[x]`
- Add notes or issues as you encounter them
- Update this checklist as you progress
- Refer to documentation files for detailed implementation

---

## 🆘 Need Help?

Refer to these documentation files:
1. `README_SCHEMAS.md` - Quick start guide
2. `SCHEMAS_DOCUMENTATION.md` - Detailed schema docs
3. `FORM_TO_SCHEMA_MAPPING.md` - Form-to-database mapping
4. `DATABASE_STRUCTURE.md` - Database structure overview
5. `SCHEMAS_SUMMARY.md` - Project summary

---

**Last Updated**: November 6, 2024  
**Current Phase**: Phase 2 - Basic Setup  
**Next Milestone**: Complete authentication system
