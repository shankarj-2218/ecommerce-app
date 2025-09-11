import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Eye } from 'lucide-react'

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.images[0]?.url || '/placeholder-image.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ₹{
                  i < Math.floor(product.ratings) ? 'fill-current' : ''
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">
            ({product.ratings.toFixed(1)})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ₹{product.price}
          </span>
          
          <div className="flex space-x-2">
            <Link
              to={`/products/${product._id}`}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            
            <button
              className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
              title="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {product.stock === 0 ? (
          <div className="mt-2 text-red-600 text-sm">Out of Stock</div>
        ) : product.stock < 10 ? (
          <div className="mt-2 text-orange-600 text-sm">
            Only {product.stock} left in stock
          </div>
        ) : (
          <div className="mt-2 text-green-600 text-sm">In Stock</div>
        )}
      </div>
    </div>
  )
}

export default ProductCard