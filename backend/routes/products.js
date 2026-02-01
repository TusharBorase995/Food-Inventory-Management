const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Owner only routes
router.post('/', protect, authorize('owner'), upload.single('image'), createProduct);
router.put('/:id', protect, authorize('owner'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('owner'), deleteProduct);

module.exports = router;
