# Restaurant Management System - Quick Start Guide

## 🚀 One-Click Setup

This is a **unified project** where React frontend and PHP backend work together seamlessly!

### 📁 Project Structure
```
restaurant-management-system/
├── index.php              # Main entry point (serves React + API)
├── config.php             # Database configuration
├── schema.sql             # Database schema
├── api/                   # PHP API endpoints
├── src/                   # React frontend
├── public/                # Static assets
└── test_setup.php         # Setup test script
```

## ⚡ Quick Setup (3 Steps)

### Step 1: Database Setup
1. **Create MySQL database:**
   ```sql
   CREATE DATABASE restaurant_management;
   ```

2. **Import schema:**
   - Import `schema.sql` into your MySQL database
   - Or use phpMyAdmin to import the file

3. **Configure database:**
   - Edit `config.php` with your database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'restaurant_management');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   ```

### Step 2: Test Backend
1. **Visit test page:**
   ```
   http://localhost/test_setup.php
   ```
   - Should show all green checkmarks ✅
   - If not, fix database issues first

### Step 3: Start Frontend
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the app:**
   ```
   http://localhost:5173
   ```

## 🔑 Login Credentials
- **Admin:** admin@restaurant.com / admin123
- **Staff:** staff@restaurant.com / staff123

### 🔐 Password Security
- ✅ **Proper password validation** - Users must enter correct passwords
- ✅ **Password hashing** - All passwords are securely hashed
- ✅ **Password change** - Users can change passwords via "Change Password" button
- ✅ **Current password verification** - Must enter old password to change

## 🗄️ Complete Database Integration

### ✅ Everything Saves to Database
- **User Registration:** New staff/admin accounts saved to `users` table
- **Menu Management:** All menu items, categories saved to `menu_items`, `categories` tables
- **Shopping Cart:** User cart items saved to `cart` table
- **Orders:** All orders and order items saved to `orders`, `order_items` tables
- **Staff Management:** Admin can create/update/delete staff in `users` table
- **Inventory:** All inventory items saved to `inventory` table
- **Tables:** Restaurant tables saved to `tables` table
- **Reports:** Generated reports saved to `reports` table
- **Activity Logs:** All user actions logged to `activity_logs` table

### 🔄 Real-time Data Flow
1. **Frontend Action** → **API Call** → **Database Save** → **Frontend Update**
2. **Admin Changes** → **Database Update** → **All Users See Changes**
3. **Cart Items** → **Database Persistence** → **Survives Page Refresh**

## 🎯 How It Works

### Single Entry Point
- `index.php` serves both React app and API
- API requests go to `/api/*` 
- Everything else serves the React app
- No separate backend/frontend folders needed!

### API Integration
- React services automatically connect to `/api`
- Authentication works seamlessly
- Real-time data updates
- All CRUD operations working

## 🧪 Testing

1. **Test database connection:**
   ```
   http://localhost/test_setup.php
   ```

2. **Test complete database functionality:**
   ```
   http://localhost/test_database.php
   ```

3. **Test API endpoints:**
   ```
   http://localhost/api/menu
   http://localhost/api/dashboard/stats
   http://localhost/api/cart
   ```

4. **Test React app:**
   ```
   http://localhost:5173
   ```

## 🎯 Complete Feature List

### ✅ Admin Features (admin@restaurant.com)
- **User Management:** Create, update, delete staff members
- **Menu Management:** Add, edit, delete menu items and categories
- **Inventory Management:** Track stock levels, suppliers, costs
- **Table Management:** Configure restaurant tables
- **Order Management:** View and manage all orders
- **Reports:** Generate sales and inventory reports
- **Dashboard:** View comprehensive statistics
- **Password Management:** Change passwords securely

### ✅ Staff Features (staff@restaurant.com)
- **Menu Viewing:** See all available menu items
- **Order Taking:** Create and manage orders
- **Cart Management:** Add items to cart, place orders
- **Table Management:** View table status
- **Password Management:** Change passwords securely

### ✅ Customer Features (via Staff Interface)
- **Menu Browsing:** View menu with categories
- **Shopping Cart:** Add/remove items, view totals
- **Order Placement:** Place orders with special instructions
- **Order Tracking:** View order status

## 🛠️ Development

### Backend Development
- Edit files in `api/` folder
- Database config in `config.php`
- Test with `test_setup.php`

### Frontend Development
- Edit files in `src/` folder
- Hot reload with `npm run dev`
- All your original UI preserved!

## 🚨 Troubleshooting

### Database Issues
- Check `config.php` credentials
- Ensure MySQL is running
- Import `schema.sql` properly

### API Issues
- Check `test_setup.php` results
- Verify `.htaccess` is working
- Check web server error logs

### Frontend Issues
- Check browser console
- Verify API calls in Network tab
- Ensure `npm run dev` is running

## 🎉 Success!

If everything works, you'll see:
- ✅ Beautiful React frontend (your original design)
- ✅ Working PHP backend with MySQL
- ✅ Real-time data integration
- ✅ Complete restaurant management system

**This is a real, production-ready project!** 🚀
