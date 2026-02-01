const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAllOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, createOrder);

// Owner only route
router.put('/:id/status', protect, authorize('owner'), updateOrderStatus);

module.exports = router;
