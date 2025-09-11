import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Loader2, MapPin, CreditCard, Shield, IndianRupee } from 'lucide-react'
import { cartAPI, ordersAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { loadRazorpay, createRazorpayOrder, verifyRazorpayPayment } from '../lib/razorpay'
import OrderSummary from '../components/Cart/OrderSummary'
import toast from 'react-hot-toast'

const Checkout = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm()

  useEffect(() => {
    fetchCart()
    setDefaultValues()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get()
      setCart(response.data)
    } catch (error) {
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const setDefaultValues = () => {
    if (user) {
      setValue('firstName', user.firstName || '')
      setValue('lastName', user.lastName || '')
      setValue('email', user.email || '')
    }
  }

  const calculateTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, tax: 0, shipping: 0, total: 0 }
    
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping
    
    return { subtotal, tax, shipping, total }
  }

  const handleRazorpayPayment = async (orderData) => {
    try {
      setProcessing(true)
      
      // Create the order first
      const orderResponse = await ordersAPI.create(orderData)
      const order = orderResponse.data
      
      // Load Razorpay SDK
      const Razorpay = await loadRazorpay()
      if (!Razorpay) {
        throw new Error('Failed to load payment gateway')
      }
      
      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder({
        orderId: order._id,
        amount: order.totalPrice,
        currency: 'INR'
      })
      
      // Razorpay options
      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ShopSphere',
        description: `Order #${order._id.slice(-8).toUpperCase()}`,
        image: '/logo.png',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment on our server
            const verification = await verifyRazorpayPayment({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              orderId: order._id
            })
            
            if (verification.success) {
              toast.success('Payment successful!')
              navigate(`/order-confirmation/${order._id}`)
            } else {
              toast.error('Payment verification failed')
              setProcessing(false)
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed')
            setProcessing(false)
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.mobile, // You can add phone field to user model
        },
        notes: {
          orderId: order._id,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
            toast('Payment cancelled', { icon: '⚠️' })
          },
        },
      };
      
      // Open Razorpay payment modal
      const rzp = new Razorpay(options)
      rzp.open()
      
    } catch (error) {
      console.error('Razorpay payment error:', error)
      toast.error(error.message || 'Payment processing failed')
      setProcessing(false)
    }
  }

  const onSubmit = async (data) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    const orderData = {
      shippingAddress: {
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country
      },
      paymentMethod: paymentMethod
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment(orderData)
    } else {
      // Handle other payment methods
      toast.error('Selected payment method is not available')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checkout</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const { subtotal, tax, shipping, total } = calculateTotals()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="input-field"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className="input-field"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input-field"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                {...register('address', { required: 'Address is required' })}
                className="input-field"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="input-field"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  {...register('postalCode', { required: 'Postal code is required' })}
                  className="input-field"
                />
                {errors.postalCode && (
                  <p className="text-red-600 text-sm mt-1">{errors.postalCode.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  {...register('country', { required: 'Country is required' })}
                  className="input-field"
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                </select>
                {errors.country && (
                  <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="razorpay"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="h-4 w-4 text-primary-600"
                  />
                  <label htmlFor="razorpay" className="ml-2 font-medium flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    UPI / Credit Card / Debit Card / Net Banking (Razorpay)
                  </label>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  Pay securely using Razorpay. Supports all Indian payment methods including UPI, cards, net banking, and wallets.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center text-sm text-gray-600">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Your payment details are secure and encrypted
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <OrderSummary
            items={cart.items}
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
          >
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                  Processing...
                </>
              ) : (
                `Pay ₹ ${total.toFixed(2)}`
              )}
            </button>
            
            <p className="text-sm text-gray-600 mt-4 text-center">
              By completing your purchase, you agree to our Terms of Service
            </p>
          </OrderSummary>
        </div>
      </form>
    </div>
  )
}

export default Checkout