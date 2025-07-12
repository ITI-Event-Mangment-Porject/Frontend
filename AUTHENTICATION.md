# Authentication and Route Protection System

This document explains how the authentication and route protection system works in your application.

## Overview

The authentication system uses localStorage to manage user authentication state and provides role-based access control for different parts of the application.

## Components

### 1. useAuth Hook (`src/hooks/useAuth.js`)

A custom React hook that provides authentication state and methods:

```javascript
const {
  user,
  role,
  loading,
  isAuthenticated,
  login,
  logout,
  hasRole,
  hasAnyRole,
} = useAuth();
```

**Properties:**

- `user`: Current user object
- `role`: Current user role (admin, student, company_representative, staff)
- `loading`: Boolean indicating if auth check is in progress
- `isAuthenticated`: Boolean indicating if user is authenticated

**Methods:**

- `login(userData, userRole, token)`: Set authentication data
- `logout()`: Clear authentication data
- `hasRole(requiredRole)`: Check if user has specific role
- `hasAnyRole(requiredRoles)`: Check if user has any of the specified roles

### 2. ProtectedRoute Component (`src/components/ProtectedRoute.jsx`)

A wrapper component that protects routes based on authentication and role requirements:

```javascript
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

**Props:**

- `requiredRole`: Single role required to access the route
- `requiredRoles`: Array of roles that can access the route
- `requireAuth`: Boolean to require authentication (default: true)
- `redirectTo`: Where to redirect if unauthorized (default: '/login')

### 3. AuthService (`src/services/auth.js`)

A service class that handles authentication operations:

**Methods:**

- `isAuthenticated()`: Check if user is authenticated
- `getCurrentUser()`: Get current user data
- `getCurrentUserRole()`: Get current user role
- `hasRole(role)`: Check if user has specific role
- `setAuth(token, user, role)`: Set authentication data
- `clearAuth()`: Clear authentication data

## User Roles

The system supports the following user roles:

1. **admin**: Full access to admin dashboard and management features
2. **student**: Access to student features (events, feedback, etc.)
3. **company_representative**: Access to company features (dashboard, setup, etc.)
4. **staff**: Access to staff features (attendance, queue management, etc.)

## Protected Routes

### Public Routes (No Authentication Required)

- `/` - Home page
- `/events` - All events page
- `/about-us` - About page
- `/contect-us` - Contact page
- `/login` - Login page
- `/support` - Help page
- `/unauthorized` - Unauthorized access page

### Admin Routes (Require `admin` role)

- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/companies` - Company management
- `/admin/attendance` - Attendance reports
- `/admin/jobfair` - Job fair setup
- `/admin/brandingDay` - Branding day setup
- `/admin/events` - Event management
- `/admin/notifications` - Notifications
- `/admin/liveevents` - Live event monitoring
- `/admin/FeedbackAnalytics` - Feedback analytics
- `/admin/LiveQueue` - Live queue management
- `/admin/createFeedbackForm` - Feedback form creation

### Student Routes (Require `student` role)

- `/student/feedback/:id` - Feedback form
- `/student/event-details/:id` - Event details
- `/student/show-events` - Show events
- `/student/CompanyDirectory` - Company directory
- `/student/interview-queue` - Interview queue
- `/student/profile` - Student profile

### Company Routes (Require `company_representative` role)

- `/company/:companyId/*` - All company-related pages

### Staff Routes (Require `staff` role)

- `/staff/dashboard` - Staff dashboard
- `/staff/attendance` - Attendance check-in
- `/staff/queue-support` - Queue support

## Usage Examples

### Protecting a Route

```javascript
// Protect a route for admin users only
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

// Protect a route for multiple roles
<Route
  path="/shared-page"
  element={
    <ProtectedRoute requiredRoles={['admin', 'staff']}>
      <SharedPage />
    </ProtectedRoute>
  }
/>
```

### Using the useAuth Hook

```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { user, role, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.first_name}!</h1>
      <p>Role: {role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Checking Roles in Components

```javascript
import useAuth from '../hooks/useAuth';

function MyComponent() {
  const { hasRole, hasAnyRole } = useAuth();

  return (
    <div>
      {hasRole('admin') && <AdminOnlyFeature />}
      {hasAnyRole(['admin', 'staff']) && <AdminOrStaffFeature />}
    </div>
  );
}
```

## Error Handling

### Unauthorized Access

- Users without proper authentication are redirected to `/login`
- Users with insufficient permissions are redirected to `/unauthorized`
- The unauthorized page provides options to go back, go home, or logout

### Loading States

- The ProtectedRoute component shows a loading spinner while checking authentication
- The useAuth hook provides a `loading` state for components to handle loading states

## Storage Management

The authentication system uses localStorage to persist user data:

```javascript
// Stored items
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
localStorage.setItem('role', role);
localStorage.setItem('refresh_token', refreshToken);
```

## Security Considerations

1. **Token Validation**: The system checks for token presence but doesn't validate JWT expiration (this should be added)
2. **Role Validation**: Server-side validation should always be implemented as client-side checks can be bypassed
3. **Sensitive Routes**: All sensitive operations should be validated on the server side
4. **Data Sanitization**: User data should be sanitized before storing or displaying

## Integration with Existing Code

The authentication system integrates with your existing localStorage-based authentication in `HomeNavbar.jsx`. The useAuth hook provides a centralized way to manage authentication state across your application.

## Future Enhancements

1. **JWT Token Validation**: Add proper JWT token expiration checking
2. **Refresh Token Logic**: Implement automatic token refresh
3. **API Integration**: Connect the AuthService login method to your backend API
4. **Permission System**: Add more granular permissions beyond roles
5. **Session Management**: Add session timeout and activity tracking
