const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getAdminMetrics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from all orders
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Find products running low
    const lowStockProducts = await Product.find({ countInStock: { $lt: 5 } }).select('name countInStock');

    // 7 Day Chart Data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrdersArray = await Order.find({ createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: 1 });

    const chartDataMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      chartDataMap[dateString] = { name: dateString, revenue: 0, orders: 0 };
    }

    recentOrdersArray.forEach(order => {
      if (order.createdAt) {
        const dateString = order.createdAt.toISOString().split('T')[0];
        if (chartDataMap[dateString]) {
          chartDataMap[dateString].revenue += order.totalPrice || 0;
          chartDataMap[dateString].orders += 1;
        }
      }
    });

    const chartData = Object.values(chartDataMap);

    // Fetch exactly the latest 5 orders for the recent orders table
    const recentOrdersTable = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalOrders,
      totalRevenue,
      lowStockProducts,
      chartData,
      recentOrders: recentOrdersTable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  getAdminMetrics
};
