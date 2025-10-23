import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Taak } from '@/types';
import { mockTaken } from '@/lib/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useTaken(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['taken', filters],
    queryFn: async () => {
      await delay(300);
      
      let filtered = [...mockTaken];
      
      if (filters?.status) {
        filtered = filtered.filter(t => t.status === filters.status);
      }
      
      if (filters?.toegewezen_aan) {
        filtered = filtered.filter(t => t.toegewezen_aan === filters.toegewezen_aan);
      }
      
      return {
        results: filtered,
        count: filtered.length,
      };
    },
  });
}

export function useOpenstaandeTaken() {
  return useQuery({
    queryKey: ['taken', 'openstaand'],
    queryFn: async () => {
      await delay(200);
      const openstaand = mockTaken.filter(t => t.status !== 'Afgerond');
      return {
        results: openstaand,
        count: openstaand.length,
      };
    },
  });
}

export function useTaak(taakId: string) {
  return useQuery({
    queryKey: ['taken', taakId],
    queryFn: async () => {
      await delay(200);
      return mockTaken.find(t => t.id === taakId) || null;
    },
    enabled: !!taakId,
  });
}

export function useCreateTaak() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Taak>) => {
      await delay(500);
      return { id: `${Date.now()}`, ...data } as Taak;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taken'] });
    },
  });
}

export function useUpdateTaak() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Taak> }) => {
      await delay(300);
      return { ...mockTaken.find(t => t.id === id)!, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taken'] });
    },
  });
}
