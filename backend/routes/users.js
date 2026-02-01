const express = require('express');
const router = express.Router();
const { getAllUsers, getUserStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Owner only routes
router.get('/', protect, authorize('owner'), getAllUsers);
router.get('/stats', protect, authorize('owner'), getUserStats);

module.exports = router;
