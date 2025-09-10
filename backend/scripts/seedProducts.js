import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { faker } from '@faker-js/faker';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

const generateRandomProduct = (user) => {
  const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
  ];

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(10, 2000, 2),
    category: faker.helpers.arrayElement(categories),
    seller: faker.company.name(),
    stock: faker.datatype.number({ min: 0, max: 100 }),
    ratings: faker.datatype.number({ min: 0, max: 5 }),
    images: [
      {
        public_id: faker.datatype.uuid(),
        url: faker.image.imageUrl(640, 480, 'product', true)
      }
    ],
    user: user._id
  };
};

const seedProducts = async () => {
  try {
    await connectDB();

    // Get an admin user (if exists) or create one
    let user = await User.findOne({ role: 'admin' });
    if (!user) {
      user = await User.findOne();
      if (!user) {
        console.error('No user found. Please create an admin user first.');
        process.exit(1);
      }
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('Products deleted successfully');

    // Generate 50 random products
    const products = Array.from({ length: 50 }, () => generateRandomProduct(user));
    await Product.insertMany(products);
    console.log('Products added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();