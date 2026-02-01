const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Owner only routes
router.post('/', protect, authorize('owner'), upload.single('image'), createCategory);
router.put('/:id', protect, authorize('owner'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize('owner'), deleteCategory);

module.exports = router;
