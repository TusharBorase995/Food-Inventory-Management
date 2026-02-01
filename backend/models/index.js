const sequelize = require('../config/db');

// Import all models
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const InventoryStock = require('./InventoryStock');
const Batch = require('./Batch');
const Supplier = require('./Supplier');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Transaction = require('./Transaction');
const Feedback = require('./Feedback');

// Define associations

// Category - Product (One to Many)
Category.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products',
  onDelete: 'CASCADE'
});
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

// Product - InventoryStock (One to One)
Product.hasOne(InventoryStock, {
  foreignKey: 'product_id',
  as: 'stock',
  onDelete: 'CASCADE'
});
InventoryStock.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// Product - Batch (One to Many)
Product.hasMany(Batch, {
  foreignKey: 'product_id',
  as: 'batches',
  onDelete: 'CASCADE'
});
Batch.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// Product - Transaction (One to Many)
Product.hasMany(Transaction, {
  foreignKey: 'product_id',
  as: 'transactions',
  onDelete: 'CASCADE'
});
Transaction.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// User - Order (One to Many)
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
  onDelete: 'CASCADE'
});
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Order - OrderItem (One to Many)
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Product - OrderItem (One to Many)
Product.hasMany(OrderItem, {
  foreignKey: 'product_id',
  as: 'orderItems',
  onDelete: 'CASCADE'
});
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// User - Feedback (One to Many)
User.hasMany(Feedback, {
  foreignKey: 'user_id',
  as: 'feedbacks',
  onDelete: 'CASCADE'
});
Feedback.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Export all models
module.exports = {
  sequelize,
  User,
  Category,
  Product,
  InventoryStock,
  Batch,
  Supplier,
  Order,
  OrderItem,
  Transaction,
  Feedback
};
