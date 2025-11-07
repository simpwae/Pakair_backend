# PakAir Database Schemas Documentation

This document provides an overview of all database schemas created for the PakAir application.

## Table of Contents
1. [User Schema](#user-schema)
2. [Citizen Report Schema](#citizen-report-schema)
3. [AQI Station Schema](#aqi-station-schema)
4. [Health Guidance Schema](#health-guidance-schema)
5. [Policy Advisory Schema](#policy-advisory-schema)
6. [Notification Schema](#notification-schema)

---

## User Schema

**File:** `src/models/User.js`

### Purpose
Stores information about all users (citizens and officials) registered in the system.

### Key Fields
- **firstName, lastName**: User's name
- **email**: Unique email address (used for login)
- **phone**: Contact number
- **password**: Hashed password (not returned in queries by default)
- **role**: Either 'citizen' or 'official'
- **location**: City, province, and coordinates
- **preferences**: Language and notification settings

### Features
- Email and phone validation
- Password hashing support (requires bcrypt implementation)
- Virtual field for `fullName`
- Indexes on email, phone, and createdAt for fast queries

### Sample Data Structure
```json
{
  "firstName": "Ahmed",
  "lastName": "Khan",
  "email": "ahmed@example.com",
  "phone": "+92-300-1234567",
  "role": "citizen",
  "location": {
    "city": "Peshawar",
    "province": "Khyber Pakhtunkhwa",
    "coordinates": {
      "latitude": 34.0151,
      "longitude": 71.5249
    }
  },
  "preferences": {
    "language": "English",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  }
}
```

---

## Citizen Report Schema

**File:** `src/models/CitizenReport.js`

### Purpose
Stores citizen-submitted reports about local air quality conditions, including photos/videos.

### Key Fields
- **userId**: Reference to the user who submitted the report
- **media**: Photo or video file information (type, URL, filename, size)
- **location**: GPS coordinates, address, city, province
- **description**: Optional text description of conditions
- **verified**: Boolean indicating if report has been verified by officials
- **status**: Current status (pending, under_review, verified, rejected, archived)
- **airQualityData**: Optional AQI and pollutant measurements
- **visibility, severity**: Categorization of conditions

### Features
- Geospatial indexing for location-based queries
- Support for comments and flags
- Engagement metrics (views, likes)
- Virtual field for `timeAgo` display
- Soft delete capability

### Sample Data Structure
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "media": {
    "type": "image",
    "url": "https://storage.example.com/reports/image123.jpg",
    "filename": "smog_report.jpg",
    "size": 2048576,
    "mimeType": "image/jpeg"
  },
  "location": {
    "useCurrentLocation": true,
    "address": "University Town, Peshawar",
    "coordinates": {
      "latitude": 34.0151,
      "longitude": 71.5249
    },
    "city": "Peshawar",
    "province": "Khyber Pakhtunkhwa"
  },
  "description": "Heavy smog in the morning. Visibility reduced significantly.",
  "verified": false,
  "status": "pending",
  "visibility": "poor",
  "severity": "moderate"
}
```

---

## AQI Station Schema

**File:** `src/models/AQIStation.js`

### Purpose
Stores information about private and public air quality monitoring stations submitted by citizens.

### Key Fields
- **submittedBy**: Reference to user who submitted the station
- **stationName**: Optional name for the station
- **model**: Device model (e.g., "PurpleAir")
- **location**: GPS coordinates, address, city, province
- **stationType**: private, government, community, or research
- **verified**: Boolean indicating if station has been verified
- **status**: Current status (pending, under_review, approved, rejected, inactive)
- **technicalDetails**: Manufacturer, sensors, calibration dates
- **dataFeed**: API information for automatic data collection
- **currentReadings**: Latest air quality measurements

### Features
- Geospatial indexing for location-based queries
- Support for multiple sensor types
- Maintenance record tracking
- API integration for automated data collection
- Soft delete capability

### Sample Data Structure
```json
{
  "submittedBy": "507f1f77bcf86cd799439011",
  "stationName": "University Town Monitor",
  "model": "PurpleAir PA-II",
  "location": {
    "coordinates": {
      "latitude": 34.0151,
      "longitude": 71.5249
    },
    "address": "University Town, Peshawar",
    "city": "Peshawar",
    "province": "Khyber Pakhtunkhwa"
  },
  "stationType": "private",
  "verified": false,
  "status": "pending",
  "technicalDetails": {
    "manufacturer": "PurpleAir",
    "sensors": [
      {
        "type": "PM2.5",
        "accuracy": "±10%",
        "unit": "μg/m³"
      }
    ]
  }
}
```

---

## Health Guidance Schema

**File:** `src/models/HealthGuidance.js`

### Purpose
Stores health guidance and recommendations for different AQI levels and population groups.

### Key Fields
- **title, content**: Main guidance text
- **translations**: Urdu translations
- **aqiRange**: Min and max AQI values this guidance applies to
- **category**: Target group (general, children, elderly, etc.)
- **severity**: Air quality severity level
- **recommendations**: List of recommended actions
- **precautions**: List of precautions to take
- **symptoms**: Warning symptoms to watch for

### Features
- Multilingual support (English and Urdu)
- AQI range-based filtering
- Category-based targeting
- Priority ordering

### Sample Data Structure
```json
{
  "title": "Moderate Air Quality - General Precautions",
  "content": "Air quality is acceptable for most people...",
  "aqiRange": {
    "min": 51,
    "max": 100
  },
  "category": "general",
  "severity": "moderate",
  "recommendations": [
    "Limit prolonged outdoor activities",
    "Keep windows closed during peak pollution hours"
  ],
  "precautions": [
    "Monitor air quality regularly",
    "Use air purifiers indoors"
  ]
}
```

---

## Policy Advisory Schema

**File:** `src/models/PolicyAdvisory.js`

### Purpose
Stores government policy advisories, alerts, and regulations related to air quality.

### Key Fields
- **title, description**: Advisory title and description
- **type**: alert, warning, advisory, policy, regulation, or announcement
- **severity**: low, medium, high, or critical
- **scope**: Geographic scope (national, provincial, city, etc.)
- **content**: Summary, details, recommendations, restrictions, actions
- **validFrom, validUntil**: Validity period
- **status**: draft, active, expired, cancelled, or archived
- **issuedBy**: Issuing authority information

### Features
- Geographic targeting (national, provincial, city-level)
- Time-based validity
- Version control
- Attachment support
- Notification tracking

### Sample Data Structure
```json
{
  "title": "Smog Alert - Lahore and Peshawar",
  "description": "High levels of air pollution expected...",
  "type": "alert",
  "severity": "high",
  "scope": {
    "level": "city",
    "cities": ["Lahore", "Peshawar"]
  },
  "content": {
    "summary": "Severe smog conditions expected for next 48 hours",
    "recommendations": [
      "Avoid outdoor activities",
      "Use N95 masks when going outside"
    ],
    "restrictions": [
      "Construction activities suspended",
      "Heavy vehicles banned from city center"
    ]
  },
  "validFrom": "2024-11-06T00:00:00Z",
  "validUntil": "2024-11-08T23:59:59Z",
  "status": "active"
}
```

---

## Notification Schema

**File:** `src/models/Notification.js`

### Purpose
Stores in-app notifications and tracks multi-channel notification delivery (email, SMS, push).

### Key Fields
- **userId**: Recipient user reference
- **type**: Notification type (aqi_alert, report_verified, etc.)
- **title, message**: Notification content
- **data**: Additional structured data
- **actionUrl, actionLabel**: Optional action button
- **priority**: low, medium, high, or urgent
- **isRead, readAt**: Read status tracking
- **channels**: Delivery status for each channel (in-app, email, SMS, push)

### Features
- Multi-channel delivery tracking
- Priority-based ordering
- Read/unread status
- Related entity linking
- Expiry support

### Sample Data Structure
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "type": "report_verified",
  "title": "Your Report Has Been Verified",
  "message": "Your smog report from University Town has been verified by officials.",
  "priority": "medium",
  "isRead": false,
  "channels": {
    "inApp": {
      "sent": true,
      "sentAt": "2024-11-06T10:30:00Z"
    },
    "email": {
      "sent": true,
      "sentAt": "2024-11-06T10:30:05Z"
    }
  },
  "relatedEntity": {
    "type": "report",
    "id": "507f1f77bcf86cd799439012"
  }
}
```

---

## Database Configuration

**File:** `src/config/database.js`

### Purpose
Handles MongoDB connection setup and management.

### Features
- Connection error handling
- Graceful shutdown
- Connection event logging

### Environment Variables Required
Add these to your `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/pakair
```

---

## Usage Instructions

### 1. Install Dependencies
```bash
npm install mongoose bcryptjs
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

### 3. Import Models in Your Application
```javascript
import { User, CitizenReport, AQIStation } from './src/models/index.js';
```

### 4. Connect to Database
```javascript
import connectDB from './src/config/database.js';

// Connect to MongoDB
await connectDB();
```

### 5. Use Models in Your Routes/Controllers
```javascript
// Create a new citizen report
const report = await CitizenReport.create({
  userId: req.user._id,
  media: {
    type: 'image',
    url: uploadedFileUrl,
    filename: file.originalname,
    size: file.size,
    mimeType: file.mimetype
  },
  location: {
    coordinates: {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    },
    city: req.body.city
  },
  description: req.body.description
});

// Find verified reports in a city
const reports = await CitizenReport.find({
  'location.city': 'Peshawar',
  verified: true
}).populate('userId', 'firstName lastName');
```

---

## Next Steps

1. **Implement Authentication**: Add bcrypt for password hashing and JWT for authentication
2. **Create Controllers**: Build controller functions for CRUD operations
3. **Set Up Routes**: Create Express routes for all endpoints
4. **Add Validation**: Implement request validation middleware
5. **File Upload**: Set up multer or similar for handling file uploads
6. **API Documentation**: Create Swagger/OpenAPI documentation

---

## Notes

- All schemas include `timestamps: true` which automatically adds `createdAt` and `updatedAt` fields
- Geospatial indexes are set up for location-based queries
- Soft delete is implemented where appropriate (isDeleted field)
- All schemas support population of referenced documents
- Validation is built into the schemas with custom error messages
