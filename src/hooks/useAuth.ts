/**
 * useAuth Hook
 *
 * Custom React hook for managing authentication state
 * Provides login, logout, and session management functionality
 */

import { useState, useEffect, useCallback } from 'react';
import {
  login as authLogin,
  logout as authLogout,
  isAuthenticated,
  getSession,
  refreshSession,
} from '@/services/authService';
import type { UserSession } from '@/types';

interface UseAuthResult {
  isAuthenticated: boolean;
  session: UserSession | null;
  loading: boolean;
  error: Error | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

/**
 * Hook to manage authentication state
 * Automatically checks session on mount and provides login/logout functions
 */
export function useAuth(): UseAuthResult {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    try {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);

      if (authenticated) {
        const currentSession = getSession();
        setSession(currentSession);

        // Refresh session to extend expiry
        if (currentSession) {
          refreshSession();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to check authentication'));
      setIsAuth(false);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up session refresh interval (every 30 minutes)
  useEffect(() => {
    if (!isAuth) return;

    const refreshInterval = setInterval(() => {
      try {
        if (isAuthenticated()) {
          refreshSession();
          const currentSession = getSession();
          setSession(currentSession);
        } else {
          // Session expired
          setIsAuth(false);
          setSession(null);
        }
      } catch (err) {
        console.error('Failed to refresh session:', err);
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuth]);

  /**
   * Login function
   * @param password - Admin password
   * @returns Promise<boolean> - true if login successful
   */
  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const success = await authLogin(password);

      if (success) {
        setIsAuth(true);
        const currentSession = getSession();
        setSession(currentSession);
      } else {
        setError(new Error('Invalid password'));
      }

      return success;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Login failed');
      setError(errorObj);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout function
   * Clears session and updates state
   */
  const logout = useCallback((): void => {
    try {
      authLogout();
      setIsAuth(false);
      setSession(null);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err instanceof Error ? err : new Error('Logout failed'));
    }
  }, []);

  return {
    isAuthenticated: isAuth,
    session,
    loading,
    error,
    login,
    logout,
  };
}
