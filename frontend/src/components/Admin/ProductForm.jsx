import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, X, Loader2 } from 'lucide-react'

const ProductForm = ({ product, onSubmit, loading }) => {
  const [images, setImages] = useState(product?.images || [])
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: product || {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      seller: '',
    },
  })

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if (!files.length) return

    setUploading(true)
    try {
      // In a real application, you would upload to Cloudinary, AWS S3, etc.
      // For now, we'll simulate upload and use placeholder URLs
      const newImages = Array.from(files).map((file) => ({
        public_id: Date.now().toString(),
        url: URL.createObjectURL(file),
      }))

      setImages([...images, ...newImages])
      setValue('images', [...images, ...newImages])
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    setValue('images', newImages)
  }

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
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            {...register('name', { required: 'Product name is required' })}
            className="input-field mt-1"
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            className="input-field mt-1"
            placeholder="Enter price"
          />
          {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="input-field mt-1"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            {...register('stock', { 
              required: 'Stock is required',
              min: { value: 0, message: 'Stock cannot be negative' }
            })}
            className="input-field mt-1"
            placeholder="Enter stock quantity"
          />
          {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Seller</label>
          <input
            {...register('seller', { required: 'Seller information is required' })}
            className="input-field mt-1"
            placeholder="Enter seller name"
          />
          {errors.seller && <p className="text-red-600 text-sm mt-1">{errors.seller.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows={4}
          {...register('description', { required: 'Description is required' })}
          className="input-field mt-1"
          placeholder="Enter product description"
        />
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Product Images</label>
        <div className="mt-1 flex items-center">
          <label className="flex cursor-pointer items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Upload className="h-5 w-5 mr-2" />
            Upload Images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="sr-only"
            />
          </label>
          {uploading && <Loader2 className="h-5 w-5 animate-spin ml-4 text-gray-500" />}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Product ${index + 1}`}
                className="h-32 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Saving....' : (product ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  )
}

export default ProductForm