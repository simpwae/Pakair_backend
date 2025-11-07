import mongoose from 'mongoose';

const aqiStationSchema = new mongoose.Schema({
  // User who submitted the station
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Station information
  stationName: {
    type: String,
    trim: true,
    maxlength: [100, 'Station name cannot exceed 100 characters']
  },
  
  model: {
    type: String,
    required: [true, 'Station model is required'],
    trim: true,
    maxlength: [100, 'Model name cannot exceed 100 characters']
  },
  
  // Location
  location: {
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    province: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      default: 'Pakistan'
    }
  },
  
  // Station type
  stationType: {
    type: String,
    enum: ['private', 'government', 'community', 'research'],
    default: 'private'
  },
  
  // Verification status
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verificationNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Verification notes cannot exceed 500 characters']
  },
  
  // Station status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
  
  // Technical details
  technicalDetails: {
    manufacturer: {
      type: String,
      trim: true
    },
    serialNumber: {
      type: String,
      trim: true
    },
    installationDate: {
      type: Date
    },
    lastCalibrationDate: {
      type: Date
    },
    nextCalibrationDate: {
      type: Date
    },
    sensors: [{
      type: {
        type: String,
        enum: ['PM2.5', 'PM10', 'CO2', 'NO2', 'SO2', 'O3', 'CO', 'Temperature', 'Humidity']
      },
      accuracy: String,
      unit: String
    }]
  },
  
  // Data feed information
  dataFeed: {
    apiUrl: {
      type: String,
      trim: true
    },
    apiKey: {
      type: String,
      trim: true,
      select: false // Don't return API key by default
    },
    updateFrequency: {
      type: Number, // in minutes
      default: 15
    },
    lastDataUpdate: {
      type: Date
    },
    dataFormat: {
      type: String,
      enum: ['json', 'xml', 'csv'],
      default: 'json'
    }
  },
  
  // Current readings (latest data)
  currentReadings: {
    aqi: {
      type: Number,
      min: 0,
      max: 500
    },
    pm25: Number,
    pm10: Number,
    co2: Number,
    no2: Number,
    so2: Number,
    o3: Number,
    co: Number,
    temperature: Number,
    humidity: Number,
    timestamp: Date
  },
  
  // Station metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false // Whether data is publicly accessible
  },
  
  // Contact information
  contactInfo: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  
  // Additional notes
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  // Maintenance records
  maintenanceRecords: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['calibration', 'repair', 'inspection', 'upgrade', 'other'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cost: Number
  }],
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for station display name
aqiStationSchema.virtual('displayName').get(function() {
  return this.stationName || `${this.model} Station`;
});

// Indexes
aqiStationSchema.index({ submittedBy: 1 });
aqiStationSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
aqiStationSchema.index({ verified: 1, status: 1 });
aqiStationSchema.index({ isActive: 1 });
aqiStationSchema.index({ 'location.city': 1 });
aqiStationSchema.index({ 'location.province': 1 });
aqiStationSchema.index({ createdAt: -1 });

// Geospatial index
aqiStationSchema.index({ 'location.coordinates': '2dsphere' });

const AQIStation = mongoose.model('AQIStation', aqiStationSchema);

export default AQIStation;
