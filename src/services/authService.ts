import type { UserSession } from '@/types';
import { rateLimit, clearRateLimit } from '@/utils/security';

const SESSION_KEY = 'posm-catalogue-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Rate limiting: 5 attempts per 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

// In a real application, this would be stored securely on the server
// For this demo, we're using a simple client-side check
const DEMO_PASSWORD = 'admin123'; // TODO: Replace with proper authentication

/**
 * Authenticate admin user
 * @param password - Password attempt
 * @returns Promise resolving to true if authentication successful
 */
export async function login(password: string): Promise<boolean> {
  // Check rate limit
  if (!rateLimit('login', MAX_LOGIN_ATTEMPTS, RATE_LIMIT_WINDOW)) {
    throw new Error('Too many login attempts. Please try again in 15 minutes.');
  }

  // Simple demo authentication - in production, this would call an API
  if (password === DEMO_PASSWORD) {
    // Clear rate limit on successful login
    clearRateLimit('login');
    const session: UserSession = {
      isAuthenticated: true,
      sessionToken: generateSessionToken(),
      expiresAt: new Date(Date.now() + SESSION_DURATION).toISOString(),
      mode: 'admin',
    };

    // Store session
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }

  return false;
}

/**
 * Log out admin user
 */
export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if user is authenticated
 * @returns True if valid session exists
 */
export function isAuthenticated(): boolean {
  const session = getSession();
  return session !== null && session.isAuthenticated;
}

/**
 * Get current session
 * @returns UserSession if authenticated, null otherwise
 */
export function getSession(): UserSession | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);

    if (!sessionData) {
      return null;
    }

    const session: UserSession = JSON.parse(sessionData);

    // Check if session has expired
    const expiresAt = new Date(session.expiresAt).getTime();
    const now = Date.now();

    if (now > expiresAt) {
      // Session expired, clean up
      logout();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error reading session:', error);
    return null;
  }
}

/**
 * Refresh session expiration
 */
export function refreshSession(): void {
  const session = getSession();

  if (session) {
    session.expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

/**
 * Generate a random session token
 * @returns Random UUID-like string
 */
function generateSessionToken(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
