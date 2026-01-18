import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Interactie } from '@/types';
import { mockInteracties } from '@/lib/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useInteracties(filters?: Record<string, string | undefined>) {
  return useQuery({
    queryKey: ['interacties', filters],
    queryFn: async () => {
      await delay(300);
      
      let filtered = [...mockInteracties];
      
      if (filters?.klant_id) {
        filtered = filtered.filter(i => i.klant_id === filters.klant_id);
      }
      
      if (filters?.datum) {
        filtered = filtered.filter(i => i.datum === filters.datum);
      }
      
      return {
        results: filtered,
        count: filtered.length,
      };
    },
  });
}

export function useInteractiesVandaag() {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['interacties', 'today'],
    queryFn: async () => {
      await delay(200);
      const vandaag = mockInteracties.filter(i => i.datum === today);
      return {
        results: vandaag,
        count: vandaag.length,
      };
    },
  });
}

export function useInteractiesByKlant(klantId: string) {
  return useQuery({
    queryKey: ['interacties', 'klant', klantId],
    queryFn: async () => {
      await delay(200);
      const byKlant = mockInteracties.filter(i => i.klant_id === klantId);
      return {
        results: byKlant,
        count: byKlant.length,
      };
    },
    enabled: !!klantId,
  });
}

export function useOpvolgingenVereist() {
  return useQuery({
    queryKey: ['interacties', 'opvolgingen'],
    queryFn: async () => {
      await delay(200);
      const opvolgingen = mockInteracties.filter(i => 
        i.opvolging_nodig && i.status !== 'Afgerond'
      );
      return {
        results: opvolgingen,
        count: opvolgingen.length,
      };
    },
  });
}

export function useInteractie(interactieId: string) {
  return useQuery({
    queryKey: ['interacties', interactieId],
    queryFn: async () => {
      await delay(200);
      return mockInteracties.find(i => i.id === interactieId) || null;
    },
    enabled: !!interactieId,
  });
}

export function useCreateInteractie() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Interactie>) => {
      await delay(500);
      const now = new Date();
      const newInteractie: Interactie = {
        id: `${Date.now()}`,
        interaction_nummer: `INT-2024-${String(mockInteracties.length + 1).padStart(4, '0')}`,
        datum: now.toISOString().split('T')[0],
        tijd: now.toTimeString().split(' ')[0].substring(0, 5),
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        is_read: false,
        read_by: [],
        tags: [],
        sentiment: 'Neutraal',
        ...data,
      } as Interactie;
      return newInteractie;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interacties'] });
    },
  });
}

export function useUpdateInteractie() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Interactie> }) => {
      await delay(300);
      return { 
        ...mockInteracties.find(i => i.id === id)!, 
        ...data,
        updated_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interacties'] });
    },
  });
}

export function useDeleteInteractie() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(300);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interacties'] });
    },
  });
}
