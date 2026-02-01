const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// Owner only route
router.get('/stats', protect, authorize('owner'), getDashboardStats);

module.exports = router;
