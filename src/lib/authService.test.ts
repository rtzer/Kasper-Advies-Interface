import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock fetch globally before importing the module
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Import after mocking
import { authService } from './authService';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('stores session in localStorage on successful login', async () => {
      const mockResponse = {
        success: true,
        userId: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const user = await authService.login('test@example.com', 'password123');

      expect(user).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
      });

      // Verify session was stored
      const storedSession = localStorage.getItem('ka_auth_session');
      expect(storedSession).not.toBeNull();

      const session = JSON.parse(storedSession!);
      expect(session.user.email).toBe('test@example.com');
      expect(session.expiresAt).toBeGreaterThan(Date.now());
    });

    it('throws error on invalid credentials (401)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(authService.login('bad@example.com', 'wrong')).rejects.toThrow(
        'Ongeldige inloggegevens'
      );
    });

    it('throws error when API returns success: false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: false, error: 'Account geblokkeerd' }),
      });

      await expect(authService.login('blocked@example.com', 'password')).rejects.toThrow(
        'Account geblokkeerd'
      );
    });

    it('calls the correct API endpoint with webhookType', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            userId: '1',
            email: 'test@test.com',
            name: 'Test',
            role: 'admin',
          }),
      });

      await authService.login('test@test.com', 'pass');

      expect(mockFetch).toHaveBeenCalledWith('/api/n8n/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookType: 'auth',
          email: 'test@test.com',
          password: 'pass',
        }),
      });
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no session exists', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('returns user from valid session', () => {
      const session = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' },
        expiresAt: Date.now() + 1000 * 60 * 60, // 1 hour from now
      };
      localStorage.setItem('ka_auth_session', JSON.stringify(session));

      const user = authService.getCurrentUser();
      expect(user).toEqual(session.user);
    });

    it('returns null and clears expired session', () => {
      const session = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' },
        expiresAt: Date.now() - 1000, // Expired
      };
      localStorage.setItem('ka_auth_session', JSON.stringify(session));

      expect(authService.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('ka_auth_session')).toBeNull();
    });

    it('returns null and clears invalid JSON', () => {
      localStorage.setItem('ka_auth_session', 'invalid-json');

      expect(authService.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('ka_auth_session')).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears session from localStorage', () => {
      localStorage.setItem('ka_auth_session', JSON.stringify({ user: {}, expiresAt: 0 }));

      authService.logout();

      expect(localStorage.getItem('ka_auth_session')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when valid session exists', () => {
      const session = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' },
        expiresAt: Date.now() + 1000 * 60 * 60,
      };
      localStorage.setItem('ka_auth_session', JSON.stringify(session));

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('returns false when no session exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('extendSession', () => {
    it('updates expiration time for valid session', () => {
      const originalExpiration = Date.now() + 1000 * 60; // 1 minute
      const session = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' },
        expiresAt: originalExpiration,
      };
      localStorage.setItem('ka_auth_session', JSON.stringify(session));

      authService.extendSession();

      const updatedSession = JSON.parse(localStorage.getItem('ka_auth_session')!);
      expect(updatedSession.expiresAt).toBeGreaterThan(originalExpiration);
    });

    it('does nothing when no session exists', () => {
      authService.extendSession();
      expect(localStorage.getItem('ka_auth_session')).toBeNull();
    });
  });

  describe('getSessionTimeRemaining', () => {
    it('returns remaining time in milliseconds', () => {
      const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour
      const session = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' },
        expiresAt,
      };
      localStorage.setItem('ka_auth_session', JSON.stringify(session));

      const remaining = authService.getSessionTimeRemaining();
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(1000 * 60 * 60);
    });

    it('returns 0 when no session exists', () => {
      expect(authService.getSessionTimeRemaining()).toBe(0);
    });

    it('returns 0 for expired session', () => {
      const session = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'admin' },
        expiresAt: Date.now() - 1000,
      };
      localStorage.setItem('ka_auth_session', JSON.stringify(session));

      expect(authService.getSessionTimeRemaining()).toBe(0);
    });
  });
});

