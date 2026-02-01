const { Order, OrderItem, Product, User, InventoryStock, Transaction } = require('../models');
const { sequelize } = require('../models');

// Get all orders (for owner) or user's orders
exports.getAllOrders = async (req, res) => {
  try {
    const whereClause = req.user.role === 'user' ? { user_id: req.user.id } : {};

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const whereClause = { id: req.params.id };
    
    // Users can only view their own orders
    if (req.user.role === 'user') {
      whereClause.user_id = req.user.id;
    }

    const order = await Order.findOne({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'image', 'price']
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items } = req.body; // items: [{ product_id, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate and calculate total amount
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      
      if (!product) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Product with id ${item.product_id} not found`
        });
      }

      // Check inventory
      const stock = await InventoryStock.findOne({
        where: { product_id: item.product_id },
        transaction: t
      });

      if (!stock || stock.current_quantity < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
      }

      const itemPrice = parseFloat(product.price);
      totalAmount += itemPrice * item.quantity;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: itemPrice
      });

      // Decrement inventory
      await stock.update(
        { current_quantity: stock.current_quantity - item.quantity },
        { transaction: t }
      );

      // Create transaction record
      await Transaction.create(
        {
          product_id: item.product_id,
          type: 'out',
          quantity: item.quantity
        },
        { transaction: t }
      );
    }

    // Create order
    const order = await Order.create(
      {
        user_id: req.user.id,
        total_amount: totalAmount,
        status: 'pending'
      },
      { transaction: t }
    );

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create(
        {
          order_id: order.id,
          ...item
        },
        { transaction: t }
      );
    }

    await t.commit();

    // Fetch complete order
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update order status (owner only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'dispatched', 'delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.update({ status });

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
