import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true },
  
  // Resume content
  personalInfo: {
    fullName: String,
    title: String,
    phone: String,
    email: String,
    location: String,
    website: String,
    linkedin: String,
    profileImage: String
  },
  
  summary: { type: String },    
  
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String,
  }],
  
  education: [{
    institution: String,
    degree: String,
    startDate: Date,
    endDate: Date,
    description: String,
    grade: String
  }],
  
  skills: [{
    items: [String]
  }],
  
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String,
    startDate: Date,
    endDate: Date
  }],
  
  certifications: [{
    title: String,
    organization: String,
    issueDate: Date,
    link: String
  }],
  
  // Metadata
  builderType: { 
    type: String, 
    enum: ['ai', 'smart'], 
    required: true 
  },
  
  aiPrompt: { type: String }, // Store original AI prompt if AI-generated
  
  status: { 
    type: String, 
    enum: ['draft', 'completed'], 
    default: 'draft' 
  },
  
  shareableLink: { type: String, unique: true, sparse: true },
  downloadCount: { type: Number, default: 0 },
  
}, { timestamps: true });

// Generate unique shareable link
resumeSchema.methods.generateShareLink = function() {
  const uniqueId = this._id.toString().slice(-8);
  this.shareableLink = `${uniqueId}-${Date.now().toString(36)}`;
  return this.shareableLink;
};

export default mongoose.model('Resume', resumeSchema);