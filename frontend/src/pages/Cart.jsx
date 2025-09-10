import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { cartAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import CartItem from '../components/Cart/CartItem'
import OrderSummary from '../components/Cart/OrderSummary'
import toast from 'react-hot-toast'

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [isAuthenticated])

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

  const handleUpdate = () => {
    fetchCart()
  }

  const handleRemove = () => {
    fetchCart()
  }

  const calculateTotals = () => {
    if (!cart || !cart.items) return { subtotal: 0, tax: 0, shipping: 0, total: 0 }
    
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping
    
    return { subtotal, tax, shipping, total }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 inline-flex items-center"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  const { subtotal, tax, shipping, total } = calculateTotals()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Continue Shopping
            </Link>
            
            <button
              onClick={() => cartAPI.clear()}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        <div>
          <OrderSummary
            items={cart.items}
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
          >
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 font-medium"
            >
              Proceed to Checkout
            </button>
            
            <p className="text-sm text-gray-600 mt-4 text-center">
              Taxes and shipping calculated at checkout
            </p>
          </OrderSummary>
        </div>
      </div>
    </div>
  )
}

export default Cart