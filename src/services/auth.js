class AuthService {
    constructor() {
      this.TOKEN_KEY = "access_token"
      this.REFRESH_TOKEN_KEY = "refresh_token"
      this.USER_KEY = "user_data"
      this.ROLE_KEY = "user_role"
      this.PORTAL_TOKEN_KEY = "portal_token"
    }
  
    // Login method
    async login(credentials) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(credentials),
        })
  
        const data = await response.json()
  
        if (data.success && data.data) {
          // Store tokens and user data
          this.setTokens(data.data.access_token, data.data.refresh_token)
          this.setUser(data.data.user)
          this.setUserRole(data.data.role)
  
          if (data.data.portal_token) {
            this.setPortalToken(data.data.portal_token)
          }
  
          return {
            success: true,
            user: data.data.user,
            role: data.data.role,
            message: data.message,
          }
        } else {
          return {
            success: false,
            message: data.message || "Login failed",
          }
        }
      } catch (error) {
        console.error("Login error:", error)
        return {
          success: false,
          message: "Network error. Please try again.",
        }
      }
    }
  
    // Logout method
    async logout() {
      try {
        const token = this.getToken()
        if (token) {
          await fetch("http://127.0.0.1:8000/api/auth/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
        }
      } catch (error) {
        console.error("Logout error:", error)
      } finally {
        this.clearStorage()
      }
    }
  
    // Get current user from API
    async getCurrentUser() {
      try {
        const token = this.getToken()
        if (!token) return null
  
        const response = await fetch("http://127.0.0.1:8000/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
  
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            this.setUser(data.data.user)
            return data.data.user
          }
        }
        return null
      } catch (error) {
        console.error("Get current user error:", error)
        return null
      }
    }
  
    // Refresh token
    async refreshToken() {
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) return false
  
        const response = await fetch("http://127.0.0.1:8000/api/auth/refresh", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
  
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            this.setTokens(data.data.access_token, data.data.refresh_token)
            return true
          }
        }
        return false
      } catch (error) {
        console.error("Refresh token error:", error)
        return false
      }
    }
  
    // Token management
    setTokens(accessToken, refreshToken) {
      localStorage.setItem(this.TOKEN_KEY, accessToken)
      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
      }
    }
  
    getToken() {
      return localStorage.getItem(this.TOKEN_KEY)
    }
  
    getRefreshToken() {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }
  
    // User data management
    setUser(user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }
  
    getUser() {
      const userData = localStorage.getItem(this.USER_KEY)
      return userData ? JSON.parse(userData) : null
    }
  
    // Role management
    setUserRole(role) {
      localStorage.setItem(this.ROLE_KEY, role)
    }
  
    getUserRole() {
      return localStorage.getItem(this.ROLE_KEY)
    }
  
    // Portal token management
    setPortalToken(token) {
      localStorage.setItem(this.PORTAL_TOKEN_KEY, token)
    }
  
    getPortalToken() {
      return localStorage.getItem(this.PORTAL_TOKEN_KEY)
    }
  
    // Authentication status
    isAuthenticated() {
      const token = this.getToken()
      const user = this.getUser()
      return !!(token && user)
    }
  
    // Check if token is expired
    isTokenExpired() {
      const token = this.getToken()
      if (!token) return true
  
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        const currentTime = Date.now() / 1000
        return payload.exp < currentTime
      } catch (error) {
        return true
      }
    }
  
    // Clear all stored data
    clearStorage() {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      localStorage.removeItem(this.ROLE_KEY)
      localStorage.removeItem(this.PORTAL_TOKEN_KEY)
    }
  
    // Get authorization header
    getAuthHeader() {
      const token = this.getToken()
      return token ? { Authorization: `Bearer ${token}` } : {}
    }
  
    // Role checking methods
    hasRole(role) {
      return this.getUserRole() === role
    }
  
    isAdmin() {
      return this.hasRole("admin")
    }
  
    isStudent() {
      return this.hasRole("student")
    }
  
    isCompany() {
      return this.hasRole("company")
    }
  
    isStaff() {
      return this.hasRole("staff")
    }
  }
  
  export default new AuthService()
  