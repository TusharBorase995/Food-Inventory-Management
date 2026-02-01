const { InventoryStock, Product } = require('../models');

// Get all inventory stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await InventoryStock.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image', 'price']
        }
      ],
      order: [['current_quantity', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const { sequelize } = require('../models');
    
    const lowStockItems = await InventoryStock.findAll({
      where: sequelize.where(
        sequelize.col('current_quantity'),
        '<=',
        sequelize.col('min_threshold')
      ),
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image', 'price']
        }
      ],
      order: [['current_quantity', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  try {
    const { product_id, current_quantity, min_threshold } = req.body;

    const stock = await InventoryStock.findOne({
      where: { product_id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image', 'price']
        }
      ]
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock record not found'
      });
    }

    await stock.update({
      current_quantity: current_quantity !== undefined ? current_quantity : stock.current_quantity,
      min_threshold: min_threshold !== undefined ? min_threshold : stock.min_threshold
    });

    // Fetch updated stock with product details
    const updatedStock = await InventoryStock.findOne({
      where: { product_id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'image', 'price']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedStock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
