require('dotenv').config();
const { sequelize, User } = require('../models');

const migrate = async () => {
  try {
    console.log('Starting database migration...');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ All tables created successfully');

    // Create default owner account
    const owner = await User.create({
      name: 'Admin Owner',
      email: 'owner@food.com',
      password: 'owner123',
      role: 'owner'
    });
    console.log('✅ Default owner created:', owner.email);

    // Create default user account
    const user = await User.create({
      name: 'Test User',
      email: 'user@food.com',
      password: 'user123',
      role: 'user'
    });
    console.log('✅ Default user created:', user.email);

    console.log('\n✅ Migration completed successfully!');
    console.log('\nDefault Credentials:');
    console.log('Owner - Email: owner@food.com, Password: owner123');
    console.log('User - Email: user@food.com, Password: user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
