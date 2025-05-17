import { AuthContext } from './AuthContext.jsx';
import React, { useEffect, useMemo, useState } from "react";
import ApiService from "../api/ApiService.js";

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  // Local storage helper functions
  const getUserFromStorage = () => JSON.parse(localStorage.getItem('user'));
  const setUserInStorage = (userData) => localStorage.setItem('user', JSON.stringify(userData));
  const removeUserFromStorage = () => localStorage.removeItem('user');

  useEffect(() => {
    console.log('useEffect AuthContext');
    const initializeAuth = async () => {
      const storedUser = getUserFromStorage();
      if (!storedUser) {
        logout();
        return;
      }

      // Check if the stored user is expired
      if (Math.floor(new Date().getTime() / 1000) > storedUser.timestamp) {
        await logout();
        alert('Session expired. Please log in again.');
        return;
      }

      if (storedUser) {
        setUser(storedUser);
      }
    };
    initializeAuth();
  }, []);

  const login = async ({username, password}) => {
    // Implement login logic here (e.g., API call)
    try {
      const response = await ApiService.post('/api/auth/authenticate', {
        emailOrPhoneNumber: username,
        password: password
      });

      if (!response.data) {
        throw new Error('Login failed: No data returned');
      }

      const userData = response.data;
      setUser(userData);
      setUserInStorage(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  const logout = async () => {
    // Implement logout logic here
    setUser(null);
    removeUserFromStorage();
    const response = await ApiService.get('/api/auth/logout');
    if (response.status === 200) {
      console.log('Logout successful');
    } else {
      console.error('Logout failed');
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => {
      const newUser = {...prev, ...updatedData};
      setUserInStorage(newUser);
      return newUser;
    });
  };


  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    updateUser
  }), [user]);

  return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
  );
}
