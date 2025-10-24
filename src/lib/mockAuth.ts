// Mock authentication service - will be replaced with Baserow later
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'accountant' | 'assistant' | 'client';
}

// Mock users database (for development only)
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'harm-jan@kaspersadvies.nl': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'harm-jan@kaspersadvies.nl',
      full_name: 'Harm-Jan Kaspers',
      role: 'admin',
    },
  },
  'jan@kaspersadvies.nl': {
    password: 'demo123',
    user: {
      id: '2',
      email: 'jan@kaspersadvies.nl',
      full_name: 'Jan Jansen',
      role: 'accountant',
    },
  },
  'linda@kaspersadvies.nl': {
    password: 'demo123',
    user: {
      id: '3',
      email: 'linda@kaspersadvies.nl',
      full_name: 'Linda Prins',
      role: 'assistant',
    },
  },
  'klant@voorbeeld.nl': {
    password: 'demo123',
    user: {
      id: '4',
      email: 'klant@voorbeeld.nl',
      full_name: 'Hans Mulder',
      role: 'client',
    },
  },
};

class MockAuthService {
  private static STORAGE_KEY = 'ka_mock_session';

  // Login
  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const userRecord = MOCK_USERS[email.toLowerCase().trim()];

    if (!userRecord || userRecord.password !== password) {
      throw new Error('Ongeldige inloggegevens');
    }

    // Store session
    localStorage.setItem(MockAuthService.STORAGE_KEY, JSON.stringify(userRecord.user));

    return userRecord.user;
  }

  // Get current user
  getCurrentUser(): User | null {
    const stored = localStorage.getItem(MockAuthService.STORAGE_KEY);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem(MockAuthService.STORAGE_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const mockAuth = new MockAuthService();
export type { User };
