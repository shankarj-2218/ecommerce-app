import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, TrendingUp, Shield, Truck, HeadphonesIcon } from 'lucide-react'
import { productsAPI } from '../lib/api'

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      const response = await productsAPI.getAll({ pageSize: 8 })
      setTrendingProducts(response.data.products)
    } catch (error) {
      console.error('Error fetching trending products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Your Perfect Style</h1>
              <p className="text-xl mb-8 opacity-90">
                Shop the latest trends in fashion, electronics, and home goods with free shipping on all orders over $50.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products" 
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  Shop Now <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link 
                  to="/about" 
                  className="bg-white hover:bg-gray-100 text-blue-900 px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Fashion collection" 
                className="w-full h-96 object-cover rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Shop With Us</h2>
            <p className="text-xl text-gray-600">We're committed to providing the best shopping experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center transition-transform hover:scale-105">
              <div className="text-blue-600 mb-4 flex justify-center">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $50</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center transition-transform hover:scale-105">
              <div className="text-blue-600 mb-4 flex justify-center">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe and secure</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center transition-transform hover:scale-105">
              <div className="text-blue-600 mb-4 flex justify-center">
                <HeadphonesIcon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our support team is here to help you</p>
            </div>
          </div>
        </div>
      </section>



      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest products and exclusive offers
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Home