import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InboxItem, InboxItemStatus } from '@/types';
import { mockInboxItems } from '@/lib/mockInboxItems';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface InboxFilters {
  status?: InboxItemStatus;
  kanaal?: InboxItem['kanaal'];
  sortBy?: 'newest' | 'oldest' | 'match_score';
}

interface InboxStats {
  nieuw: number;
  inBehandeling: number;
  afgehandeld: number;
  spam: number;
}

export function useInboxItems(filters?: InboxFilters) {
  return useQuery({
    queryKey: ['inbox-items', filters],
    queryFn: async () => {
      await delay(300);
      let filtered = [...mockInboxItems];
      
      if (filters?.status) {
        if (filters.status === 'Gematcht') {
          filtered = filtered.filter(i => 
            i.status === 'Gematcht' || i.status === 'Nieuwe klant aangemaakt'
          );
        } else {
          filtered = filtered.filter(i => i.status === filters.status);
        }
      }
      
      if (filters?.kanaal) {
        filtered = filtered.filter(i => i.kanaal === filters.kanaal);
      }
      
      // Sort
      if (filters?.sortBy === 'oldest') {
        filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      } else if (filters?.sortBy === 'match_score') {
        filtered.sort((a, b) => b.match_score - a.match_score);
      } else {
        // Default: newest first
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      }
      
      return filtered;
    },
  });
}

export function useInboxItem(id: string | undefined) {
  return useQuery({
    queryKey: ['inbox-item', id],
    queryFn: async () => {
      await delay(200);
      const item = mockInboxItems.find(i => i.id === id);
      if (!item) throw new Error('Inbox item niet gevonden');
      return item;
    },
    enabled: !!id,
  });
}

export function useInboxStats() {
  return useQuery({
    queryKey: ['inbox-stats'],
    queryFn: async (): Promise<InboxStats> => {
      await delay(200);
      return {
        nieuw: mockInboxItems.filter(i => i.status === 'Nieuw').length,
        inBehandeling: mockInboxItems.filter(i => i.status === 'In behandeling').length,
        afgehandeld: mockInboxItems.filter(i => 
          i.status === 'Gematcht' || i.status === 'Nieuwe klant aangemaakt'
        ).length,
        spam: mockInboxItems.filter(i => i.status === 'Spam').length,
      };
    },
  });
}

export function useMatchInboxItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      klantId, 
      klantNaam 
    }: { 
      id: string; 
      klantId: string; 
      klantNaam: string;
    }) => {
      await delay(400);
      const index = mockInboxItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Item niet gevonden');
      
      mockInboxItems[index] = {
        ...mockInboxItems[index],
        status: 'Gematcht',
        matched_klant_id: klantId,
        matched_klant_naam: klantNaam,
        created_interactie_id: `INT-2025-${Math.floor(Math.random() * 1000)}`,
        reviewed_by: 'Linda Prins',
        reviewed_at: new Date().toISOString(),
      };
      
      return mockInboxItems[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox-items'] });
      queryClient.invalidateQueries({ queryKey: ['inbox-stats'] });
    },
  });
}

export function useCreateClientFromInbox() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await delay(500);
      const index = mockInboxItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Item niet gevonden');
      
      const newKlantId = `K-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      mockInboxItems[index] = {
        ...mockInboxItems[index],
        status: 'Nieuwe klant aangemaakt',
        created_klant_id: newKlantId,
        created_interactie_id: `INT-2025-${Math.floor(Math.random() * 1000)}`,
        reviewed_by: 'Linda Prins',
        reviewed_at: new Date().toISOString(),
      };
      
      return { item: mockInboxItems[index], newKlantId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox-items'] });
      queryClient.invalidateQueries({ queryKey: ['inbox-stats'] });
      queryClient.invalidateQueries({ queryKey: ['klanten'] });
    },
  });
}

export function useMarkAsSpam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await delay(300);
      const index = mockInboxItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Item niet gevonden');
      
      mockInboxItems[index] = {
        ...mockInboxItems[index],
        status: 'Spam',
        reviewed_by: 'Linda Prins',
        reviewed_at: new Date().toISOString(),
      };
      
      return mockInboxItems[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox-items'] });
      queryClient.invalidateQueries({ queryKey: ['inbox-stats'] });
    },
  });
}

export function useUpdateInboxItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InboxItem> }) => {
      await delay(300);
      const index = mockInboxItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Item niet gevonden');
      
      mockInboxItems[index] = {
        ...mockInboxItems[index],
        ...data,
      };
      
      return mockInboxItems[index];
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inbox-items'] });
      queryClient.invalidateQueries({ queryKey: ['inbox-item', id] });
      queryClient.invalidateQueries({ queryKey: ['inbox-stats'] });
    },
  });
}
