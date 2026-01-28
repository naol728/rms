# Restaurant Management System - Complete Database Integration

A full-stack restaurant management system with React frontend and PHP/MySQL backend, featuring real-time database integration for all operations.

## 🚀 Features

### ✅ Fully Database Integrated
- **User Registration & Authentication**: All users saved to database with secure password hashing
- **Menu Management**: Add, edit, delete menu items - all saved to database
- **Shopping Cart**: Persistent cart stored in database per user
- **Categories**: Dynamic categories managed through database
- **Orders**: Complete order management with database persistence
- **Dashboard**: Real-time statistics from database
- **Admin Control**: Full administrative oversight of all operations

### 🔐 Security Features
- **Password Security**: bcrypt hashing, password change functionality
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and Staff roles with different permissions
- **Activity Logging**: All actions logged to database for audit trail

### 📊 Real-time Data
- **Live Dashboard**: Statistics updated from database
- **Order Tracking**: Real-time order status updates
- **Inventory Management**: Stock levels tracked in database
- **Staff Management**: User roles and permissions managed in database

## 🛠️ Installation & Setup

### Prerequisites
- PHP 7.4+ with MySQL extension
- MySQL 5.7+ or MariaDB 10.3+
- Node.js 16+ and npm
- Apache or Nginx web server

### 1. Database Setup

#### Option A: Automatic Setup (Recommended)
```bash
# Run the setup script
php setup_database.php
```

#### Option B: Manual Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE restaurant_management;
USE restaurant_management;

# Import schema
mysql -u root -p restaurant_management < database_schema_complete.sql
```

### 2. Configuration

Update `config.php` with your database credentials:
```php
<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'restaurant_management');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
?>
```

### 3. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Backend Setup
Ensure your web server is configured to serve PHP files and handle the `.htaccess` routing.

## 🎯 Default Login Credentials

### Admin Account
- **Email**: admin@restaurant.com
- **Password**: admin123
- **Role**: Administrator (full access)

### Staff Account
- **Email**: staff@restaurant.com
- **Password**: staff123
- **Role**: Staff (limited access)

## 📁 Project Structure

```
restaurant-management-system/
├── api/                          # PHP API endpoints
│   ├── auth/                    # Authentication endpoints
│   ├── menu/                    # Menu management endpoints
│   ├── cart/                    # Shopping cart endpoints
│   ├── orders/                  # Order management endpoints
│   ├── categories/              # Category management endpoints
│   ├── dashboard/               # Dashboard statistics endpoints
│   └── middleware/              # Authentication middleware
├── src/                         # React frontend
│   ├── components/              # React components
│   ├── services/                # API service classes
│   └── styles/                  # CSS styles
├── config.php                   # Database configuration
├── index.php                    # Main entry point
├── .htaccess                    # URL rewriting rules
├── database_schema_complete.sql  # Complete database schema
└── setup_database.php           # Database setup script
```

## 🔄 Database Integration Details

### User Management
- **Registration**: New users saved to `users` table with hashed passwords
- **Authentication**: JWT tokens with database user validation
- **Password Changes**: Secure password update with old password verification

### Menu Management
- **Menu Items**: All CRUD operations saved to `menu_items` table
- **Categories**: Dynamic categories managed in `categories` table
- **Availability**: Real-time availability status updates

### Shopping Cart
- **Persistent Cart**: Cart items stored in `cart` table per user
- **Real-time Updates**: Cart changes immediately saved to database
- **Cross-session**: Cart persists across browser sessions

### Order Management
- **Order Creation**: Orders saved to `orders` table with items in `order_items`
- **Status Tracking**: Order status updates saved to database
- **Payment Tracking**: Payment status and method stored

### Dashboard Analytics
- **Real-time Stats**: All statistics calculated from database
- **Recent Orders**: Live order data from database
- **Top Items**: Best-selling items calculated from order history

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password

### Menu Management
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item
- `PUT /api/menu/{id}` - Update menu item
- `DELETE /api/menu/{id}` - Delete menu item

### Cart Management
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item quantity
- `DELETE /api/cart/{id}` - Remove item from cart

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1: Start React development server
npm run dev

# Terminal 2: Start PHP development server (if needed)
php -S localhost:8000
```

### Production Mode
1. Build React app: `npm run build`
2. Configure web server to serve PHP and static files
3. Ensure `.htaccess` is properly configured

## 🔒 Security Considerations

### Password Security
- All passwords hashed using bcrypt
- Password change requires current password verification
- Strong password requirements enforced

### Authentication
- JWT tokens for stateless authentication
- Token expiration handling
- Role-based access control

### Data Protection
- SQL injection prevention with prepared statements
- XSS protection with proper input sanitization
- CSRF protection implemented

## 📊 Database Schema

The system includes comprehensive tables:
- `users` - User accounts and authentication
- `categories` - Menu categories
- `menu_items` - Menu items with pricing and availability
- `cart` - User shopping carts
- `orders` - Order management
- `order_items` - Individual order items
- `tables` - Restaurant table management
- `inventory` - Inventory tracking
- `activity_logs` - Audit trail for all actions

## 🎯 Key Benefits

1. **Real-time Data**: All operations immediately saved to database
2. **Persistent State**: Cart and user data persists across sessions
3. **Admin Control**: Complete oversight of all system operations
4. **Scalable**: Database-driven architecture supports growth
5. **Secure**: Industry-standard security practices implemented
6. **Audit Trail**: All actions logged for compliance and debugging

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `config.php` credentials
   - Ensure MySQL service is running
   - Verify database exists

2. **API Endpoints Not Working**
   - Check `.htaccess` configuration
   - Verify web server supports URL rewriting
   - Check PHP error logs

3. **Cart Not Persisting**
   - Verify user is logged in
   - Check JWT token validity
   - Ensure cart API endpoints are accessible

### Support
For issues or questions, check the error logs and ensure all prerequisites are met.

---

**Note**: This system is now fully database-integrated with all operations saving to and fetching from the MySQL database in real-time.
