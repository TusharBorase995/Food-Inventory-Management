const { User } = require('../models');

// Get all users (for owner)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const ownerCount = await User.count({ where: { role: 'owner' } });
    const customerCount = await User.count({ where: { role: 'user' } });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        ownerCount,
        customerCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
