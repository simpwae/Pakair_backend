# PakAir Database Schemas - Quick Start Guide

## Overview

I've created comprehensive MongoDB schemas for your PakAir application. All schemas are production-ready with validation, indexing, and best practices implemented.

## 📁 Created Files

### Models (Schemas)
1. **`src/models/User.js`** - User registration and authentication
2. **`src/models/CitizenReport.js`** - Citizen smog/air quality reports
3. **`src/models/AQIStation.js`** - Private AQI monitoring stations
4. **`src/models/HealthGuidance.js`** - Health guidance content
5. **`src/models/PolicyAdvisory.js`** - Government policy advisories
6. **`src/models/Notification.js`** - Multi-channel notifications
7. **`src/models/index.js`** - Central export file

### Configuration
8. **`src/config/database.js`** - MongoDB connection handler
9. **`.env.example`** - Environment variables template
10. **`SCHEMAS_DOCUMENTATION.md`** - Detailed documentation

### Updated
11. **`index.js`** - Updated with database connection

## 🚀 Quick Start

### 1. Install Required Packages
```bash
npm install mongoose bcryptjs jsonwebtoken cors multer
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your MongoDB connection string
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/pakair

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pakair
```

### 3. Start MongoDB
If using local MongoDB:
```bash
# Windows
net start MongoDB

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Run the Server
```bash
npm run dev
```

## 📊 Schema Summary

### 1. User Schema
**Purpose:** Store citizen and official user accounts

**Key Features:**
- Email and phone validation
- Password hashing support
- Role-based access (citizen/official)
- Location tracking
- Notification preferences
- Multi-language support

**Form Fields Captured:**
- ✅ First Name
- ✅ Last Name
- ✅ Email
- ✅ Phone
- ✅ Password
- ✅ Terms Agreement

### 2. CitizenReport Schema ⭐ (PRIMARY FOCUS)
**Purpose:** Store citizen-submitted air quality reports

**Key Features:**
- Media upload support (images/videos up to 20MB)
- GPS location tracking
- Verification workflow
- Status management
- Engagement metrics (views, likes)
- Comments and flags
- Geospatial indexing for map queries

**Form Fields Captured from ReportSmog.jsx:**
- ✅ Media file (image/video)
- ✅ Location (current or manual)
- ✅ Address/coordinates
- ✅ Description (optional)
- ✅ User ID (from session)

**Additional Fields for Officials:**
- Verification status
- Verification notes
- AQI data
- Severity level
- Tags

### 3. AQIStation Schema
**Purpose:** Store private air quality monitoring stations

**Key Features:**
- Station metadata (name, model)
- GPS coordinates
- Verification workflow
- Technical details (sensors, calibration)
- API integration for data feeds
- Maintenance records

**Form Fields Captured from ReportSmog.jsx (bottom section):**
- ✅ Station Name (optional)
- ✅ Model (e.g., PurpleAir)
- ✅ Latitude
- ✅ Longitude
- ✅ User ID (from session)

### 4. HealthGuidance Schema
**Purpose:** Store health recommendations by AQI level

**Key Features:**
- AQI range targeting
- Category-based (children, elderly, etc.)
- Multilingual support (English/Urdu)
- Recommendations and precautions
- Symptom warnings

### 5. PolicyAdvisory Schema
**Purpose:** Store government alerts and policies

**Key Features:**
- Geographic targeting (national/provincial/city)
- Time-based validity
- Severity levels
- Multi-channel notifications
- Attachment support

### 6. Notification Schema
**Purpose:** Track all user notifications

**Key Features:**
- Multi-channel (in-app, email, SMS, push)
- Priority levels
- Read/unread tracking
- Related entity linking

## 🎯 Citizen Report Data Flow

Here's how the citizen report form data flows into the database:

### Frontend Form (ReportSmog.jsx)
```javascript
{
  file: File,                    // Image or video
  useCurrentLocation: boolean,   // Checkbox
  address: string,               // Manual address input
  description: string            // Optional description
}
```

### Backend Schema (CitizenReport)
```javascript
{
  userId: ObjectId,              // From authenticated session
  media: {
    type: "image" | "video",
    url: "https://...",          // After upload to storage
    filename: "smog_report.jpg",
    size: 2048576,
    mimeType: "image/jpeg"
  },
  location: {
    useCurrentLocation: true,
    address: "University Town, Peshawar",
    coordinates: {
      latitude: 34.0151,
      longitude: 71.5249
    },
    city: "Peshawar",
    province: "Khyber Pakhtunkhwa"
  },
  description: "Heavy smog...",
  verified: false,
  status: "pending",
  createdAt: "2024-11-06T10:30:00Z"
}
```

## 📝 Next Steps - Implementation

### 1. Create Controller Functions
```javascript
// src/controllers/reportController.js
import { CitizenReport } from '../models/index.js';

export const createReport = async (req, res) => {
  try {
    const report = await CitizenReport.create({
      userId: req.user._id,
      media: req.file, // From multer
      location: req.body.location,
      description: req.body.description
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

### 2. Create Routes
```javascript
// src/routes/reportRoutes.js
import express from 'express';
import { createReport, getReports } from '../controllers/reportController.js';
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('media'), createReport);
router.get('/', getReports);

export default router;
```

### 3. Add File Upload Middleware
```javascript
// src/middlewares/upload.js
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20971520 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos allowed'));
    }
  }
});

export default upload;
```

### 4. Add Authentication Middleware
```javascript
// src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Not authorized');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};
```

## 🔍 Example Queries

### Get All Verified Reports in a City
```javascript
const reports = await CitizenReport.find({
  'location.city': 'Peshawar',
  verified: true,
  status: 'verified'
})
.populate('userId', 'firstName lastName')
.sort({ createdAt: -1 })
.limit(20);
```

### Get Reports Near a Location (within 5km)
```javascript
const reports = await CitizenReport.find({
  'location.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [71.5249, 34.0151] // [longitude, latitude]
      },
      $maxDistance: 5000 // 5km in meters
    }
  }
});
```

### Get Pending Stations for Verification
```javascript
const stations = await AQIStation.find({
  status: 'pending',
  verified: false
})
.populate('submittedBy', 'firstName lastName email')
.sort({ createdAt: -1 });
```

## 📦 Package Dependencies

Add these to your `package.json`:
```json
{
  "dependencies": {
    "express": "^4.21.2",
    "mongoose": "^8.19.3",
    "dotenv": "^16.4.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5"
  }
}
```

## 🛡️ Security Considerations

1. **Password Hashing**: Implement bcrypt in User model pre-save hook
2. **JWT Authentication**: Use JWT for secure API access
3. **File Upload Validation**: Validate file types and sizes
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Sanitization**: Sanitize all user inputs
6. **CORS**: Configure CORS for your frontend domain

## 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Geospatial Queries](https://www.mongodb.com/docs/manual/geospatial-queries/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 🤝 Support

For detailed schema documentation, see `SCHEMAS_DOCUMENTATION.md`

---

**Created for PakAir Project**
*Air Quality Monitoring System for Pakistan*
