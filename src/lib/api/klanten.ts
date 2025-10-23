import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Klant } from '@/types';
import { mockKlanten } from '@/lib/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useKlanten(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['klanten', filters],
    queryFn: async () => {
      await delay(300);
      
      let filtered = [...mockKlanten];
      
      if (filters?.status) {
        filtered = filtered.filter(k => k.status === filters.status);
      }
      
      return {
        results: filtered,
        count: filtered.length,
      };
    },
  });
}

export function useActieveKlanten() {
  return useQuery({
    queryKey: ['klanten', 'actief'],
    queryFn: async () => {
      await delay(200);
      const actief = mockKlanten.filter(k => 
        k.status === 'Actief' && !k.status_historisch
      );
      return {
        results: actief,
        count: actief.length,
      };
    },
  });
}

export function useKlant(klantId: string) {
  return useQuery({
    queryKey: ['klanten', klantId],
    queryFn: async () => {
      await delay(200);
      return mockKlanten.find(k => k.id === klantId) || null;
    },
    enabled: !!klantId,
  });
}

export function useCreateKlant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Klant>) => {
      await delay(500);
      const newKlant: Klant = {
        id: `${Date.now()}`,
        klant_nummer: `KL-2024-${String(mockKlanten.length + 1).padStart(4, '0')}`,
        ...data,
      } as Klant;
      return newKlant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['klanten'] });
    },
  });
}

export function useUpdateKlant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Klant> }) => {
      await delay(300);
      return { ...mockKlanten.find(k => k.id === id)!, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['klanten'] });
    },
  });
}
