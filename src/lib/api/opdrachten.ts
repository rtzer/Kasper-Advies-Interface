import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Opdracht } from '@/types';
import { mockOpdrachten } from '@/lib/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useOpdrachten(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['opdrachten', filters],
    queryFn: async () => {
      await delay(300);
      
      let filtered = [...mockOpdrachten];
      
      if (filters?.status) {
        filtered = filtered.filter(o => o.status === filters.status);
      }
      
      if (filters?.klant_id) {
        filtered = filtered.filter(o => o.klant_id === filters.klant_id);
      }
      
      return {
        results: filtered,
        count: filtered.length,
      };
    },
  });
}

export function useActieveOpdrachten() {
  return useQuery({
    queryKey: ['opdrachten', 'actief'],
    queryFn: async () => {
      await delay(200);
      const actief = mockOpdrachten.filter(o => 
        o.status !== 'Afgerond' && o.status !== 'Ingediend'
      );
      return {
        results: actief,
        count: actief.length,
      };
    },
  });
}

export function useOpdracht(opdrachtId: string) {
  return useQuery({
    queryKey: ['opdrachten', opdrachtId],
    queryFn: async () => {
      await delay(200);
      return mockOpdrachten.find(o => o.id === opdrachtId) || null;
    },
    enabled: !!opdrachtId,
  });
}

export function useCreateOpdracht() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Opdracht>) => {
      await delay(500);
      return { id: `${Date.now()}`, ...data } as Opdracht;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opdrachten'] });
    },
  });
}

export function useUpdateOpdracht() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Opdracht> }) => {
      await delay(300);
      return { ...mockOpdrachten.find(o => o.id === id)!, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opdrachten'] });
    },
  });
}
