import React, { createContext, useState, useEffect } from "react";
import { verifyUser, findUserByID } from '../Api/user';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        }
      } finally {
        setLoading(false);
      }
    };

    verifyUserAuth();
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