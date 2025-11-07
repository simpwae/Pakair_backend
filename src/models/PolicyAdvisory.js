import mongoose from 'mongoose';

const policyAdvisorySchema = new mongoose.Schema({
  // Title and description
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  
  // Advisory type
  type: {
    type: String,
    enum: ['alert', 'warning', 'advisory', 'policy', 'regulation', 'announcement'],
    required: true
  },
  
  // Severity/Priority
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Geographic scope
  scope: {
    level: {
      type: String,
      enum: ['national', 'provincial', 'city', 'district', 'local'],
      required: true
    },
    regions: [{
      type: String,
      trim: true
    }],
    cities: [{
      type: String,
      trim: true
    }],
    provinces: [{
      type: String,
      trim: true
    }]
  },
  
  // Content
  content: {
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    details: {
      type: String,
      required: true
    },
    recommendations: [{
      type: String,
      trim: true
    }],
    restrictions: [{
      type: String,
      trim: true
    }],
    actions: [{
      type: String,
      trim: true
    }]
  },
  
  // Validity period
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'cancelled', 'archived'],
    default: 'draft'
  },
  
  // Issuing authority
  issuedBy: {
    organization: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      trim: true
    },
    officialName: {
      type: String,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  
  // Related data
  relatedAQIData: {
    averageAQI: Number,
    peakAQI: Number,
    affectedAreas: [{
      name: String,
      aqi: Number
    }]
  },
  
  // Attachments
  attachments: [{
    filename: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'image', 'document', 'other']
    },
    size: Number
  }],
  
  // Tags for categorization
  tags: [{
    type: String,
    trim: true
  }],
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  },
  
  // Engagement
  views: {
    type: Number,
    default: 0
  },
  
  // Notifications sent
  notificationsSent: {
    email: {
      type: Number,
      default: 0
    },
    sms: {
      type: Number,
      default: 0
    },
    push: {
      type: Number,
      default: 0
    }
  },
  
  // Version control
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PolicyAdvisory'
  }],
  
  // Audit trail
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
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
  timestamps: true
});

// Indexes
policyAdvisorySchema.index({ status: 1, validFrom: -1 });
policyAdvisorySchema.index({ 'scope.level': 1, 'scope.cities': 1 });
policyAdvisorySchema.index({ type: 1, severity: 1 });
policyAdvisorySchema.index({ validFrom: 1, validUntil: 1 });
policyAdvisorySchema.index({ tags: 1 });

const PolicyAdvisory = mongoose.model('PolicyAdvisory', policyAdvisorySchema);

export default PolicyAdvisory;
