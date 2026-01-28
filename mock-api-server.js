// Mock API Server for Testing Frontend
// This runs on Node.js and simulates the PHP backend

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@restaurant.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    role: 'admin',
    is_active: true
  },
  {
    id: 2,
    name: 'Staff User',
    email: 'staff@restaurant.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // staff123
    role: 'staff',
    is_active: true
  }
];

let menuItems = [
  { id: 1, name: 'Cheese Salad', description: 'Delicious cheese salad', price: 12.99, category: 'Appetizer', image_url: '/images/Chees Salad.jpg', is_available: true },
  { id: 2, name: 'Burger', description: 'Juicy beef burger', price: 10.50, category: 'Main Course', image_url: '/images/Burger.jpg', is_available: true },
  { id: 3, name: 'Caesar Salad', description: 'Fresh Caesar salad', price: 8.00, category: 'Appetizer', image_url: '/images/Caesar Salad.jpg', is_available: true },
  { id: 4, name: 'Chocolate Cake', description: 'Rich chocolate cake', price: 6.50, category: 'Dessert', image_url: '/images/Chocolate Cake.jpj.jpg', is_available: true },
  { id: 5, name: 'Coffee', description: 'Hot brewed coffee', price: 3.00, category: 'Beverage', image_url: '/images/Coffee.jpg', is_available: true }
];

let cart = [];
let orders = [];
let orderCounter = 1;

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { user_id: user.id, user_role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role = 'staff' } = req.body;
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role,
    is_active: true
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
});

// Menu routes
app.get('/api/menu', (req, res) => {
  res.json({
    success: true,
    data: menuItems
  });
});

app.post('/api/menu', authenticateToken, (req, res) => {
  const { name, description, price, category, image_url, is_available } = req.body;
  
  const newItem = {
    id: menuItems.length + 1,
    name,
    description,
    price: parseFloat(price),
    category,
    image_url: image_url || '',
    is_available: is_available !== false
  };

  menuItems.push(newItem);

  res.status(201).json({
    success: true,
    message: 'Menu item created successfully',
    data: newItem
  });
});

// Cart routes
app.get('/api/cart', authenticateToken, (req, res) => {
  const userCart = cart.filter(item => item.user_id === req.user.user_id);
  const totalItems = userCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json({
    success: true,
    data: userCart.map(item => ({
      id: item.id,
      menu_item_id: item.menu_item_id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      image_url: item.image_url,
      created_at: item.created_at
    })),
    summary: {
      total_items: totalItems,
      total_price: totalPrice
    }
  });
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { menu_item_id, quantity = 1 } = req.body;
  
  const menuItem = menuItems.find(item => item.id === menu_item_id);
  if (!menuItem) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  const existingCartItem = cart.find(item => 
    item.user_id === req.user.user_id && item.menu_item_id === menu_item_id
  );

  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    const newCartItem = {
      id: cart.length + 1,
      user_id: req.user.user_id,
      menu_item_id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      quantity,
      image_url: menuItem.image_url,
      created_at: new Date().toISOString()
    };
    cart.push(newCartItem);
  }

  res.status(201).json({
    success: true,
    message: 'Item added to cart successfully'
  });
});

// Orders routes
app.post('/api/orders', authenticateToken, (req, res) => {
  const { customer_name, customer_phone, table_id, notes } = req.body;
  
  const userCart = cart.filter(item => item.user_id === req.user.user_id);
  if (userCart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const totalAmount = userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = totalAmount * 0.08;
  const finalTotal = totalAmount + taxAmount;

  const newOrder = {
    id: orderCounter++,
    order_number: `ORD-${Date.now()}`,
    table_id,
    customer_name,
    customer_phone,
    status: 'pending',
    total_amount: finalTotal,
    tax_amount: taxAmount,
    waiter_id: req.user.user_id,
    notes,
    created_at: new Date().toISOString()
  };

  orders.push(newOrder);

  // Clear user's cart
  cart = cart.filter(item => item.user_id !== req.user.user_id);

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: newOrder
  });
});

// Dashboard routes
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const activeStaff = users.filter(u => u.role === 'staff' && u.is_active).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  res.json({
    success: true,
    data: {
      stats: {
        totalSales,
        totalOrders,
        activeStaff,
        lowStockItems: 0,
        todayRevenue: totalSales,
        pendingOrders
      },
      recentOrders: orders.slice(-5).reverse(),
      topItems: [],
      statusStats: {},
      tableStats: {
        total: 8,
        available: 6,
        occupied: 2
      }
    }
  });
});

// Categories routes
app.get('/api/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Appetizer', description: 'Starters and appetizers', is_active: true },
    { id: 2, name: 'Main Course', description: 'Main dishes and entrees', is_active: true },
    { id: 3, name: 'Dessert', description: 'Sweet treats and desserts', is_active: true },
    { id: 4, name: 'Beverage', description: 'Drinks and beverages', is_active: true }
  ];

  res.json({
    success: true,
    data: categories
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`🍽️  Menu: http://localhost:${PORT}/api/menu`);
  console.log(`\n🔑 Login Credentials:`);
  console.log(`   Admin: admin@restaurant.com / admin123`);
  console.log(`   Staff: staff@restaurant.com / staff123`);
});
