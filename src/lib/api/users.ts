import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types';
import { mockUsers } from '@/lib/mockUsers';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      await delay(300);
      return [...mockUsers];
    },
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      await delay(200);
      const user = mockUsers.find(u => u.id === id);
      if (!user) throw new Error('Gebruiker niet gevonden');
      return user;
    },
    enabled: !!id,
  });
}

export function useCurrentUser() {
  // Gets the logged-in user from auth context, matched with full user data
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      await delay(100);
      // Get authenticated user email from localStorage session
      const sessionData = localStorage.getItem('ka_auth_session');
      if (!sessionData) {
        return null;
      }

      try {
        const session = JSON.parse(sessionData);
        const email = session?.user?.email;
        if (!email) return null;

        // Match with full user data from mockUsers (will be Baserow later)
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        return user || null;
      } catch {
        return null;
      }
    },
  });
}

export function useUserPermissions() {
  const { data: currentUser } = useCurrentUser();
  
  return {
    canManageUsers: currentUser?.can_manage_users ?? false,
    canDeleteRecords: currentUser?.can_delete_records ?? false,
    canAccessBSN: currentUser?.can_access_bsn ?? false,
    canEditBSNAccess: currentUser?.role === 'Owner',
    isOwner: currentUser?.role === 'Owner',
    isAdmin: currentUser?.role === 'Owner' || currentUser?.role === 'Admin',
  };
}

interface CreateUserData {
  voornaam: string;
  achternaam: string;
  email: string;
  phone?: string;
  mobile?: string;
  role: 'Admin' | 'Employee';
  department: User['department'];
  specialisatie?: string[];
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      await delay(500);
      
      const newId = `usr-${String(mockUsers.length + 1).padStart(3, '0')}`;
      const newUserId = `USR-${String(mockUsers.length + 1).padStart(3, '0')}`;
      
      const newUser: User = {
        id: newId,
        user_id: newUserId,
        name: `${data.voornaam} ${data.achternaam}`,
        voornaam: data.voornaam,
        achternaam: data.achternaam,
        email: data.email,
        role: data.role,
        department: data.department,
        specialisatie: data.specialisatie || [],
        is_active: true,
        phone: data.phone,
        mobile: data.mobile,
        can_access_bsn: false,
        can_manage_users: data.role === 'Admin',
        can_delete_records: false,
        language: 'nl',
        theme: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      mockUsers.push(newUser);
      return newUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      await delay(400);
      
      const index = mockUsers.findIndex(u => u.id === id);
      if (index === -1) throw new Error('Gebruiker niet gevonden');
      
      // Prevent changing Owner role
      if (mockUsers[index].role === 'Owner' && data.role && data.role !== 'Owner') {
        throw new Error('Owner rol kan niet worden gewijzigd');
      }
      
      mockUsers[index] = {
        ...mockUsers[index],
        ...data,
        name: data.voornaam && data.achternaam 
          ? `${data.voornaam} ${data.achternaam}` 
          : mockUsers[index].name,
        updated_at: new Date().toISOString(),
      };
      
      return mockUsers[index];
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      await delay(200);
      
      const activeUsers = mockUsers.filter(u => u.is_active);
      const totalClients = activeUsers.reduce((sum, u) => sum + (u.current_client_count || 0), 0);
      
      return {
        totalUsers: mockUsers.length,
        activeUsers: activeUsers.length,
        totalClients,
        avgClientsPerUser: Math.round(totalClients / activeUsers.length),
      };
    },
  });
}
