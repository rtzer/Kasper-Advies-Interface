import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/lib/api/users';

export function useRole() {
  const { user: authUser } = useAuth();
  const { data: currentUser } = useCurrentUser();
  
  // Use the mock user data for role checks
  const role = currentUser?.role || null;
  
  return {
    role,
    // New role checks for Owner/Admin/Employee system
    isOwner: role === 'Owner',
    isAdmin: role === 'Owner' || role === 'Admin',
    isEmployee: role === 'Employee',
    // Permissions
    canManageUsers: currentUser?.can_manage_users ?? false,
    canAccessBSN: currentUser?.can_access_bsn ?? false,
    canDeleteRecords: currentUser?.can_delete_records ?? false,
    // Legacy compatibility - map to new roles
    isAccountant: role === 'Owner' || role === 'Admin',
    isAssistant: role === 'Employee',
  };
}

// Usage in components:
// const { isAdmin, isOwner, canManageUsers } = useRole();
// {isAdmin && <AdminOnlyButton />}
