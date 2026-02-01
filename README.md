# Food Inventory Management System

A full-stack Food Inventory Management System with role-based access control (RBAC) featuring separate dashboards for Owners and Users.

## 🚀 Features

### Owner Dashboard (Admin)
- **Dashboard Overview**: View total orders, sold amount, pending orders, low stock alerts
- **Category Management**: Full CRUD operations with image upload
- **Product Management**: Full CRUD operations with image upload and category assignment
- **Inventory Management**: Track stock levels, set minimum thresholds, low stock alerts
- **Order Management**: View all orders, update order status

### User Dashboard
- **Product Catalog**: Browse available products with real-time stock levels
- **Shopping Cart**: Add/remove products, adjust quantities
- **Order Placement**: Place orders that automatically update inventory

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MySQL** - Database
- **Sequelize ORM** - Database modeling and queries
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Router** - Navigation

## 📊 Database Schema (10 Tables)

1. **Users** - User accounts with roles (owner/user)
2. **Categories** - Product categories with images
3. **Products** - Product details with pricing
4. **Inventory_Stock** - Real-time stock tracking
5. **Batches** - Product batches with expiry dates
6. **Suppliers** - Supplier information
7. **Orders** - Customer orders
8. **Order_Items** - Individual items in orders
9. **Transactions** - Stock movement history (in/out/waste)
10. **Feedback** - User feedback and reviews

## 📁 Project Structure

```
VS Project/
├── backend/
│   ├── config/
│   │   ├── database.js       # Database configuration
│   │   └── db.js             # Sequelize instance
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── inventoryController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT & RBAC middleware
│   │   └── upload.js         # File upload middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── InventoryStock.js
│   │   ├── Batch.js
│   │   ├── Supplier.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Transaction.js
│   │   ├── Feedback.js
│   │   └── index.js          # Model associations
│   ├── routes/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── inventory.js
│   │   └── dashboard.js
│   ├── scripts/
│   │   └── migrate.js        # Database migration script
│   ├── utils/
│   │   └── jwt.js            # JWT utilities
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout/
    │   │   │   └── AdminLayout.js
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.js
    │   │   │   └── Register.js
    │   │   ├── admin/
    │   │   │   └── Dashboard.js
    │   │   └── user/
    │   │       └── Dashboard.js
    │   ├── services/
    │   │   ├── api.js
    │   │   └── index.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=food_inventory
   DB_USER=root
   DB_PASSWORD=your_password
   
   # JWT
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   
   # Upload
   UPLOAD_PATH=./uploads
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE food_inventory;
   ```

5. **Run database migration (creates tables and default users)**
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file if needed:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   App will run on `http://localhost:3000`

## 👤 Default Accounts

After running the migration script, two default accounts are created:

### Owner Account
- **Email**: `owner@food.com`
- **Password**: `owner123`
- **Access**: Full admin dashboard

### User Account
- **Email**: `user@food.com`
- **Password**: `user123`
- **Access**: User catalog and ordering

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Categories (Owner only for CUD)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Owner)
- `PUT /api/categories/:id` - Update category (Owner)
- `DELETE /api/categories/:id` - Delete category (Owner)

### Products (Owner only for CUD)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Owner)
- `PUT /api/products/:id` - Update product (Owner)
- `DELETE /api/products/:id` - Delete product (Owner)

### Orders
- `GET /api/orders` - Get orders (All for owner, own for user)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order (Protected)
- `PUT /api/orders/:id/status` - Update order status (Owner)

### Inventory (Owner only)
- `GET /api/inventory` - Get all stock
- `GET /api/inventory/low-stock` - Get low stock items
- `PUT /api/inventory/update` - Update stock

### Dashboard (Owner only)
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Separate permissions for owner and user
- **Protected Routes**: Middleware to verify authentication and authorization
- **Input Validation**: Server-side validation for all inputs

## 📝 Key Features Implementation

### Automatic Inventory Management
- When an order is placed, inventory is automatically decremented
- Stock levels are validated before order placement
- Transaction records are created for audit trail

### Low Stock Alerts
- Owner dashboard highlights items below minimum threshold
- Real-time stock monitoring
- Customizable threshold per product

### Image Upload
- Support for category and product images
- File validation (type and size)
- Automatic cleanup of old images on update/delete

## 🎨 UI Design

- **Modern Design**: Clean, professional interface using Tailwind CSS
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Easy-to-use sidebar navigation for admin
- **Real-time Updates**: Immediate feedback on actions
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🚧 Next Steps & Enhancements

To extend this project, you can add:

1. **Admin Pages for Categories & Products**: Full CRUD UI pages
2. **Batch Management**: Track product batches and expiry dates
3. **Supplier Management**: Manage supplier information
4. **Reports & Analytics**: Sales reports, inventory reports
5. **Search & Filters**: Advanced product search and filtering
6. **User Profile**: Edit profile, change password
7. **Order History**: Detailed order history for users
8. **Notifications**: Real-time notifications for low stock, new orders
9. **Export Data**: Export reports to CSV/PDF
10. **Multi-language Support**: Internationalization

## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

### Frontend
```bash
cd frontend
npm run build
```

The build folder can be served with any static file server or deployed to services like Vercel, Netlify, etc.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Happy Coding! 🎉**