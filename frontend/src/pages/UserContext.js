import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        sessionStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  // Enhanced setUser function that also handles session storage
  const loginUser = (userData) => {
    // Transform MongoDB user data to consistent format
    const formattedUser = {
      user_id: userData.user_id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      name: `${userData.first_name} ${userData.last_name}`,
      user_role: userData.user_role,
      email_address: userData.email_address,
      user_description: userData.user_description || "",
      _id: userData._id // Keep MongoDB ID for updates
    };
    
    setUser(formattedUser);
    sessionStorage.setItem("currentUser", JSON.stringify(formattedUser));
  };

  // Logout function
  const logoutUser = () => {
    setUser(null);
    sessionStorage.removeItem("currentUser");
  };

  // Update user data (for profile edits)
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    // Update display name if first_name or last_name changed
    if (updatedData.first_name || updatedData.last_name) {
      updatedUser.name = `${updatedUser.first_name} ${updatedUser.last_name}`;
    }
    setUser(updatedUser);
    sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.user_role === 'Admin';
  };

  // Check if user is student
  const isStudent = () => {
    return user?.user_role === 'Student';
  };

  const value = {
    user,
    setUser: loginUser, // Use enhanced login function
    loginUser,
    logoutUser,
    updateUser,
    isAdmin,
    isStudent,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}