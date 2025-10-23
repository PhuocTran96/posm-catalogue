/**
 * ProtectedRoute Component
 *
 * Route protection component for admin-only pages
 * Currently allows access for development purposes
 * Authentication will be implemented in future phases
 */

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // For development purposes, we'll allow access to admin routes
  // In a real application, this would check authentication status
  const isAuthenticated = true; // TODO: Implement actual authentication

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card-glass p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-warning-100 to-warning-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
              <svg className="w-10 h-10 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Authentication Required
            </h1>

            <p className="text-secondary-600 text-lg mb-8 max-w-md mx-auto">
              You need to be logged in as an administrator to access this page.
              Please authenticate to continue.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="btn-primary px-6 py-3">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>

              <Link
                to="/"
                className="btn-secondary px-6 py-3"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Catalogue
              </Link>
            </div>

            {/* Demo Notice */}
            <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-primary-700 text-sm">
                <strong>Demo Mode:</strong> Authentication is not implemented yet.
                Click "Sign In" to continue to the admin panel.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
};