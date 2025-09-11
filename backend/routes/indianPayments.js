import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';
// Load environment variables FIRST
dotenv.config();

const router = express.Router();

// Initialize Razorpay instance with better error handling
let razorpay;

try {
  // Check if environment variables are available
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay API keys are missing from environment variables');
    console.error('Please check your .env file in the backend directory');
  } else {
   razorpay = new Razorpay({
  key_id: 'rzp_test_RGIbYUv3d1jdmK',
  key_secret: 'WDYJjfeDzQMnTrhUYBPBhI1h',
});
    console.log('Razorpay initialized successfully');
  }
} catch (error) {
  console.error('Razorpay initialization error:', error.message);
}

// Create Razorpay order
router.post('/create-razorpay-order', auth, async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(500).json({ 
        message: 'Payment gateway is not configured. Please check server configuration.' 
      });
    }

    const { orderId, amount, currency } = req.body;

    // Get the order from database
    const order = await Order.findById(orderId).populate('user', 'email firstName');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify the order belongs to the user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Convert amount to integer (paise) and ensure it's a whole number
    const amountInPaise = Math.round(amount * 100);

    // Create options for Razorpay order
    const options = {
      amount: amountInPaise, // Use the converted integer amount
      currency: currency || 'INR',
      receipt: `receipt_${orderId}`,
      payment_capture: 1, // auto capture payment
      notes: {
        orderId: orderId.toString(),
        userId: req.user._id.toString(),
      },
    };

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

// Verify Razorpay payment (without webhooks)
router.post('/verify-razorpay-payment', auth, async (req, res) => {
  try {
    const { order_id, payment_id, signature, orderId } = req.body;

    // Check if secret key is available
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ 
        success: false,
        message: 'Payment verification not configured' 
      });
    }

    // Create expected signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + '|' + payment_id)
      .digest('hex');

    // Verify signature
    if (generated_signature !== signature) {
      return res.status(400).json({ 
        success: false,
        message: 'Payment verification failed' 
      });
    }

    // Update order status in database
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: payment_id,
        status: 'completed',
        update_time: new Date().toISOString(),
        payment_method: 'razorpay',
      };
      await order.save();
      
      return res.json({ 
        success: true,
        message: 'Payment verified successfully' 
      });
    } else {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Payment verification failed' 
    });
  }
});

export default router;