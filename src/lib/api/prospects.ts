import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Prospect } from '@/types';
import { mockProspects } from '@/lib/mockProspects';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ProspectFilters {
  search?: string;
  status?: Prospect['status'][];
  type?: Prospect['type_prospect'];
  bron?: Prospect['bron'];
  toegewezen_aan?: string;
}

interface ProspectStats {
  totaal: number;
  nieuwDezeWeek: number;
  inPipeline: number;
  gewonnenDezeMaand: number;
}

// Fetch all prospects with optional filters
export function useProspects(filters?: ProspectFilters) {
  return useQuery({
    queryKey: ['prospects', filters],
    queryFn: async () => {
      await delay(300);
      let filtered = [...mockProspects];
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.voornaam.toLowerCase().includes(search) ||
          p.achternaam.toLowerCase().includes(search) ||
          p.bedrijfsnaam?.toLowerCase().includes(search) ||
          p.email.toLowerCase().includes(search)
        );
      }
      
      if (filters?.status && filters.status.length > 0) {
        filtered = filtered.filter(p => filters.status!.includes(p.status));
      }
      
      if (filters?.type) {
        filtered = filtered.filter(p => p.type_prospect === filters.type);
      }
      
      if (filters?.bron) {
        filtered = filtered.filter(p => p.bron === filters.bron);
      }
      
      if (filters?.toegewezen_aan) {
        filtered = filtered.filter(p => p.toegewezen_aan === filters.toegewezen_aan);
      }
      
      return filtered;
    },
  });
}

// Fetch single prospect
export function useProspect(id: string | undefined) {
  return useQuery({
    queryKey: ['prospect', id],
    queryFn: async () => {
      await delay(200);
      const prospect = mockProspects.find(p => p.id === id);
      if (!prospect) throw new Error('Prospect niet gevonden');
      return prospect;
    },
    enabled: !!id,
  });
}

// Create prospect
export function useCreateProspect() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Prospect, 'id' | 'prospect_nummer' | 'created_at' | 'updated_at'>) => {
      await delay(500);
      const newProspect: Prospect = {
        ...data,
        id: `pr-${Date.now()}`,
        prospect_nummer: `PR-2025-${String(mockProspects.length + 1).padStart(3, '0')}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockProspects.push(newProspect);
      return newProspect;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospect-stats'] });
    },
  });
}

// Update prospect
export function useUpdateProspect() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Prospect> }) => {
      await delay(300);
      const index = mockProspects.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Prospect niet gevonden');
      
      mockProspects[index] = {
        ...mockProspects[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return mockProspects[index];
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospect', id] });
      queryClient.invalidateQueries({ queryKey: ['prospect-stats'] });
    },
  });
}

// Convert prospect to client
export function useConvertProspectToClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ prospectId, accountmanager }: { prospectId: string; accountmanager: string }) => {
      await delay(500);
      const prospect = mockProspects.find(p => p.id === prospectId);
      if (!prospect) throw new Error('Prospect niet gevonden');
      
      // Generate new client ID
      const newKlantId = `K-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      
      // Update prospect status
      const index = mockProspects.findIndex(p => p.id === prospectId);
      mockProspects[index] = {
        ...mockProspects[index],
        status: 'Gewonnen',
        converted_to_klant_id: newKlantId,
        updated_at: new Date().toISOString(),
      };
      
      return { prospect: mockProspects[index], newKlantId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospect-stats'] });
      queryClient.invalidateQueries({ queryKey: ['klanten'] });
    },
  });
}

// Get prospect stats
export function useProspectStats() {
  return useQuery({
    queryKey: ['prospect-stats'],
    queryFn: async (): Promise<ProspectStats> => {
      await delay(200);
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const totaal = mockProspects.length;
      
      const nieuwDezeWeek = mockProspects.filter(p => 
        p.status === 'Nieuw' && new Date(p.created_at) >= weekAgo
      ).length;
      
      const inPipeline = mockProspects.filter(p => 
        ['Nieuw', 'Contact gehad', 'Gekwalificeerd', 'Offerte'].includes(p.status)
      ).length;
      
      const gewonnenDezeMaand = mockProspects.filter(p => 
        p.status === 'Gewonnen' && new Date(p.updated_at) >= monthStart
      ).length;
      
      return { totaal, nieuwDezeWeek, inPipeline, gewonnenDezeMaand };
    },
  });
}
