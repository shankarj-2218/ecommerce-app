import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { cartAPI } from '../../lib/api'
import toast from 'react-hot-toast'

const CartItem = ({ item, onUpdate, onRemove }) => {
  const [updating, setUpdating] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity === item.quantity) return
    
    setUpdating(true)
    try {
      await cartAPI.updateItem(item._id, newQuantity)
      onUpdate()
      toast.success('Cart updated')
    } catch (error) {
      toast.error('Failed to update quantity')
    } finally {
      setUpdating(false)
    }
  }

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await cartAPI.removeItem(item._id)
      onRemove()
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <img
        src={item.product.images?.[0]?.url || '/placeholder-image.jpg'}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-md"
      />
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-gray-600 text-sm">{item.product.category}</p>
        <p className="text-lg font-bold text-primary-600">${item.price}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1 || updating}
          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={updating}
          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={handleRemove}
          disabled={removing}
          className="mt-2 text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default CartItem