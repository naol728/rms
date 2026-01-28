# Restaurant Management System - Setup Guide

This guide will help you set up both the React frontend and PHP backend for the Restaurant Management System.

## Prerequisites

### For Backend (PHP + MySQL):
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- phpMyAdmin (optional, for database management)

### For Frontend (React):
- Node.js 16 or higher
- npm or pnpm package manager

## Backend Setup (PHP + MySQL)

### 1. Database Setup

1. **Create Database:**
   ```sql
   CREATE DATABASE restaurant_management;
   ```

2. **Import Database Schema:**
   - Open phpMyAdmin or MySQL command line
   - Import the file: `backend/database/schema.sql`
   - This will create all necessary tables and insert sample data

3. **Database Configuration:**
   - Edit `backend/config/database.php`
   - Update the database credentials:
   ```php
   private $host = 'localhost';
   private $db_name = 'restaurant_management';
   private $username = 'your_username';
   private $password = 'your_password';
   ```

### 2. Web Server Setup

#### Option A: Using XAMPP/WAMP/MAMP
1. Install XAMPP/WAMP/MAMP
2. Copy the `backend` folder to your web server's document root:
   - XAMPP: `C:\xampp\htdocs\`
   - WAMP: `C:\wamp64\www\`
   - MAMP: `/Applications/MAMP/htdocs/`
3. Start Apache and MySQL services
4. Access the API at: `http://localhost/backend/api/`

#### Option B: Using PHP Built-in Server (Development Only)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the PHP server:
   ```bash
   php -S localhost:8000
   ```
3. Access the API at: `http://localhost:8000/api/`

### 3. Test Backend API

Test the API endpoints:
- **Health Check:** `GET http://localhost/backend/api/menu/categories`
- **Login:** `POST http://localhost/backend/api/auth/login`
  ```json
  {
    "email": "admin@restaurant.com",
    "password": "admin123"
  }
  ```

## Frontend Setup (React)

### 1. Install Dependencies

Navigate to the React project directory:
```bash
cd restaurant-management-system
```

Install dependencies:
```bash
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env` file in the React project root:
```env
REACT_APP_API_URL=http://localhost/backend/api
```

**Note:** If using PHP built-in server, use:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

The React app will be available at: `http://localhost:5173`

## Default Login Credentials

### Admin Account:
- **Email:** admin@restaurant.com
- **Password:** admin123

### Staff Account:
- **Email:** staff@restaurant.com
- **Password:** staff123

## Project Structure

```
restaurant-management-system/
├── backend/                    # PHP Backend
│   ├── api/                   # API endpoints
│   │   ├── auth/             # Authentication endpoints
│   │   ├── menu/             # Menu management endpoints
│   │   ├── orders/           # Order management endpoints
│   │   ├── staff/            # Staff management endpoints
│   │   ├── inventory/        # Inventory management endpoints
│   │   ├── reports/          # Reports endpoints
│   │   └── dashboard/        # Dashboard endpoints
│   ├── config/               # Configuration files
│   ├── database/             # Database schema
│   └── middleware/           # Authentication middleware
├── restaurant-management-system/  # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service files
│   │   └── ...
│   └── ...
└── SETUP_GUIDE.md           # This file
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Menu Management
- `GET /menu` - Get all menu items
- `POST /menu` - Create menu item
- `GET /menu/{id}` - Get single menu item
- `PUT /menu/{id}` - Update menu item
- `DELETE /menu/{id}` - Delete menu item
- `GET /menu/categories` - Get categories

### Order Management
- `GET /orders` - Get all orders
- `POST /orders` - Create new order
- `GET /orders/{id}` - Get single order
- `PUT /orders/status` - Update order status

### Staff Management
- `GET /staff` - Get all staff
- `POST /staff` - Create staff member
- `PUT /staff/{id}` - Update staff member
- `DELETE /staff/{id}` - Delete staff member

### Reports
- `GET /reports/sales` - Sales report
- `GET /reports/inventory` - Inventory report
- `GET /dashboard/stats` - Dashboard statistics

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure the backend API URL is correct in the React app
   - Check that CORS headers are properly set in the PHP API

2. **Database Connection Issues:**
   - Verify MySQL is running
   - Check database credentials in `backend/config/database.php`
   - Ensure the database exists and schema is imported

3. **API Not Found (404):**
   - Check web server configuration
   - Ensure `.htaccess` file is present (if using Apache)
   - Verify the API URL path

4. **Authentication Issues:**
   - Check if the token is being stored correctly
   - Verify the API endpoints are accessible
   - Check browser console for errors

### Development Tips:

1. **Database Management:**
   - Use phpMyAdmin for easy database management
   - The schema includes sample data for testing

2. **API Testing:**
   - Use Postman or similar tools to test API endpoints
   - Check the browser's Network tab for API calls

3. **React Development:**
   - Use React Developer Tools browser extension
   - Check console for JavaScript errors
   - Hot reload should work automatically

## Production Deployment

### Backend:
1. Use a production web server (Apache/Nginx)
2. Configure SSL certificates
3. Set up proper database credentials
4. Enable error logging
5. Configure CORS for your domain

### Frontend:
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure the API URL for production
4. Set up proper routing for SPA

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the web server error logs
3. Verify all prerequisites are installed
4. Ensure all configuration files are correct

The system is designed to be fully functional with the provided setup. All UI components and functionality from the original React app are preserved while adding the PHP backend integration.
