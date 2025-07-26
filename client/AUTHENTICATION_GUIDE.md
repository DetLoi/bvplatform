# Authentication System Guide

This guide explains how the authentication system works in the Breakverse React app and how to use it properly.

## Overview

The authentication system uses React Context + localStorage to manage user login state and provides proper route protection and redirects based on authentication status.

## Components

### 1. AuthContext (`src/context/AuthContext.jsx`)

The main authentication context that manages:
- User login state
- localStorage persistence
- Login/logout functions
- Admin status checking

**Key Features:**
- Automatically loads user from localStorage on app start
- Provides loading state while checking authentication
- Handles login/logout with proper state management
- Includes admin status checking

**Usage:**
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { currentUser, login, logout, isAdmin, loading } = useAuth();
  
  // Check if user is logged in
  if (currentUser) {
    console.log('User is logged in:', currentUser.username);
  }
  
  // Check if user is admin
  if (isAdmin()) {
    console.log('User is admin');
  }
}
```

### 2. Route Protection Components

#### ProtectedRoute (`src/components/ProtectedRoute.jsx`)
Protects routes that require authentication.

**Features:**
- Redirects to login if user is not authenticated
- Saves intended destination for post-login redirect
- Shows loading spinner while checking auth status
- Can be configured to redirect logged-in users away (for public routes)

**Usage:**
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

#### PublicRoute (`src/components/PublicRoute.jsx`)
Protects routes that should only be accessible to non-authenticated users.

**Features:**
- Redirects to dashboard if user is already logged in
- Perfect for landing page and login page
- Shows loading spinner while checking auth status

**Usage:**
```jsx
<Route path="/" element={
  <PublicRoute>
    <Landing />
  </PublicRoute>
} />
```

#### AdminRoute (`src/components/AdminRoute.jsx`)
Protects routes that require admin privileges.

**Features:**
- Checks both authentication and admin status
- Redirects to login if not authenticated
- Redirects to dashboard if not admin
- Shows loading spinner while checking status

**Usage:**
```jsx
<Route path="/admin" element={
  <AdminRoute>
    <Admin />
  </AdminRoute>
} />
```

### 3. LoadingSpinner (`src/components/LoadingSpinner.jsx`)

Reusable loading component with different sizes.

**Usage:**
```jsx
import LoadingSpinner from './LoadingSpinner';

// Small spinner
<LoadingSpinner size="small" />

// Medium spinner (default)
<LoadingSpinner size="medium" />

// Large spinner
<LoadingSpinner size="large" />

// With custom className
<LoadingSpinner size="large" className="my-custom-class" />
```

## User Experience Flow

### 1. First Visit (Not Logged In)
1. User visits `http://localhost:5173`
2. AuthContext loads and checks localStorage
3. No user found, loading state resolves
4. User sees landing page with login header
5. User clicks "Log Ind" → redirected to `/login`

### 2. Login Process
1. User enters credentials on login page
2. Login API call is made
3. On success, user data is saved to localStorage and context
4. User is redirected to intended destination or dashboard
5. Header updates to show logged-in state

### 3. Subsequent Visits (Logged In)
1. User visits `http://localhost:5173`
2. AuthContext loads user from localStorage
3. User is automatically redirected to `/dashboard`
4. Header shows logged-in navigation

### 4. Logout Process
1. User clicks logout button in header
2. User data is cleared from context and localStorage
3. User is redirected to landing page
4. Header resets to logged-out state

## Route Structure

### Public Routes (Not Logged In)
- `/` - Landing page
- `/login` - Login page

### Protected Routes (Logged In Required)
- `/dashboard` - Main dashboard
- `/moves` - Moves management
- `/badges` - Badges management
- `/events` - Events management
- `/battles` - Battles management
- `/breakers` - Breakers directory
- `/profile` - User profile/crews

### Admin Routes (Admin Required)
- `/admin` - Admin dashboard
- `/admin/add-move` - Add new move
- `/admin/add-badge` - Add new badge
- `/admin/add-event` - Add new event
- `/admin/add-crew` - Add new crew
- `/admin/add-user` - Add new user

## Header Behavior

The header automatically adapts based on authentication status:

### Logged Out State
- Shows "Hjem" and "Log Ind" links
- Logo links to landing page
- No logout button

### Logged In State
- Shows full navigation menu
- Logo links to dashboard
- Shows logout button
- Admin users see additional "Admin" link

### Loading State
- Shows minimal header with just logo
- Prevents flash of wrong authentication state

## Best Practices

### 1. Always Use Route Protection
```jsx
// ✅ Good - Protected route
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// ❌ Bad - No protection
<Route path="/dashboard" element={<Dashboard />} />
```

### 2. Handle Loading States
```jsx
// ✅ Good - Check loading state
const { currentUser, loading } = useAuth();

if (loading) {
  return <LoadingSpinner />;
}

// ❌ Bad - Don't assume auth state
if (currentUser) {
  // This might be wrong during loading
}
```

### 3. Use Proper Route Types
```jsx
// ✅ Good - Use appropriate route protection
<PublicRoute>     // For landing/login pages
<ProtectedRoute>  // For authenticated pages
<AdminRoute>      // For admin-only pages
```

### 4. Handle Redirects Properly
```jsx
// ✅ Good - Use Navigate with state
<Navigate to="/login" state={{ from: location }} replace />

// ✅ Good - Handle redirect state in login
const from = location.state?.from?.pathname || '/dashboard';
navigate(from);
```

## Troubleshooting

### Issue: Header shows wrong state on first load
**Solution:** The header now properly handles loading states to prevent flashing.

### Issue: User not redirected after login
**Solution:** Check that the login function returns the correct response format and that the navigate call is working.

### Issue: Admin routes accessible to non-admin users
**Solution:** Use `AdminRoute` instead of `ProtectedRoute` for admin pages.

### Issue: Infinite redirect loops
**Solution:** Make sure route protection components are properly checking loading states before making redirect decisions.

## API Integration

The authentication system expects the login API to return:
```javascript
{
  success: true,
  user: {
    id: "user_id",
    username: "username",
    status: "active" | "admin",
    // ... other user properties
  }
}
```

The user object is automatically saved to localStorage and restored on app reload. 