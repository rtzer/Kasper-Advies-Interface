import { useQuery } from '@tanstack/react-query';
import { baserowClient, BaserowResponse, BaserowSelectOption } from './baserowClient';

// Baserow user from table 773
export interface BaserowUser {
  id: number;
  full_name: string;
  email: string;
  role: BaserowSelectOption | null;
}

const USERS_TABLE_ID = 773;

export function useAccountManagers() {
  return useQuery({
    queryKey: ['account-managers'],
    queryFn: async () => {
      const response = await baserowClient.getTableRows<BaserowUser>(USERS_TABLE_ID, {
        size: 200,
      });

      // Filter out users with role "Client"
      const accountManagers = response.results.filter(user => {
        const role = user.role?.value;
        return role !== 'Client';
      });

      return accountManagers;
    },
  });
}
