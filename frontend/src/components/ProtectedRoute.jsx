import { useUser } from '../pages/UserContext';
import { Navigate } from 'react-router-dom';

// Protected route for admin-only access
export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useUser();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin()) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center", 
        color: "#d32f2f",
        fontFamily: "Poppins, sans-serif"
      }}>
        <h2>Access Denied</h2>
        <p>This page is only accessible to administrators.</p>
        <p>Your current role: {user.user_role}</p>
      </div>
    );
  }
  
  return children;
}

// Protected route for authenticated users
export function AuthRoute({ children }) {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

// Public route (redirects logged-in users away from login)
export function PublicRoute({ children }) {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
}
