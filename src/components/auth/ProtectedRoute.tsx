import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ka-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="w-12 h-12 text-ka-green animate-spin mx-auto mb-4" />
          <p className="text-ka-gray-600 dark:text-gray-400">Sessie controleren...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
