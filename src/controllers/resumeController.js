import Resume from '../models/resume.js';
import User from '../models/user.js';

// Create resume (Smart Builder)
export const createResume = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    
    // Check and deduct credit
    const user = await User.findById(userId);
    await user.deductCredit();
    
    const resumeData = {
      userId,
      ...req.body
    };
    
    const resume = await Resume.create(resumeData);
    
    return res.status(201).json({
      message: 'Resume created successfully',
      resume,
      credits: user.credits
    });
  } catch (err) {
    console.error('Create Resume Error:', err);
    return res.status(500).json({
      message: err.message || 'Failed to create resume'
    });
  }
};


// Get all resumes for user
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 });
    
    return res.status(200).json({ resumes });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update resume
export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    Object.assign(resume, updates);
    await resume.save();
    
    return res.status(200).json({
      message: 'Resume updated successfully',
      resume
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await Resume.findByIdAndDelete(id);
    
    return res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Generate shareable link
export const generateShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    if (!resume.shareableLink) {
      resume.generateShareLink();
      await resume.save();
    }
    
    const shareUrl = `${process.env.FRONTEND_URL}/resume/${resume.shareableLink}`;
    
    return res.status(200).json({ 
      shareUrl,
      shareableLink: resume.shareableLink 
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Download resume (increment counter)
export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    await Resume.findByIdAndUpdate(id, {
      $inc: { downloadCount: 1 }
    });
    
    return res.status(200).json({ message: 'Download count updated' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
