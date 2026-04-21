const mongoose = require('mongoose');
const dotenv = require('dotenv');
const products = require('./data/products');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Admin = require('./models/Admin');

// Load environment variables directly since it's a standalone script
dotenv.config();

const importData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hariom-bakers';
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected! Proceeding to seed data...');

    // Clear existing data to avoid duplicates
    await Order.deleteMany();
    await Product.deleteMany();
    await Admin.deleteMany();

    // Insert default admin
    await Admin.create({
      email: 'admin@hariombakers.com',
      password: 'password123'
    });

    // Insert sample data
    await Product.insertMany(products);

    console.log('Sample Products Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data seeding: ${error.message}`);
    process.exit(1);
  }
};

importData();
