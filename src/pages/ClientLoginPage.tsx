import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export default function ClientLoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/portal'); // Redirect to client portal
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login mislukt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ka-navy/5 to-ka-green/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-ka-green rounded-2xl mb-6 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-ka-navy dark:text-white mb-2">Kaspers Advies</h1>
          <p className="text-ka-gray-600 dark:text-gray-400">Klanten Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-ka-navy dark:text-white mb-6">Welkom terug</h2>

          {error && (
            <Alert className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-sm text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ka-gray-700 dark:text-gray-300 mb-2">
                E-mailadres
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ka-gray-400 dark:text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="uw@email.nl"
                  className="pl-10"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-ka-gray-700 dark:text-gray-300 mb-2">
                Wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ka-gray-400 dark:text-gray-500" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-ka-green hover:text-ka-green/80 dark:text-ka-green dark:hover:text-ka-green/80 transition-colors"
                onClick={() => alert('Neem contact op met Kaspers Advies voor een wachtwoord reset')}
              >
                Wachtwoord vergeten?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-ka-green hover:bg-ka-green/90 text-white h-12"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Bezig met inloggen...
                </>
              ) : (
                'Inloggen'
              )}
            </Button>
          </form>

          {/* Info box */}
          <div className="mt-6 p-4 bg-ka-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-sm text-ka-gray-600 dark:text-gray-400 text-center">
              Via dit portaal kunt u:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-ka-gray-600 dark:text-gray-400">
              <li>✓ Uw projecten bekijken</li>
              <li>✓ Documenten uploaden</li>
              <li>✓ Status updates ontvangen</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-ka-gray-600 dark:text-gray-400">
            Bent u een medewerker?{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-ka-green hover:text-ka-green/80 font-medium"
            >
              Klik hier om in te loggen
            </button>
          </p>
          <p className="text-sm text-ka-gray-500 dark:text-gray-400">
            Nog geen account? Neem contact op met Kaspers Advies
          </p>
        </div>
      </div>
    </div>
  );
}
