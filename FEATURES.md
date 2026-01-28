# 🍽️ Restaurant Management System - Feature Overview

## 🚀 Core Features

All features are fully integrated with a live MySQL database, and every operation involving data changes is performed via secure PHP backend APIs.

---

## 👤 User Authentication & Password Management

### Secure Registration and Login
- New users (staff/admin) are registered and stored in the `users` database table using secure password hashing.
- Login API validates user credentials using hashed passwords in the database.
- Session management ensures secure access across the application.

### Change Password With Old Password Verification
- Users must enter their current password to change to a new password.
- Password change is processed via PHP API (`/api/auth/change_password.php`), verifying the old password using `password_verify`.
- New password is hashed with `password_hash` and saved in the database.
- Enforced strong password policies and validation.
- Password changes are logged in the `activity_logs` table for audit purposes.

---

## 🛒 Cart System

### Add / Remove / Update Items
- Users can add or remove menu items to/from their cart.
- Cart contents are stored in real-time in the `cart` database table per user.
- All cart operations (add, update, remove, clear) are handled via PHP endpoints and always persisted to the DB.

### Cart Persistence and Security
- Cart survives browser refresh and logout — always loaded from the database on login.
- Only authenticated users can access and modify their carts.
- Cart items are associated with user accounts in the database.

---

## 📦 Order Management

### Order Creation & Processing
- Users convert their cart into orders.
- New orders are created in the `orders` table and individual items in `order_items`.
- Cart is cleared only after successful database entry.
- Order status tracking (pending, confirmed, preparing, ready, served, cancelled).

### Order Updates & Tracking
- Users and admins can update (e.g., mark as fulfilled) and track order status.
- All order changes are immediately reflected in the MySQL database — seen in real time by all staff/admin users.
- Order history is maintained for reporting and audit purposes.

---

## 📦 Inventory Management

### Add, Update, Delete Inventory Items
- Admins can add or edit inventory items in the system; changes are saved to the `inventory` table.
- Stock changes (e.g., add stock, use in order) are tracked with transactional safety and recorded in `inventory_transactions` for full audit.
- Low stock and out-of-stock alerts based on database thresholds.

### Inventory Sync
- All menu and order operations respect live inventory amounts.
- Low-stock and out-of-stock are determined by current DB values.
- Inventory adjustments are logged for complete traceability.

---

## 👨‍🍳 Staff Management

### Add/Edit/Remove Staff
- Admin can register new staff users and edit or remove them at any time.
- All staff info—login, role, status—is managed in the `users` table.
- Role assignment (admin, staff) controls access levels.

### Role-Based Access Control
- Actions available to each user (admin or staff) are controlled by the stored user role.
- All staff logging and actions are auditable via the `activity_logs` table.
- Role-based UI and API access restrictions.

---

## 📊 Reports & Real-Time Dashboard

### Sales & Inventory Reports
- All reports are generated dynamically using real-time data from the `orders`, `order_items`, and `inventory` tables.
- Sales, revenue, popular items, and stock levels are always up to date and available to the admin.
- Export capabilities for reports (PDF, Excel formats).
- Custom date range filtering.

### Real-Time Admin Dashboard
- Admin dashboard updates in real time as new sales, orders, and inventory events occur.
- All numbers/statistics pulled on demand from the database.
- Key metrics: total sales, pending orders, inventory alerts, staff activity.

---

## 🚦 Real-Time Admin Functionality

### Live Sync for All Admin Features
- Any change made by staff (orders, cart, inventory change) is reflected instantly in the admin's view.
- No outdated stats — all admin features read current state directly from the database.
- Real-time notifications for critical events.

### Audit/Logging
- Every important action, especially by admins, is saved in `activity_logs` for monitoring and audit.
- User activity tracking with timestamps and action details.

---

## 🍽️ Menu Management

### Menu Item CRUD Operations
- Admins can create, read, update, and delete menu items.
- Categories organization for better menu navigation.
- Image upload and storage for menu items.
- Price management and availability toggling.

### Menu Display
- Users and staff view real-time menu from the database.
- Menu reflects current pricing and availability.
- Search and filter capabilities for efficient browsing.

---

## 🛡️ Security Highlights

### Database-Driven Architecture
- No feature (cart, order, inventory, staff, reports) uses mock or local data — everything is managed through the database.
- Complete separation of concerns between frontend and backend.

### Secure APIs
- All PHP endpoints use prepared statements (via PDO) to prevent SQL injection.
- JWT tokens and session validation protect every user-facing and admin route.
- Input validation and sanitization on all user inputs.
- CORS policies configured for secure API access.

### Data Integrity
- Transaction support for critical operations.
- Foreign key constraints ensure referential integrity.
- Backup and recovery procedures in place.

---

## ⚡ Technical Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: Context API
- **UI Components**: Lucide React icons
- **Other**: React Hook Form, Zod validation, Hot Toast notifications

### Backend
- **Language**: PHP 8+
- **Database**: MySQL
- **API**: RESTful endpoints
- **Security**: PDO prepared statements, password hashing, JWT
- **Architecture**: Modular MVC-like structure

### Database Schema
- **users**: Authentication and user management
- **menu**: Menu items and categories
- **cart**: Shopping cart items
- **orders**: Order records
- **order_items**: Individual order items
- **inventory**: Inventory stock levels
- **inventory_transactions**: Audit trail for inventory changes
- **activity_logs**: System activity tracking

---

## 📝 Feature Table: Where Data is Stored/Read

| Feature         | Database Table(s)         | Key PHP API Files                              | Real-Time? | Auth Required |
|-----------------|--------------------------|------------------------------------------------|------------|---------------|
| Login/Register  | users                    | `/api/auth/login.php`, `/api/auth/register.php`| Yes        | Public        |
| Change Password | users                    | `/api/auth/change_password.php`                | Yes        | User          |
| Cart            | cart                     | `/api/cart/*.php`                              | Yes        | User          |
| Orders          | orders, order_items      | `/api/orders/*.php`                            | Yes        | User          |
| Menu            | menu, categories         | `/api/menu/*.php`                              | Yes        | Public/User   |
| Inventory       | inventory, inventory_transactions | `/api/inventory/*.php`                 | Yes        | Admin         |
| Staff           | users                    | `/api/staff/*.php`                             | Yes        | Admin         |
| Reports         | orders, inventory        | `/api/reports/*.php`                           | Yes        | Admin         |
| Dashboard       | (all relevant tables)    | `/api/dashboard/get_stats.php`                 | Yes        | Admin         |

---

## 🌐 User Interface Features

### Responsive Design
- Fully responsive design that works on desktop, tablet, and mobile devices.
- Mobile-first approach with touch-friendly interfaces.
- Adaptive layouts for different screen sizes.

### User Experience
- Intuitive navigation with sidebar and top navbar.
- Real-time notifications for important events.
- Loading states and error handling.
- Accessible design following WCAG guidelines.

### Modern UI Components
- Beautiful shadcn/ui component library.
- Consistent design system.
- Smooth animations and transitions.
- Dark mode support (optional).

---

## 🔄 Workflow Integration

### Order-to-Fulfillment Flow
1. Customer adds items to cart (stored in DB)
2. Order created from cart (orders + order_items tables)
3. Inventory automatically deducted
4. Order status updates tracked
5. Reports reflect changes in real-time

### Staff Management Flow
1. Admin creates staff account
2. Staff logs in with credentials
3. Role-based access enforced
4. Activities logged for audit
5. Admin can modify or remove staff

### Inventory Management Flow
1. Admin adds/updates inventory items
2. Stock levels tracked in real-time
3. Transactions logged for audit
4. Low stock alerts triggered
5. Reports show current status

---

## 📈 Scalability Features

### Performance Optimization
- Database indexing for fast queries.
- Efficient API endpoints.
- Caching strategies where appropriate.
- Optimized images and assets.

### Extensibility
- Modular code architecture.
- Easy to add new features.
- Plugin-ready structure.
- API-first design.

---

**This system ensures that every business-critical function—from passwords to cart, order, inventory, staff, and reports—is handled via secure, robust PHP APIs and is 100% database-backed for accuracy and reliability. The admin dashboard always shows up-to-date information, empowering real-time, informed decision-making for restaurant management.**

---

## 🎯 Key Differentiators

1. **100% Database-Backed**: No mock data, everything persists to MySQL
2. **Real-Time Updates**: All changes reflected immediately across the system
3. **Complete Audit Trail**: Every action logged for compliance and security
4. **Role-Based Security**: Granular access control based on user roles
5. **Production-Ready**: Secure, scalable, and maintainable architecture
6. **Modern Stack**: Latest technologies with best practices
7. **User-Friendly**: Intuitive interface with excellent UX

---

## 🚀 Getting Started

See the project's `README.md` and `SETUP_GUIDE.md` for installation and configuration instructions.

---

*Last Updated: December 2024*

