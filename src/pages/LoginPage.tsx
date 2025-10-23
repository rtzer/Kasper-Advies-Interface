import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/inbox');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ka-gray-50 to-ka-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-ka-green rounded-2xl mb-6 shadow-lg">
            <span className="text-white text-4xl font-bold">K</span>
          </div>
          <h1 className="text-3xl font-bold text-ka-navy dark:text-white mb-2">Kaspers Advies</h1>
          <p className="text-ka-gray-600 dark:text-gray-400">Communication Hub</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold text-ka-navy dark:text-white mb-6">Inloggen</h2>

          {/* Demo credentials notice */}
          <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Demo accounts:</strong><br />
              harm-jan@kaspersadvies.nl / demo123<br />
              jan@kaspersadvies.nl / demo123<br />
              linda@kaspersadvies.nl / demo123
            </AlertDescription>
          </Alert>

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
                  placeholder="jouw@email.nl"
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
                onClick={() => alert('Wachtwoord reset via Baserow na migratie')}
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
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-ka-gray-500 dark:text-gray-400">
            <strong>Development Modus</strong><br />
            Mock authenticatie - wordt vervangen door Baserow
          </p>
        </div>
      </div>
    </div>
  );
}
