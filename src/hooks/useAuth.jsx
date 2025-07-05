"use client"

import { useState, useEffect, useContext, createContext } from "react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth"

// Create Auth Context
const AuthContext = createContext()

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setLoading(true)

      if (authService.isAuthenticated()) {
        const userData = authService.getUser()
        const userRole = authService.getUserRole()

        if (userData && userRole) {
          setUser(userData)
          setRole(userRole)
          setIsAuthenticated(true)

          // Optionally refresh user data from server
          try {
            const currentUser = await authService.getCurrentUser()
            if (currentUser) {
              setUser(currentUser)
            }
          } catch (error) {
            console.error("Failed to refresh user data:", error)
          }
        } else {
          // Clear invalid data
          authService.clearStorage()
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      authService.clearStorage()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const result = await authService.login(credentials)

      if (result.success) {
        setUser(result.user)
        setRole(result.role)
        setIsAuthenticated(true)

        // Navigate based on role
        redirectBasedOnRole(result.role)

        return { success: true }
      }

      return { success: false, message: result.message }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setRole(null)
      setIsAuthenticated(false)
      setLoading(false)
      navigate("/login")
    }
  }

  const redirectBasedOnRole = (userRole) => {
    switch (userRole) {
      case "admin":
        navigate("/admin/dashboard")
        break
      case "student":
        navigate("/show-events")
        break
      case "company":
        navigate("/company/dashboard")
        break
      case "staff":
        navigate("/staff/dashboard")
        break
      default:
        navigate("/")
        break
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        return currentUser
      }
      return null
    } catch (error) {
      console.error("Refresh user error:", error)
      return null
    }
  }

  const hasRole = (requiredRole) => {
    return role === requiredRole
  }

  const hasAnyRole = (roles) => {
    return roles.includes(role)
  }

  const value = {
    user,
    role,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    hasRole,
    hasAnyRole,
    isAdmin: () => hasRole("admin"),
    isStudent: () => hasRole("student"),
    isCompany: () => hasRole("company"),
    isStaff: () => hasRole("staff"),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// HOC for protected routes
export const withAuth = (Component, allowedRoles = []) => {
  return (props) => {
    const { isAuthenticated, role, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          navigate("/login")
        } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
          navigate("/unauthorized")
        }
      }
    }, [isAuthenticated, role, loading, navigate])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

export default useAuth
