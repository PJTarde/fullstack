const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { products, totalPrice, customerName, customerPhone, deliveryAddress } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      products,
      totalPrice,
      customerName,
      customerPhone,
      deliveryAddress
    });

    const createdOrder = await order.save();

    // Auto-deplete inventory
    for (const item of products) {
      const productObj = await Product.findById(item.product);
      if (productObj) {
        productObj.countInStock = Math.max(0, productObj.countInStock - item.quantity);
        await productObj.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res) => {
  try {
    // Populate the product details so we get name/price instead of just the ObjectId
    const orders = await Order.find({}).populate('products.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (In production, heavily protect this)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'products.product',
      'name price image'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
