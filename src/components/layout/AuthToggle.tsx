/**
 * AuthToggle Component
 *
 * Authentication toggle component for switching between viewer and admin modes
 * Provides login/logout functionality with a modal dialog
 */

import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthToggleProps {
  className?: string;
}

/**
 * AuthToggle component that shows login/logout functionality
 * Includes a modal dialog for password authentication
 */
export function AuthToggle({ className = '' }: AuthToggleProps) {
  const { isAuthenticated, login, logout, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle login attempt
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await login(password);
      if (success) {
        setShowLoginModal(false);
        setPassword('');
        // Navigate to admin if we're not already there
        if (!location.pathname.startsWith('/admin')) {
          navigate('/admin');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [password, login, navigate, location.pathname]);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    // Navigate to home if we're in admin mode
    if (location.pathname.startsWith('/admin')) {
      navigate('/');
    }
  }, [logout, navigate, location.pathname]);

  // Close modal and reset state
  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
    setPassword('');
  }, []);

  // If still loading authentication state, show loading indicator
  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className={`flex items-center space-x-3 ${className}`}>
        {isAuthenticated ? (
          /* Authenticated state - show logout button */
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Admin</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              title="Logout from admin mode"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        ) : (
          /* Unauthenticated state - show login button */
          <button
            onClick={() => setShowLoginModal(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            title="Login to admin mode"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Admin Login
          </button>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCloseModal}
          ></div>

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
              {/* Modal Content */}
              <form onSubmit={handleLogin} className="px-6 py-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Admin Login
                  </h3>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error.message || 'Invalid password. Please try again.'}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!password.trim() || isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Logging in...
                      </span>
                    ) : (
                      'Login'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthToggle;