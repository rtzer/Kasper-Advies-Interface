import { useAuth } from '@/contexts/AuthContext';

export function useRole() {
  const { user } = useAuth();
  
  return {
    role: user?.role || null,
    isAdmin: user?.role === 'admin',
    isAccountant: user?.role === 'accountant',
    isAssistant: user?.role === 'assistant',
  };
}

// Usage in components:
// const { isAdmin } = useRole();
// {isAdmin && <AdminOnlyButton />}
