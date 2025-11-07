import mongoose from 'mongoose';

const citizenReportSchema = new mongoose.Schema({
  // User who submitted the report
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Media files (photo or video)
  media: {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: [true, 'Media URL is required']
    },
    filename: {
      type: String,
      required: true
    },
    size: {
      type: Number, // in bytes
      max: [20971520, 'File size cannot exceed 20MB'] // 20MB in bytes
    },
    mimeType: {
      type: String,
      required: true
    }
  },
  
  // Location information
  location: {
    useCurrentLocation: {
      type: Boolean,
      default: true
    },
    address: {
      type: String,
      trim: true
    },
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
    city: {
      type: String,
      trim: true
    },
    province: {
      type: String,
      trim: true
    }
  },
  
  // Description of conditions
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Report metadata
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
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
    trim: true
  },
  
  // Report status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'verified', 'rejected', 'archived'],
    default: 'pending'
  },
  
  // Air quality data (if available)
  airQualityData: {
    aqi: {
      type: Number,
      min: 0,
      max: 500
    },
    pm25: Number,
    pm10: Number,
    temperature: Number,
    humidity: Number,
    timestamp: Date
  },
  
  // Visibility and severity
  visibility: {
    type: String,
    enum: ['clear', 'moderate', 'poor', 'very_poor', 'hazardous'],
    default: null
  },
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'severe', 'extreme'],
    default: null
  },
  
  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  flags: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Comments from officials or other users
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: 500
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tags for categorization
  tags: [{
    type: String,
    trim: true
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
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time ago
citizenReportSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Indexes for better query performance
citizenReportSchema.index({ userId: 1, createdAt: -1 });
citizenReportSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
citizenReportSchema.index({ verified: 1, status: 1 });
citizenReportSchema.index({ createdAt: -1 });
citizenReportSchema.index({ 'location.city': 1 });
citizenReportSchema.index({ 'location.province': 1 });

// Geospatial index for location-based queries
citizenReportSchema.index({ 'location.coordinates': '2dsphere' });

const CitizenReport = mongoose.model('CitizenReport', citizenReportSchema);

export default CitizenReport;
