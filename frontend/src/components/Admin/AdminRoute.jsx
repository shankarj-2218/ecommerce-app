import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/')
      alert('You do not have permission to access this page')
    }
  }, [isAuthenticated, user, navigate])

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return null
  }

  return children
}

export default AdminRoute