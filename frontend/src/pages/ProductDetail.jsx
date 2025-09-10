import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsAPI, cartAPI } from '../lib/api'
import { Star, ShoppingCart, Heart, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productsAPI.getById(id)
      setProduct(response.data)
    } catch (err) {
      setError('Product not found')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }

    try {
      setAddingToCart(true)
      await cartAPI.addItem(product._id, quantity)
      toast.success('Product added to cart!')
    } catch (err) {
      toast.error('Failed to add product to cart')
      console.error('Error adding to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error || 'Product not found'}</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <img
              src={product.images[selectedImage]?.url || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-full h-96 object-contain rounded-lg"
            />
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.ratings) ? 'fill-current' : ''
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              ({product.ratings.toFixed(1)} rating{product.ratings !== 1 ? 's' : ''})
            </span>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-primary-600">${product.price}</span>
              
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>

            <div className="mb-4">
              <span className="text-gray-700">Category: </span>
              <span className="font-semibold">{product.category}</span>
            </div>

            <div className="mb-4">
              <span className="text-gray-700">Sold by: </span>
              <span className="font-semibold">{product.seller}</span>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="input-field max-w-xs"
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {addingToCart ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <ShoppingCart className="h-5 w-5 mr-2" />
              )}
              Add to Cart
            </button>

            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Product Details</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Specifications</h3>
              <ul className="space-y-2">
                <li><strong>Category:</strong> {product.category}</li>
                <li><strong>Seller:</strong> {product.seller}</li>
                <li><strong>Stock:</strong> {product.stock} units available</li>
                <li><strong>Rating:</strong> {product.ratings.toFixed(1)} out of 5</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Shipping & Returns</h3>
              <ul className="space-y-2">
                <li>Free shipping on orders over $100</li>
                <li>30-day return policy</li>
                <li>Secure payment processing</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail