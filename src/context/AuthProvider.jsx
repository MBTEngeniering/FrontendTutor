import { AuthContext } from './AuthContext.jsx';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ApiService from "../api/ApiService.js";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

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
            // logout();
            return;
          }

          // Convert timestamp string to milliseconds
          const storedTimestamp = new Date(storedUser.timestamp).getTime();
          const currentTime = Math.round(Date.now() / 1000, 0);
          console.log('Stored  time:', storedTimestamp);
          console.log('Current time:', currentTime);

          // Check if the stored user is expired
          if (currentTime > storedTimestamp) {
            await logout();
            window.location.href = '/login'; // Redirect to login page
          }

          if (storedUser) {
            setUser(storedUser);
          }
        };
        initializeAuth();
      }, []
  )
  ;

  const login = useCallback(async ({username, password}) => {
    try {
      const response = await ApiService.post('/api/auth/authenticate', {
        emailOrPhoneNumber: username,
        password: password
      });

      if (!response.data) throw new Error('Login failed: No data returned');

      const userData = response.data;
      setUser(userData);
      setUserInStorage(userData);
      return userData; // Ensure this returns the user data
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  }, [setUser, setUserInStorage]);


  const logout = async () => {
    // Implement logout logic here
    setUser(null);
    removeUserFromStorage();
    const response = await ApiService.get('/api/auth/logout');
    if (response.status === 200) {
      console.log('Logout successful');
      MySwal.fire({
        icon: 'success',
        title: 'Logout successful',
        text: 'You have been logged out successfully.',
        timer: 2000
      });
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
