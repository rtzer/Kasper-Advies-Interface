/**
 * Authentication Service for Kaspers Advies CRM
 *
 * Authenticates users via n8n webhook that validates credentials against Baserow.
 * Uses Basic Auth for webhook security and localStorage for session persistence.
 */

// User roles as returned by the n8n webhook
export type UserRole = 'admin' | 'accountant' | 'assistant' | 'client';

// Session-stored user data
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// n8n webhook response on successful login
interface AuthSuccessResponse {
  success: true;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

// n8n webhook response on failed login
interface AuthErrorResponse {
  success: false;
  error: string;
}

type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

// Session structure stored in localStorage
interface StoredSession {
  user: AuthUser;
  expiresAt: number; // Unix timestamp in milliseconds
}

// Configuration from environment variables
const AUTH_CONFIG = {
  webhookUrl: import.meta.env.VITE_N8N_AUTH_WEBHOOK_URL || '',
  basicAuthUsername: import.meta.env.VITE_N8N_AUTH_USERNAME || '',
  basicAuthPassword: import.meta.env.VITE_N8N_AUTH_PASSWORD || '',
  sessionDurationDays: Number(import.meta.env.VITE_SESSION_DURATION_DAYS) || 30,
} as const;

const STORAGE_KEY = 'ka_auth_session';

/**
 * Validates that all required environment variables are configured
 */
function validateConfig(): void {
  if (!AUTH_CONFIG.webhookUrl) {
    throw new Error('VITE_N8N_AUTH_WEBHOOK_URL is not configured');
  }
  if (!AUTH_CONFIG.basicAuthUsername || !AUTH_CONFIG.basicAuthPassword) {
    throw new Error('N8N Basic Auth credentials are not configured');
  }
}

/**
 * Creates Basic Auth header value from credentials
 */
function createBasicAuthHeader(): string {
  const credentials = `${AUTH_CONFIG.basicAuthUsername}:${AUTH_CONFIG.basicAuthPassword}`;
  return `Basic ${btoa(credentials)}`;
}

/**
 * Calculates session expiration timestamp
 */
function calculateExpirationTimestamp(): number {
  const durationMs = AUTH_CONFIG.sessionDurationDays * 24 * 60 * 60 * 1000;
  return Date.now() + durationMs;
}

/**
 * Checks if a stored session is still valid (not expired)
 */
function isSessionValid(session: StoredSession): boolean {
  return session.expiresAt > Date.now();
}

class AuthService {
  /**
   * Authenticates user against n8n webhook
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Authenticated user data
   * @throws Error if authentication fails or webhook is misconfigured
   */
  async login(email: string, password: string): Promise<AuthUser> {
    validateConfig();

    const response = await fetch(AUTH_CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': createBasicAuthHeader(),
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
      }),
    });

    // Handle non-200 responses
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Ongeldige inloggegevens');
      }
      throw new Error('Er is een fout opgetreden bij het inloggen. Probeer het later opnieuw.');
    }

    const data: AuthResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Ongeldige inloggegevens');
    }

    // Build user object from successful response
    const user: AuthUser = {
      id: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
    };

    // Store session with expiration
    const session: StoredSession = {
      user,
      expiresAt: calculateExpirationTimestamp(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

    return user;
  }

  /**
   * Retrieves the current authenticated user from stored session
   *
   * @returns User data if session exists and is valid, null otherwise
   */
  getCurrentUser(): AuthUser | null {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return null;
    }

    try {
      const session: StoredSession = JSON.parse(storedData);

      // Check if session has expired
      if (!isSessionValid(session)) {
        this.logout(); // Clean up expired session
        return null;
      }

      return session.user;
    } catch {
      // Invalid JSON in storage, clean up
      this.logout();
      return null;
    }
  }

  /**
   * Logs out the current user by clearing the stored session
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Checks if a user is currently authenticated with a valid session
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Gets the remaining session time in milliseconds
   *
   * @returns Remaining time in ms, or 0 if no valid session
   */
  getSessionTimeRemaining(): number {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return 0;
    }

    try {
      const session: StoredSession = JSON.parse(storedData);
      const remaining = session.expiresAt - Date.now();
      return remaining > 0 ? remaining : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Extends the current session by resetting the expiration timer
   * Useful for "remember me" functionality or activity-based extension
   */
  extendSession(): void {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return;
    }

    try {
      const session: StoredSession = JSON.parse(storedData);
      if (isSessionValid(session)) {
        session.expiresAt = calculateExpirationTimestamp();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      }
    } catch {
      // Ignore errors for extension
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
