import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from './LoginPage';

// Mock useAuth
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: mockLogin,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  describe('rendering', () => {
    it('renders the login form with email and password fields', () => {
      render(<LoginPage />);

      expect(screen.getByPlaceholderText('jouw@email.nl')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /inloggen/i })).toBeInTheDocument();
    });

    it('renders the Kaspers Advies branding', () => {
      render(<LoginPage />);

      expect(screen.getByText('Kaspers Advies')).toBeInTheDocument();
      expect(screen.getByText('Medewerker Portal')).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
      render(<LoginPage />);

      expect(screen.getByText('Wachtwoord vergeten?')).toBeInTheDocument();
    });

    it('renders client login link', () => {
      render(<LoginPage />);

      expect(screen.getByText(/Bent u een klant/i)).toBeInTheDocument();
      expect(screen.getByText('Klik hier om in te loggen')).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('requires email field', async () => {
      render(<LoginPage />);
      const user = userEvent.setup();

      const emailInput = screen.getByPlaceholderText('jouw@email.nl');
      expect(emailInput).toHaveAttribute('required');
    });

    it('requires password field', async () => {
      render(<LoginPage />);

      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('email input has type email', () => {
      render(<LoginPage />);

      const emailInput = screen.getByPlaceholderText('jouw@email.nl');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('password input has type password', () => {
      render(<LoginPage />);

      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('form submission', () => {
    it('calls login with email and password on submit', async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      render(<LoginPage />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('jouw@email.nl'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /inloggen/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('shows loading state during submission', async () => {
      // Make login hang to test loading state
      mockLogin.mockImplementation(() => new Promise(() => {}));
      render(<LoginPage />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('jouw@email.nl'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /inloggen/i }));

      await waitFor(() => {
        expect(screen.getByText(/Bezig met inloggen/i)).toBeInTheDocument();
      });
    });

    it('disables inputs during loading', async () => {
      mockLogin.mockImplementation(() => new Promise(() => {}));
      render(<LoginPage />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('jouw@email.nl'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /inloggen/i }));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('jouw@email.nl')).toBeDisabled();
        expect(screen.getByPlaceholderText('••••••••')).toBeDisabled();
      });
    });

    it('disables submit button during loading', async () => {
      mockLogin.mockImplementation(() => new Promise(() => {}));
      render(<LoginPage />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('jouw@email.nl'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
      await user.click(screen.getByRole('button', { name: /inloggen/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /bezig met inloggen/i })).toBeDisabled();
      });
    });
  });

  describe('error handling', () => {
    it('displays error message on failed login', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Ongeldige inloggegevens'));
      render(<LoginPage />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('jouw@email.nl'), 'bad@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /inloggen/i }));

      await waitFor(() => {
        expect(screen.getByText('Ongeldige inloggegevens')).toBeInTheDocument();
      });
    });

    it('displays fallback error message when error has no message', async () => {
      mockLogin.mockRejectedValueOnce('Unknown error');
      render(<LoginPage />);
      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('jouw@email.nl'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password');
      await user.click(screen.getByRole('button', { name: /inloggen/i }));

      await waitFor(() => {
        expect(screen.getByText('Login mislukt')).toBeInTheDocument();
      });
    });

    it('clears error message on new submission', async () => {
      mockLogin.mockRejectedValueOnce(new Error('First error'));
      mockLogin.mockResolvedValueOnce(undefined);
      render(<LoginPage />);
      const user = userEvent.setup();

      // First failed attempt
      await user.type(screen.getByPlaceholderText('jouw@email.nl'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('••••••••'), 'password');
      await user.click(screen.getByRole('button', { name: /inloggen/i }));

      await waitFor(() => {
        expect(screen.getByText('First error')).toBeInTheDocument();
      });

      // Second attempt - error should clear
      await user.click(screen.getByRole('button', { name: /inloggen/i }));

      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument();
      });
    });
  });

  describe('navigation', () => {
    it('navigates to client portal login when link clicked', async () => {
      render(<LoginPage />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Klik hier om in te loggen'));

      expect(mockNavigate).toHaveBeenCalledWith('/portal/login');
    });
  });
});

