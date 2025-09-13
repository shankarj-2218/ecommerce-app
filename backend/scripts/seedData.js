// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import bcrypt from 'bcryptjs';
// import Product from '../models/Product.js';
// import User from '../models/User.js';
// import { faker } from '@faker-js/faker';

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB Connected...');
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// };

// const generateRandomProduct = (user) => {
//   const categories = [
//     'Electronics',
//     'Cameras',
//     'Laptops',
//     'Accessories',
//     'Headphones',
//     'Food',
//     'Books',
//     'Clothes/Shoes',
//     'Beauty/Health',
//     'Sports',
//     'Outdoor',
//     'Home'
//   ];

//   return {
//     name: faker.commerce.productName(),
//     description: faker.commerce.productDescription(),
//     price: faker.commerce.price({ min: 100, max: 10000, dec: 2 }),
//     category: faker.helpers.arrayElement(categories),
//     seller: faker.company.name(),
//     stock: faker.number.int({ min: 0, max: 100 }),
//     ratings: faker.number.int({ min: 0, max: 5 }),
//     images: [
//       {
//         public_id: faker.string.uuid(),
//         url: faker.image.urlLoremFlickr({ category: 'product' })
//       }
//     ],
//     user: user._id
//   };
// };

// const seedData = async () => {
//   try {
//     await connectDB();

//     // Clear existing data
//     await User.deleteMany({});
//     await Product.deleteMany({});
//     console.log('Data deleted successfully');

//     // Create admin user
//     const adminPassword = await bcrypt.hash('123456', 12);
//     const adminUser = new User({
//       email: 'admin@example.com',
//       password: adminPassword,
//       firstName: 'Admin',
//       lastName: 'User',
//       role: 'admin'
//     });
//     await adminUser.save();
//     console.log('Admin user created');

//     // Create regular user
//     const userPassword = await bcrypt.hash('user123', 12);
//     const regularUser = new User({
//       email: 'user@example.com',
//       password: userPassword,
//       firstName: 'John',
//       lastName: 'Doe',
//       role: 'user'
//     });
//     await regularUser.save();
//     console.log('Regular user created');

//     // Generate 20 random products
//     const products = Array.from({ length: 200 }, () => generateRandomProduct(adminUser));
//     await Product.insertMany(products);
//     console.log('Products added successfully');

//     console.log('Seed data completed successfully!');
//     console.log('Admin credentials: admin@example.com / 123456');
//     console.log('User credentials: user@example.com / user123');
    
//     process.exit(0);
//   } catch (error) {
//     console.error('Error seeding data:', error);
//     process.exit(1);
//   }
// };

// seedData();