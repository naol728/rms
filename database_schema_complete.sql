-- Restaurant Management System Database Schema - Complete Version
-- Create database
CREATE DATABASE IF NOT EXISTS restaurant_management;
USE restaurant_management;

-- Users table (for authentication and staff management)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table (for menu categories)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INT DEFAULT 15, -- in minutes
    calories INT,
    allergens TEXT,
    created_by INT, -- who created this item
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tables table (for restaurant tables)
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(10) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    location VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart table (for user shopping carts)
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_item (user_id, menu_item_id)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    table_id INT,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    status ENUM('pending', 'preparing', 'ready', 'served', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'online') NULL,
    waiter_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL,
    FOREIGN KEY (waiter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Inventory table
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    current_stock INT NOT NULL DEFAULT 0,
    min_stock_level INT NOT NULL DEFAULT 10,
    unit VARCHAR(20) DEFAULT 'pieces',
    cost_per_unit DECIMAL(10,2),
    supplier VARCHAR(100),
    last_restocked TIMESTAMP NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Inventory transactions table
CREATE TABLE inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT NOT NULL,
    transaction_type ENUM('in', 'out', 'adjustment') NOT NULL,
    quantity INT NOT NULL,
    reason VARCHAR(200),
    reference_id INT, -- can reference order_id or other relevant IDs
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Activity logs table (for tracking all actions)
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reports table (for storing generated reports)
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    data JSON,
    generated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default categories
INSERT INTO categories (name, description, image_url) VALUES
('Appetizer', 'Starters and appetizers', '/images/categories/appetizer.jpg'),
('Main Course', 'Main dishes and entrees', '/images/categories/main-course.jpg'),
('Dessert', 'Sweet treats and desserts', '/images/categories/dessert.jpg'),
('Beverage', 'Drinks and beverages', '/images/categories/beverage.jpg');

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@restaurant.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert default staff user (password: staff123)
INSERT INTO users (name, email, password, role) VALUES
('Staff User', 'staff@restaurant.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff');

-- Insert sample tables
INSERT INTO tables (table_number, capacity, location) VALUES
('T1', 2, 'Window'),
('T2', 4, 'Center'),
('T3', 4, 'Center'),
('T4', 6, 'Corner'),
('T5', 2, 'Window'),
('T6', 8, 'Private'),
('T7', 4, 'Center'),
('T8', 2, 'Window');

-- Insert sample menu items (created by admin)
INSERT INTO menu_items (name, description, price, category_id, image_url, is_available, created_by) VALUES
('Cheese Salad', 'Delicious cheese salad with fresh vegetables', 12.99, 1, '/images/Chees Salad.jpg', TRUE, 1),
('Burger', 'Juicy beef burger with fries', 10.50, 2, '/images/Burger.jpg', TRUE, 1),
('Caesar Salad', 'Fresh Caesar salad with croutons', 8.00, 1, '/images/Caesar Salad.jpg', TRUE, 1),
('Chocolate Cake', 'Rich chocolate cake with cream', 6.50, 3, '/images/Chocolate Cake.jpj.jpg', TRUE, 1),
('Coffee', 'Hot brewed coffee', 3.00, 4, '/images/Coffee.jpg', TRUE, 1),
('Ice Cream', 'Vanilla ice cream', 4.50, 3, '/images/chocolat.jpg', TRUE, 1),
('French Fries', 'Crispy golden fries', 5.00, 1, '/images/French Fries.jpg', TRUE, 1),
('Grilled Chicken', 'Grilled chicken breast with herbs', 14.00, 2, '/images/Grilled Chicken.jpg', TRUE, 1),
('Lemonade', 'Fresh lemonade', 3.50, 4, '/images/Lemonade.jpg', TRUE, 1),
('Pasta Carbonara', 'Creamy pasta with bacon', 13.00, 2, '/images/Pasta Carbonara.jpg', TRUE, 1),
('Garlic Bread', 'Toasted garlic bread', 4.00, 1, '/images/Garlic Bread.jpg', TRUE, 1),
('Mango Smoothie', 'Refreshing mango smoothie', 5.00, 4, '/images/Mango Smoothie.jpg', TRUE, 1);

-- Insert sample inventory items
INSERT INTO inventory (item_name, category, current_stock, min_stock_level, unit, cost_per_unit, supplier, created_by) VALUES
('Ground Beef', 'Meat', 50, 20, 'kg', 8.50, 'Fresh Meat Co.', 1),
('Chicken Breast', 'Meat', 30, 15, 'kg', 6.75, 'Poultry Plus', 1),
('Lettuce', 'Vegetables', 100, 30, 'heads', 1.25, 'Green Valley Farms', 1),
('Tomatoes', 'Vegetables', 80, 25, 'kg', 2.50, 'Sunny Acres', 1),
('Cheese', 'Dairy', 25, 10, 'kg', 4.20, 'Dairy Delights', 1),
('Bread', 'Bakery', 40, 15, 'loaves', 2.00, 'Bakery Fresh', 1),
('Coffee Beans', 'Beverages', 20, 5, 'kg', 12.00, 'Coffee Masters', 1),
('Cooking Oil', 'Pantry', 15, 5, 'liters', 3.50, 'Kitchen Supplies', 1);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_waiter ON orders(waiter_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);
