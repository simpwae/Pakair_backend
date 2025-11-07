import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Recipient
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notification type
  type: {
    type: String,
    enum: [
      'aqi_alert',
      'report_verified',
      'report_rejected',
      'station_approved',
      'station_rejected',
      'policy_advisory',
      'health_alert',
      'system',
      'other'
    ],
    required: true
  },
  
  // Title and message
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Additional data
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Link/Action
  actionUrl: {
    type: String,
    trim: true
  },
  
  actionLabel: {
    type: String,
    trim: true
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  
  readAt: {
    type: Date,
    default: null
  },
  
  // Delivery channels
  channels: {
    inApp: {
      sent: {
        type: Boolean,
        default: true
      },
      sentAt: Date
    },
    email: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      error: String
    },
    sms: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      error: String
    },
    push: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      error: String
    }
  },
  
  // Related entity
  relatedEntity: {
    type: {
      type: String,
      enum: ['report', 'station', 'advisory', 'user', 'other']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  
  // Expiry
  expiresAt: {
    type: Date
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
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ 'relatedEntity.type': 1, 'relatedEntity.id': 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
