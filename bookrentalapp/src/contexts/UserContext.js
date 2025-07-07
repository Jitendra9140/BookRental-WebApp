import React, { createContext, useState, useEffect } from "react";
import { verifyUser, findUserByID } from '../Api/user';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  // Try to load user from localStorage first
  const loadUserFromStorage = () => {
    try {
      const cachedUser = localStorage.getItem('cachedUserData');
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  };

  const [user, setUser] = useState(loadUserFromStorage());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('cachedUserData', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    }
  }, [user]);
  
  // Verify user on initial load
  useEffect(() => {
    const verifyUserAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }
        
        const res = await verifyUser({ token });
        const userId = res.validuser._id;
        
        // Store user ID in localStorage
        window.localStorage.setItem('Id', userId);
        
        // Get full user details
        const userDetailsRes = await findUserByID(userId);
        const userData = userDetailsRes.data.user;
        
        setUser(userData);
        console.log("User authenticated and data loaded");
      } catch (error) {
        console.error('Authentication failed:', error);
        setError(error);
        
        // Clear invalid token
        if (error.response && error.response.status === 401) {
          window.localStorage.removeItem('token');
          window.localStorage.removeItem('Id');
          localStorage.removeItem('cachedUserData');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only verify with API if we don't have user data already
    if (!user) {
      verifyUserAuth();
    } else {
      setLoading(false);
    }
  }, []);
  
  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('Id');
      
      if (!userId) {
        setLoading(false);
        return;
      }
      
      const userDetailsRes = await findUserByID(userId);
      const userData = userDetailsRes.data.user;
      
      // Update user state (this will trigger the useEffect to update localStorage)
      setUser(userData);
      console.log("User data refreshed");
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle logout
  const logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('Id');
    localStorage.removeItem('cachedUserData');
    setUser(null);
  };
  
  return (
    <UserContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        refreshUserData,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;