// Razorpay utility functions
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      resolve(null);
      console.error('Failed to load Razorpay SDK');
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (orderData) => {
  const response = await fetch('/api/indian-payments/create-razorpay-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create Razorpay order');
  }
  
  return response.json();
};

export const verifyRazorpayPayment = async (paymentData) => {
  const response = await fetch('/api/indian-payments/verify-razorpay-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(paymentData)
  });
  
  if (!response.ok) {
    throw new Error('Payment verification failed');
  }
  
  return response.json();
};