import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsAPI } from '../../lib/api'
import ProductForm from '../../components/Admin/ProductForm'
import toast from 'react-hot-toast'

const ProductEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id)
      setProduct(response.data)
    } catch (error) {
      toast.error('Failed to fetch product')
      console.error('Error fetching product:', error)
    }
  }

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await productsAPI.update(id, data)
      toast.success('Product updated successfully')
      navigate('/admin/products')
    } catch (error) {
      toast.error('Failed to update product')
      console.error('Error updating product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm 
          product={product} 
          onSubmit={handleSubmit} 
          loading={loading} 
        />
      </div>
    </div>
  )
}

export default ProductEdit