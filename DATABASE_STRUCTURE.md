# PakAir Database Structure

## 🗄️ Database Overview

**Database Name**: `pakair`  
**Total Collections**: 6  
**Primary Collection**: `citizenreports`

---

## 📊 Collections & Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                         PAKAIR DATABASE                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│      USERS       │  ← Main user accounts (citizens & officials)
├──────────────────┤
│ _id              │
│ firstName        │
│ lastName         │
│ email (unique)   │
│ phone            │
│ password         │
│ role             │
│ location         │
│ preferences      │
└────────┬─────────┘
         │
         │ Referenced by (userId)
         │
    ┌────┴────┬────────────┬──────────────┬──────────────┐
    │         │            │              │              │
    ▼         ▼            ▼              ▼              ▼
┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐
│ CITIZEN │ │   AQI    │ │  HEALTH   │ │  POLICY  │ │  NOTIF.  │
│ REPORTS │ │ STATIONS │ │ GUIDANCE  │ │ ADVISORY │ │          │
├─────────┤ ├──────────┤ ├───────────┤ ├──────────┤ ├──────────┤
│ userId  │ │submitted │ │ createdBy │ │ issuedBy │ │ userId   │
│ media   │ │ By       │ │ content   │ │ content  │ │ type     │
│location │ │ model    │ │ aqiRange  │ │ scope    │ │ message  │
│verified │ │ location │ │ category  │ │ severity │ │ channels │
└─────────┘ └──────────┘ └───────────┘ └──────────┘ └──────────┘
```

---

## 📋 Collection Details

### 1. Users Collection
```
Collection: users
Purpose: Store all user accounts (citizens and officials)
Indexes: email, phone, createdAt
```

**Document Structure:**
```json
{
  "_id": ObjectId,
  "firstName": String,
  "lastName": String,
  "email": String (unique),
  "phone": String,
  "password": String (hashed),
  "role": "citizen" | "official",
  "location": {
    "city": String,
    "province": String,
    "coordinates": {
      "latitude": Number,
      "longitude": Number
    }
  },
  "preferences": {
    "language": "English" | "Urdu",
    "notifications": {
      "email": Boolean,
      "sms": Boolean,
      "push": Boolean
    }
  },
  "isVerified": Boolean,
  "isActive": Boolean,
  "lastLogin": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

### 2. CitizenReports Collection ⭐ PRIMARY
```
Collection: citizenreports
Purpose: Store citizen-submitted air quality reports
Indexes: userId, location (geospatial), verified, status, createdAt
```

**Document Structure:**
```json
{
  "_id": ObjectId,
  "userId": ObjectId → users._id,
  "media": {
    "type": "image" | "video",
    "url": String,
    "filename": String,
    "size": Number,
    "mimeType": String
  },
  "location": {
    "useCurrentLocation": Boolean,
    "address": String,
    "coordinates": {
      "latitude": Number,
      "longitude": Number
    },
    "city": String,
    "province": String
  },
  "description": String,
  "title": String,
  "verified": Boolean,
  "verifiedBy": ObjectId → users._id,
  "verifiedAt": Date,
  "status": "pending" | "under_review" | "verified" | "rejected" | "archived",
  "airQualityData": {
    "aqi": Number,
    "pm25": Number,
    "pm10": Number,
    "temperature": Number,
    "humidity": Number
  },
  "visibility": "clear" | "moderate" | "poor" | "very_poor" | "hazardous",
  "severity": "low" | "moderate" | "high" | "severe" | "extreme",
  "views": Number,
  "likes": Number,
  "comments": [
    {
      "userId": ObjectId → users._id,
      "text": String,
      "timestamp": Date
    }
  ],
  "tags": [String],
  "isDeleted": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

### 3. AQIStations Collection
```
Collection: aqistations
Purpose: Store private air quality monitoring stations
Indexes: submittedBy, location (geospatial), verified, status
```

**Document Structure:**
```json
{
  "_id": ObjectId,
  "submittedBy": ObjectId → users._id,
  "stationName": String,
  "model": String,
  "location": {
    "coordinates": {
      "latitude": Number,
      "longitude": Number
    },
    "address": String,
    "city": String,
    "province": String,
    "country": String
  },
  "stationType": "private" | "government" | "community" | "research",
  "verified": Boolean,
  "verifiedBy": ObjectId → users._id,
  "verifiedAt": Date,
  "status": "pending" | "under_review" | "approved" | "rejected" | "inactive",
  "technicalDetails": {
    "manufacturer": String,
    "serialNumber": String,
    "installationDate": Date,
    "sensors": [
      {
        "type": "PM2.5" | "PM10" | "CO2" | "NO2" | "SO2" | "O3" | "CO",
        "accuracy": String,
        "unit": String
      }
    ]
  },
  "dataFeed": {
    "apiUrl": String,
    "apiKey": String,
    "updateFrequency": Number,
    "lastDataUpdate": Date
  },
  "currentReadings": {
    "aqi": Number,
    "pm25": Number,
    "pm10": Number,
    "temperature": Number,
    "humidity": Number,
    "timestamp": Date
  },
  "isActive": Boolean,
  "isPublic": Boolean,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

### 4. HealthGuidance Collection
```
Collection: healthguidances
Purpose: Store health recommendations for different AQI levels
Indexes: severity, category, aqiRange, isActive
```

**Document Structure:**
```json
{
  "_id": ObjectId,
  "title": String,
  "content": String,
  "translations": {
    "urdu": {
      "title": String,
      "content": String
    }
  },
  "aqiRange": {
    "min": Number,
    "max": Number
  },
  "category": "general" | "children" | "elderly" | "pregnant" | "respiratory",
  "severity": "good" | "moderate" | "unhealthy_sensitive" | "unhealthy" | "very_unhealthy" | "hazardous",
  "recommendations": [String],
  "precautions": [String],
  "symptoms": [String],
  "icon": String,
  "priority": Number,
  "isActive": Boolean,
  "createdBy": ObjectId → users._id,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

### 5. PolicyAdvisory Collection
```
Collection: policyadvisories
Purpose: Store government alerts and policy advisories
Indexes: status, validFrom, scope.level, type, severity
```

**Document Structure:**
```json
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "type": "alert" | "warning" | "advisory" | "policy" | "regulation" | "announcement",
  "severity": "low" | "medium" | "high" | "critical",
  "scope": {
    "level": "national" | "provincial" | "city" | "district" | "local",
    "regions": [String],
    "cities": [String],
    "provinces": [String]
  },
  "content": {
    "summary": String,
    "details": String,
    "recommendations": [String],
    "restrictions": [String],
    "actions": [String]
  },
  "validFrom": Date,
  "validUntil": Date,
  "status": "draft" | "active" | "expired" | "cancelled" | "archived",
  "issuedBy": {
    "organization": String,
    "department": String,
    "officialName": String,
    "userId": ObjectId → users._id
  },
  "relatedAQIData": {
    "averageAQI": Number,
    "peakAQI": Number,
    "affectedAreas": [
      {
        "name": String,
        "aqi": Number
      }
    ]
  },
  "attachments": [
    {
      "filename": String,
      "url": String,
      "type": "pdf" | "image" | "document",
      "size": Number
    }
  ],
  "tags": [String],
  "isPublic": Boolean,
  "views": Number,
  "version": Number,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

### 6. Notifications Collection
```
Collection: notifications
Purpose: Track all user notifications across channels
Indexes: userId, isRead, type, priority
```

**Document Structure:**
```json
{
  "_id": ObjectId,
  "userId": ObjectId → users._id,
  "type": "aqi_alert" | "report_verified" | "report_rejected" | "station_approved" | "policy_advisory",
  "title": String,
  "message": String,
  "data": Object,
  "actionUrl": String,
  "actionLabel": String,
  "priority": "low" | "medium" | "high" | "urgent",
  "isRead": Boolean,
  "readAt": Date,
  "channels": {
    "inApp": {
      "sent": Boolean,
      "sentAt": Date
    },
    "email": {
      "sent": Boolean,
      "sentAt": Date,
      "error": String
    },
    "sms": {
      "sent": Boolean,
      "sentAt": Date,
      "error": String
    },
    "push": {
      "sent": Boolean,
      "sentAt": Date,
      "error": String
    }
  },
  "relatedEntity": {
    "type": "report" | "station" | "advisory" | "user",
    "id": ObjectId
  },
  "expiresAt": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## 🔗 Relationships Diagram

```
┌──────────┐
│  USERS   │
└────┬─────┘
     │
     │ 1:N (One user can have many reports)
     │
     ├─────────────────────────────────────────┐
     │                                         │
     ▼                                         ▼
┌──────────────┐                      ┌──────────────┐
│CITIZEN       │                      │AQI           │
│REPORTS       │                      │STATIONS      │
│              │                      │              │
│userId ───────┼──────────────────────┤submittedBy   │
│verifiedBy ───┼──┐                   │verifiedBy ───┼──┐
└──────────────┘  │                   └──────────────┘  │
                  │                                     │
                  │ N:1 (Many reports verified by one official)
                  │                                     │
                  └─────────────┬───────────────────────┘
                                │
                                ▼
                          ┌──────────┐
                          │  USERS   │
                          │(Official)│
                          └──────────┘
```

---

## 📈 Index Strategy

### Performance Indexes

**Users Collection:**
```javascript
{ email: 1 }           // Unique index for login
{ phone: 1 }           // Index for phone lookup
{ createdAt: -1 }      // Sort by registration date
```

**CitizenReports Collection:**
```javascript
{ userId: 1, createdAt: -1 }                    // User's reports
{ 'location.coordinates': '2dsphere' }          // Geospatial queries
{ verified: 1, status: 1 }                      // Filter by status
{ 'location.city': 1 }                          // City-based queries
{ 'location.province': 1 }                      // Province-based queries
```

**AQIStations Collection:**
```javascript
{ submittedBy: 1 }                              // User's stations
{ 'location.coordinates': '2dsphere' }          // Geospatial queries
{ verified: 1, status: 1 }                      // Filter by status
{ 'location.city': 1 }                          // City-based queries
```

**Notifications Collection:**
```javascript
{ userId: 1, isRead: 1, createdAt: -1 }        // User's notifications
{ type: 1, priority: 1 }                        // Filter by type
{ expiresAt: 1 }                                // Cleanup expired
```

---

## 🔍 Common Query Patterns

### 1. Get User's Reports
```javascript
db.citizenreports.find({ userId: ObjectId("...") })
  .sort({ createdAt: -1 })
  .limit(10)
```

### 2. Get Verified Reports in a City
```javascript
db.citizenreports.find({
  'location.city': 'Peshawar',
  verified: true,
  status: 'verified'
})
```

### 3. Get Reports Near Location (5km radius)
```javascript
db.citizenreports.find({
  'location.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [71.5249, 34.0151] // [lng, lat]
      },
      $maxDistance: 5000 // meters
    }
  }
})
```

### 4. Get Active Policy Advisories for a City
```javascript
db.policyadvisories.find({
  status: 'active',
  'scope.cities': 'Peshawar',
  validFrom: { $lte: new Date() },
  $or: [
    { validUntil: { $gte: new Date() } },
    { validUntil: null }
  ]
})
```

### 5. Get Unread Notifications for User
```javascript
db.notifications.find({
  userId: ObjectId("..."),
  isRead: false
})
.sort({ priority: -1, createdAt: -1 })
```

---

## 💾 Storage Estimates

### Average Document Sizes
- **User**: ~1 KB
- **CitizenReport**: ~2-5 KB (without media file)
- **AQIStation**: ~3 KB
- **HealthGuidance**: ~2 KB
- **PolicyAdvisory**: ~3 KB
- **Notification**: ~1 KB

### Estimated Storage (1 year, 10,000 users)
```
Users:              10,000 × 1 KB    = 10 MB
Reports:           100,000 × 3 KB    = 300 MB
Stations:            1,000 × 3 KB    = 3 MB
Health Guidance:       100 × 2 KB    = 0.2 MB
Policy Advisories:     500 × 3 KB    = 1.5 MB
Notifications:     500,000 × 1 KB    = 500 MB
                                      --------
Total Database:                       ~815 MB

Media Files (separate storage):
Reports (images):  100,000 × 2 MB    = 200 GB
```

---

## 🔐 Security Considerations

### Field-Level Security
- ✅ Passwords: Never returned in queries (select: false)
- ✅ API Keys: Protected (select: false)
- ✅ Email: Validated and lowercased
- ✅ Phone: Validated format

### Access Control
- ✅ Citizens can only edit their own reports
- ✅ Officials can verify reports
- ✅ Only admins can create health guidance
- ✅ Only officials can issue policy advisories

### Data Validation
- ✅ All required fields enforced
- ✅ Email format validation
- ✅ File size limits (20MB)
- ✅ Coordinate range validation
- ✅ Enum validation for status fields

---

## 📊 Database Statistics Commands

```javascript
// Get collection stats
db.citizenreports.stats()

// Count documents
db.citizenreports.countDocuments()

// Get indexes
db.citizenreports.getIndexes()

// Analyze query performance
db.citizenreports.find({ verified: true }).explain("executionStats")
```

---

## 🎯 Summary

**Total Collections**: 6  
**Total Indexes**: 20+  
**Geospatial Indexes**: 2 (reports, stations)  
**Unique Indexes**: 1 (user email)  
**Relationships**: 10+ references between collections  

**Primary Data Flow**: User → CitizenReport → Verification → Notification

---

**Database Structure Complete! ✅**
