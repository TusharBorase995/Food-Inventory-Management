const { Product, Category, InventoryStock } = require('../models');
const fs = require('fs');
const path = require('path');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: InventoryStock,
          as: 'stock',
          attributes: ['current_quantity', 'min_threshold']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: InventoryStock,
          as: 'stock',
          attributes: ['current_quantity', 'min_threshold']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { category_id, name, description, price, stock_quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Create product
    const product = await Product.create({
      category_id,
      name,
      description,
      price,
      image
    });

    // Create initial inventory stock
    await InventoryStock.create({
      product_id: product.id,
      current_quantity: parseInt(stock_quantity) || 0,
      min_threshold: 10
    });

    // Fetch product with relations
    const productWithRelations = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: InventoryStock,
          as: 'stock'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: productWithRelations
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { category_id, name, description, price, stock_quantity } = req.body;
    
    // Check if category exists if category_id is provided
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const updateData = { category_id, name, description, price };

    // Handle image update
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(process.env.UPLOAD_PATH || './uploads', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = req.file.filename;
    }

    await product.update(updateData);

    // Update inventory stock if stock_quantity is provided
    if (stock_quantity !== undefined && stock_quantity !== null && stock_quantity !== '') {
      const quantity = parseInt(stock_quantity);
      
      if (!isNaN(quantity)) {
        // Check if stock record exists
        const existingStock = await InventoryStock.findOne({
          where: { product_id: product.id }
        });
        
        if (existingStock) {
          await existingStock.update({ current_quantity: quantity });
        } else {
          // Create stock record if it doesn't exist
          await InventoryStock.create({
            product_id: product.id,
            current_quantity: quantity,
            min_threshold: 10
          });
        }
      }
    }

    // Fetch updated product with relations
    const updatedProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: InventoryStock,
          as: 'stock'
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete image if exists
    if (product.image) {
      const imagePath = path.join(process.env.UPLOAD_PATH || './uploads', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
