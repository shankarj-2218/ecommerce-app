import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../lib/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true, error: null }
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false, user: null }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: JSON.parse(user)
      })
    }
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authAPI.login(credentials)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data.user
      })
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      })
      throw new Error(message)
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authAPI.register(userData)
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data.user
      })
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      })
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}