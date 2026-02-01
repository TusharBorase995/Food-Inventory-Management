const { Order, Product, InventoryStock, sequelize, Category, User } = require('../models');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Total categories
    const totalCategories = await Category.count();

    // Total products
    const totalProducts = await Product.count();

    // Total orders
    const totalOrders = await Order.count();

    // Delivered orders count
    const deliveredOrders = await Order.count({
      where: { status: 'delivered' }
    });

    // Total sold amount (only delivered orders)
    const soldAmountResult = await Order.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalSold']
      ],
      where: {
        status: 'delivered'
      },
      raw: true
    });
    const totalSoldAmount = soldAmountResult[0]?.totalSold || 0;

    // Pending orders count
    const pendingOrders = await Order.count({
      where: { status: 'pending' }
    });

    // Dispatched orders count
    const dispatchedOrders = await Order.count({
      where: { status: 'dispatched' }
    });

    // Low stock items count
    const lowStockCount = await InventoryStock.count({
      where: sequelize.where(
        sequelize.col('current_quantity'),
        '<=',
        sequelize.col('min_threshold')
      )
    });

    // Total users (customers)
    const totalUsers = await User.count({
      where: { role: 'user' }
    });

    // Recent orders
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        totalCategories,
        totalProducts,
        totalOrders,
        deliveredOrders,
        totalSoldAmount: parseFloat(totalSoldAmount),
        pendingOrders,
        dispatchedOrders,
        lowStockCount,
        totalUsers,
        recentOrders
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
