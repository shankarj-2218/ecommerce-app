import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  // Show nothing while checking auth
  if (!isAuthenticated) {
    return null
  }

  // Show nothing if not admin (will redirect)
  if (user?.role !== 'admin') {
    return null
  }

  return children
}

export default AdminRoute