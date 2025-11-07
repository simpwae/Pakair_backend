import mongoose from 'mongoose';

const healthGuidanceSchema = new mongoose.Schema({
  // Title and content
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  
  // Multilingual support
  translations: {
    urdu: {
      title: String,
      content: String
    }
  },
  
  // AQI range this guidance applies to
  aqiRange: {
    min: {
      type: Number,
      required: true,
      min: 0,
      max: 500
    },
    max: {
      type: Number,
      required: true,
      min: 0,
      max: 500
    }
  },
  
  // Category
  category: {
    type: String,
    enum: ['general', 'children', 'elderly', 'pregnant', 'respiratory', 'cardiovascular', 'outdoor_activities'],
    required: true
  },
  
  // Severity level
  severity: {
    type: String,
    enum: ['good', 'moderate', 'unhealthy_sensitive', 'unhealthy', 'very_unhealthy', 'hazardous'],
    required: true
  },
  
  // Recommendations
  recommendations: [{
    type: String,
    trim: true
  }],
  
  // Precautions
  precautions: [{
    type: String,
    trim: true
  }],
  
  // Symptoms to watch for
  symptoms: [{
    type: String,
    trim: true
  }],
  
  // Icon or image
  icon: {
    type: String,
    trim: true
  },
  
  // Priority (for ordering)
  priority: {
    type: Number,
    default: 0
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Created by (official/admin)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Last updated by
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
healthGuidanceSchema.index({ severity: 1, category: 1 });
healthGuidanceSchema.index({ 'aqiRange.min': 1, 'aqiRange.max': 1 });
healthGuidanceSchema.index({ isActive: 1, priority: -1 });

const HealthGuidance = mongoose.model('HealthGuidance', healthGuidanceSchema);

export default HealthGuidance;
