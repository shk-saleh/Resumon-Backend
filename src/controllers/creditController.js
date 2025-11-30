import User from '../models/user.js';
import Activity from '../models/Activity.js';

// Get user credits
export const getUserCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    return res.status(200).json({
      credits: user.credits,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Use a credit
export const deductCredit = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);
    
    // Deduct credit for free users
    const updatedCredits = await user.deductCredit();
    
    return res.status(200).json({
      message: 'Credit deducted successfully',
      credits: updatedCredits
    });
    
  } catch (err) {
    if (err.message === 'Insufficient credits') {
      return res.status(403).json({
        message: 'Insufficient credits. Please upgrade to Pro!',
        needsUpgrade: true
      });
    }
    return res.status(500).json({ message: err.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {

    const userId = req.user._id;
    
    const totalResumes = await Resume.countDocuments({ userId });
    
    const totalDownloads = await Resume.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);
    
    const recentResumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
    
    return res.status(200).json({
      stats: {
        totalResumes,
        totalDownloads: totalDownloads[0]?.total || 0,
        successRate: '100%'
      },
      recentResumes
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
