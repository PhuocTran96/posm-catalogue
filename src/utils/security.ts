/**
 * Security Utilities
 *
 * Functions for input sanitization, XSS prevention, and security best practices
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * Removes script tags, event handlers, and dangerous attributes
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}

/**
 * Sanitize text input for display
 * Escapes HTML entities to prevent XSS
 */
export function sanitizeText(input: string): string {
  if (!input) return '';

  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate and sanitize URL
 * Only allows http, https, and relative URLs
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  // Trim whitespace
  const trimmed = url.trim();

  // Allow relative URLs
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed;
  }

  // Check for valid protocols
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Invalid URL
  }

  // Return empty string for unsafe URLs
  return '';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize filename for safe storage
 * Removes path traversal attempts and special characters
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';

  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');
  sanitized = sanitized.replace(/[\/\\]/g, '');

  // Remove special characters except alphanumeric, dash, underscore, and dot
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized;
}

/**
 * Validate JSON string safely without eval
 */
export function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limiting helper for client-side
 * Returns true if action is allowed, false if rate limited
 */
export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  const storageKey = `rate_limit_${key}`;
  const now = Date.now();

  try {
    const data = localStorage.getItem(storageKey);
    if (!data) {
      // First attempt
      localStorage.setItem(storageKey, JSON.stringify({
        attempts: 1,
        resetTime: now + windowMs,
      }));
      return true;
    }

    const { attempts, resetTime } = JSON.parse(data);

    // Reset if window expired
    if (now > resetTime) {
      localStorage.setItem(storageKey, JSON.stringify({
        attempts: 1,
        resetTime: now + windowMs,
      }));
      return true;
    }

    // Check if under limit
    if (attempts < maxAttempts) {
      localStorage.setItem(storageKey, JSON.stringify({
        attempts: attempts + 1,
        resetTime,
      }));
      return true;
    }

    // Rate limited
    return false;
  } catch {
    // If localStorage fails, allow the action
    return true;
  }
}

/**
 * Clear rate limit for a key
 */
export function clearRateLimit(key: string): void {
  const storageKey = `rate_limit_${key}`;
  localStorage.removeItem(storageKey);
}

/**
 * Validate password strength
 * Returns an object with validation results
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters (!@#$%^&*)');
  }

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
}

/**
 * Content Security Policy helper
 * Generate CSP meta tag content
 */
export function generateCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  isValidEmail,
  sanitizeFilename,
  isValidJson,
  rateLimit,
  clearRateLimit,
  validatePasswordStrength,
  generateCSP,
};
