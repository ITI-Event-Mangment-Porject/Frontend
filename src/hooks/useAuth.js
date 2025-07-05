// "use client"

// import { useState, useEffect, useContext, createContext } from "react"
// import authService from "../services/auth"
// import { Navigate } from "react-router-dom" // Import Navigate from react-router-dom

// // Create Auth Context
// const AuthContext = createContext()

// // Auth Provider Component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [role, setRole] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   // Initialize auth state
//   useEffect(() => {
//     initializeAuth()
//   }, [])

//   const initializeAuth = async () => {
//     try {
//       setLoading(true)

//       if (authService.isAuthenticated()) {
//         const userData = authService.getUser()
//         const userRole = authService.getUserRole()

//         if (userData && userRole) {
//           setUser(userData)
//           setRole(userRole)
//           setIsAuthenticated(true)

//           // Optionally refresh user data from server
//           const currentUser = await authService.getCurrentUser()
//           if (currentUser) {
//             setUser(currentUser)
//           }
//         } else {
//           // Clear invalid data
//           authService.clearStorage()
//         }
//       }
//     } catch (error) {
//       console.error("Auth initialization error:", error)
//       authService.clearStorage()
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (credentials) => {
//     try {
//       setLoading(true)
//       const result = await authService.login(credentials)

//       if (result.success) {
//         setUser(result.user)
//         setRole(result.role)
//         setIsAuthenticated(true)
//         return { success: true }
//       }

//       return { success: false, message: result.message }
//     } catch (error) {
//       console.error("Login error:", error)
//       return { success: false, message: "Login failed" }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const logout = async () => {
//     try {
//       setLoading(true)
//       await authService.logout()
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       setUser(null)
//       setRole(null)
//       setIsAuthenticated(false)
//       setLoading(false)
//     }
//   }

//   const refreshUser = async () => {
//     try {
//       const currentUser = await authService.getCurrentUser()
//       if (currentUser) {
//         setUser(currentUser)
//         return currentUser
//       }
//       return null
//     } catch (error) {
//       console.error("Refresh user error:", error)
//       return null
//     }
//   }

//   const hasRole = (requiredRole) => {
//     return role === requiredRole
//   }

//   const hasAnyRole = (roles) => {
//     return roles.includes(role)
//   }

//   const value = {
//     user,
//     role,
//     loading,
//     isAuthenticated,
//     login,
//     logout,
//     refreshUser,
//     hasRole,
//     hasAnyRole,
//     isAdmin: () => hasRole("admin"),
//     isStudent: () => hasRole("student"),
//     isCompany: () => hasRole("company"),
//     isStaff: () => hasRole("staff"),
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// // HOC for protected routes
// export const withAuth = (Component, allowedRoles = []) => {
//   return (props) => {
//     const { isAuthenticated, role, loading } = useAuth()

//     if (loading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
//         </div>
//       )
//     }

//     if (!isAuthenticated) {
//       return <Navigate to="/login" replace />
//     }

//     if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
//             <p className="text-gray-600">You don't have permission to access this page.</p>
//           </div>
//         </div>
//       )
//     }

//     return <Component {...props} />
//   }
// }

// export default useAuth
