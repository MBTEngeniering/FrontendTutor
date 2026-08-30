import { AuthContext } from './AuthContext.jsx';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ApiService from "../api/ApiService.js";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content';
import { userRoleIdToName, userRoleIdToPage } from "../util/mapping.js";

const MySwal = withReactContent(Swal);

const normalizeUser = (userData) => {
  if (!userData) {
    return null;
  }

  const normalized = {
    ...userData,
    isLoggedIn: Boolean(userData.isLoggedIn),
    timestamp: userData.timestamp ?? Date.now() + (60 * 60 * 1000),
  };

  if (normalized.userRoleIds?.length === 1 && !normalized.selectedUserRoleId) {
    normalized.selectedUserRoleId = normalized.userRoleIds[0];
    normalized.userRole = userRoleIdToName[normalized.userRoleIds[0]];
    normalized.userPage = userRoleIdToPage[normalized.userRoleIds[0]];
    normalized.isLoggedIn = true;
  }

  return normalized;
};

export const AuthProvider = ({children}) => {
  const getUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    try {
      return normalizeUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Could not parse user from storage:', error);
      localStorage.removeItem('user');
      return null;
    }
  };

  const [user, setUser] = useState(() => getUserFromStorage());
  const [isAuthReady, setIsAuthReady] = useState(false);

  const setUserInStorage = (userData) => localStorage.setItem('user', JSON.stringify(userData));
  const removeUserFromStorage = () => localStorage.removeItem('user');

  const logout = useCallback(async () => {
    setUser(null);
    removeUserFromStorage();

    try {
      const response = await ApiService.get('/api/auth/logout');
      if (response.status === 200) {
        console.log('Logout successful');
        MySwal.fire({
          icon: 'success',
          title: 'Logout successful',
          text: 'You have been logged out successfully.',
          timer: 1800
        });
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = getUserFromStorage();

      if (!storedUser) {
        setIsAuthReady(true);
        return;
      }

      const storedTimestamp = Number(new Date(storedUser.timestamp ?? Date.now()).getTime());
      const currentTime = Date.now();

      if (storedTimestamp && currentTime > storedTimestamp) {
        await logout();
        setIsAuthReady(true);
        window.location.href = '/login';
        return;
      }

      setUser(storedUser);
      setIsAuthReady(true);
    };

    initializeAuth();
  }, [logout]);

  const login = useCallback(async ({username, password}) => {
    const response = await ApiService.post('/api/auth/authenticate', {
      emailOrPhoneNumber: username,
      password: password
    });

    if (!response.data) {
      throw new Error('Login failed: No data returned');
    }

    const userData = normalizeUser({
      ...response.data,
      isLoggedIn: true,
      timestamp: Date.now() + (60 * 60 * 1000),
    });

    if (userData.userRoleIds?.length === 1) {
      userData.selectedUserRoleId = userData.userRoleIds[0];
      userData.userRole = userRoleIdToName[userData.userRoleIds[0]];
      userData.userPage = userRoleIdToPage[userData.userRoleIds[0]];
    }

    setUser(userData);
    setUserInStorage(userData);
    return userData;
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => {
      const newUser = normalizeUser({
        ...prev,
        ...updatedData,
        isLoggedIn: true,
        timestamp: Date.now() + (60 * 60 * 1000),
      });
      setUserInStorage(newUser);
      return newUser;
    });
  }, []);

  const contextValue = useMemo(() => ({
    user,
    isAuthReady,
    login,
    logout,
    updateUser
  }), [user, isAuthReady, login, logout, updateUser]);

  return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
  );
};
