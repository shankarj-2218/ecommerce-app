import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsAPI } from '../../lib/api'
import ProductForm from '../../components/Admin/ProductForm'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

const ProductCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      await productsAPI.create(data)
      toast.success('Product created successfully')
      navigate('/admin/products')
    } catch (error) {
      toast.error('Failed to create product')
      console.error('Error creating product:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Product</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}

export default ProductCreate