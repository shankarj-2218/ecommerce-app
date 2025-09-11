import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react'
import { ordersAPI } from '../lib/api'
import toast from 'react-hot-toast'

const OrderConfirmation = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getById(id)
      setOrder(response.data)
    } catch (error) {
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 inline-flex items-center"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. Your order number is <strong>#{order._id.slice(-8).toUpperCase()}</strong>.
          We'll send you a confirmation email shortly.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <Package className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold">Order Placed</h3>
              <p className="text-gray-600 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-center">
              <Truck className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold">Estimated Delivery</h3>
              <p className="text-gray-600 text-sm">
                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-center">
              <ShoppingBag className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-semibold">Total</h3>
              <p className="text-gray-600 text-sm">₹{order.totalPrice.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-600">
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 inline-flex items-center"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
          
          <Link
            to="/"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 inline-flex items-center"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation