// Authentication service that works with localStorage
class AuthService {
  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Get current user role
  getCurrentUserRole() {
    return localStorage.getItem('role');
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token');
  }

  // Set auth data
  setAuth(token, user, role) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
  }

  // Clear auth data
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('refresh_token');
  }

  // Check if user has specific role
  hasRole(role) {
    return this.getCurrentUserRole() === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles) {
    const userRole = this.getCurrentUserRole();
    return roles.includes(userRole);
  }

  // Logout method
  logout() {
    this.clearAuth();
    // Optionally, you could also make an API call to invalidate the token on the server
  }

  // Check if token is expired (if you have JWT tokens)
  //   isTokenExpired() {
  //     const token = this.getToken();
  //     if (!token) return true;

  //     try {
  //       // If using JWT tokens, you could decode and check expiration
  //       // const payload = JSON.parse(atob(token.split('.')[1]));
  //       // const currentTime = Date.now() / 1000;
  //       // return payload.exp < currentTime;

  //       // For now, just check if token exists
  //       return false;
  //     } catch (error) {
  //       console.error('Token validation error:', error);
  //       return true;
  //     }
  //   }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
