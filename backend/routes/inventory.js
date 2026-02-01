const express = require('express');
const router = express.Router();
const {
  getAllStocks,
  getLowStockItems,
  updateStock
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

// Owner only routes
router.get('/', protect, authorize('owner'), getAllStocks);
router.get('/low-stock', protect, authorize('owner'), getLowStockItems);
router.put('/update', protect, authorize('owner'), updateStock);

module.exports = router;
