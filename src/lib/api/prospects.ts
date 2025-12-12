import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Prospect } from '@/types';
import { baserowClient, BaserowProspect } from './baserowClient';

const PROSPECTS_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_PROSPECTS;

// Map Baserow prospect type to our type
function mapProspectType(value?: string): Prospect['type_prospect'] {
  if (!value) return 'Particulier';
  const lower = value.toLowerCase();
  if (lower.includes('mkb')) return 'MKB';
  if (lower.includes('zzp')) return 'ZZP';
  return 'Particulier';
}

// Map Baserow status to our status
// Baserow statuses: Nieuw, In gesprek, Offerte verstuurd, Gewonnen, Verloren, On hold
function mapProspectStatus(value?: string): Prospect['status'] {
  if (!value) return 'Nieuw';
  const lower = value.toLowerCase();
  if (lower.includes('nieuw') || lower.includes('new')) return 'Nieuw';
  if (lower.includes('gesprek') || lower.includes('contact')) return 'Contact gehad';
  if (lower.includes('hold') || lower.includes('gekwalificeerd') || lower.includes('qualified')) return 'Gekwalificeerd';
  if (lower.includes('offerte') || lower.includes('quote')) return 'Offerte';
  if (lower.includes('gewonnen') || lower.includes('won')) return 'Gewonnen';
  if (lower.includes('verloren') || lower.includes('lost')) return 'Verloren';
  return 'Nieuw';
}

// Map Baserow source to our source
function mapProspectSource(value?: string): Prospect['bron'] {
  if (!value) return 'Anders';
  const lower = value.toLowerCase();
  if (lower.includes('website')) return 'Website';
  if (lower.includes('referral') || lower.includes('verwijzing')) return 'Referral';
  if (lower.includes('linkedin')) return 'LinkedIn';
  if (lower.includes('telefoon') || lower.includes('phone')) return 'Telefoon';
  if (lower.includes('event')) return 'Event';
  if (lower.includes('netwerk') || lower.includes('network')) return 'Netwerk';
  return 'Anders';
}

// Map Baserow prospect to our Prospect type
function mapBaserowToProspect(prospect: BaserowProspect): Prospect {
  // Parse name into first/last name (Baserow has single name field)
  const nameParts = (prospect.name || '').trim().split(' ');
  const voornaam = nameParts[0] || '';
  const achternaam = nameParts.slice(1).join(' ') || '';

  return {
    id: prospect.id.toString(),
    prospect_nummer: prospect.prospect_id || '',
    bedrijfsnaam: prospect.name || undefined,
    voornaam,
    achternaam,
    email: prospect.email || '',
    telefoon: prospect.phone || undefined,
    mobiel: prospect.phone || undefined,
    adres: prospect.address || undefined,
    postcode: prospect.postal_code || undefined,
    plaats: prospect.city || undefined,
    land: (typeof prospect.country === 'string' ? prospect.country : prospect.country?.value) || undefined,
    type_prospect: mapProspectType(prospect.prospect_type?.value),
    bron: mapProspectSource(prospect.source?.value),
    bron_details: undefined,
    status: mapProspectStatus(prospect.status?.value),
    verloren_reden: prospect.lost_reason?.value || undefined,
    interesse: prospect.interested_services?.map(s => s.value) || [],
    notities: prospect.notes || undefined,
    toegewezen_aan: '',
    verwachte_waarde: parseEstimatedRevenue(prospect.estimated_revenue?.value),
    verwachte_start: undefined,
    volgende_actie: '',
    volgende_actie_datum: prospect.recontact_date || '',
    eerste_contact_datum: prospect.first_contact_date || prospect.created_at?.split('T')[0] || '',
    laatste_contact_datum: prospect.last_contact_date || prospect.created_at?.split('T')[0] || '',
    created_at: prospect.created_at || new Date().toISOString(),
    updated_at: prospect.created_at || new Date().toISOString(),
    converted_to_klant_id: undefined,
  };
}

// Parse estimated revenue string to number
function parseEstimatedRevenue(value?: string): number | undefined {
  if (!value) return undefined;
  // Extract first number from strings like "€50k - €100k" or "€100k - €250k"
  const match = value.match(/€?(\d+)k/i);
  if (match) {
    return parseInt(match[1]) * 1000;
  }
  return undefined;
}

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
      const response = await baserowClient.getTableRows<BaserowProspect>(
        PROSPECTS_TABLE_ID,
        { size: 200 }
      );

      let results = response.results
        .filter(p => !p.is_deleted)
        .map(mapBaserowToProspect);

      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        results = results.filter(p =>
          p.voornaam.toLowerCase().includes(search) ||
          p.achternaam.toLowerCase().includes(search) ||
          p.bedrijfsnaam?.toLowerCase().includes(search) ||
          p.email.toLowerCase().includes(search)
        );
      }

      if (filters?.status && filters.status.length > 0) {
        results = results.filter(p => filters.status!.includes(p.status));
      }

      if (filters?.type) {
        results = results.filter(p => p.type_prospect === filters.type);
      }

      if (filters?.bron) {
        results = results.filter(p => p.bron === filters.bron);
      }

      if (filters?.toegewezen_aan) {
        results = results.filter(p => p.toegewezen_aan === filters.toegewezen_aan);
      }

      return results;
    },
  });
}

// Fetch single prospect
export function useProspect(id: string | undefined) {
  return useQuery({
    queryKey: ['prospect', id],
    queryFn: async () => {
      const prospect = await baserowClient.getRow<BaserowProspect>(
        PROSPECTS_TABLE_ID,
        parseInt(id!)
      );
      return mapBaserowToProspect(prospect);
    },
    enabled: !!id,
  });
}

// Create prospect (via n8n webhook - placeholder for now)
export function useCreateProspect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Prospect, 'id' | 'prospect_nummer' | 'created_at' | 'updated_at'>) => {
      // TODO: Implement n8n webhook for create
      // For now, create directly in Baserow
      const baserowData = {
        name: data.bedrijfsnaam || `${data.voornaam} ${data.achternaam}`.trim(),
        email: data.email,
        phone: data.telefoon || data.mobiel || '',
        address: data.adres || '',
        postal_code: data.postcode || '',
        city: data.plaats || '',
        notes: data.notities || '',
        first_contact_date: data.eerste_contact_datum || new Date().toISOString().split('T')[0],
        last_contact_date: data.laatste_contact_datum || new Date().toISOString().split('T')[0],
        recontact_date: data.volgende_actie_datum || null,
      };

      const created = await baserowClient.createRow<BaserowProspect>(
        PROSPECTS_TABLE_ID,
        baserowData
      );
      return mapBaserowToProspect(created);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      queryClient.invalidateQueries({ queryKey: ['prospect-stats'] });
    },
  });
}

// Update prospect (via n8n webhook - placeholder for now)
export function useUpdateProspect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Prospect> }) => {
      // TODO: Implement n8n webhook for update
      // For now, update directly in Baserow
      const baserowData: Partial<BaserowProspect> = {};

      if (data.bedrijfsnaam !== undefined || data.voornaam !== undefined || data.achternaam !== undefined) {
        baserowData.name = data.bedrijfsnaam || `${data.voornaam || ''} ${data.achternaam || ''}`.trim();
      }
      if (data.email !== undefined) baserowData.email = data.email;
      if (data.telefoon !== undefined || data.mobiel !== undefined) {
        baserowData.phone = data.telefoon || data.mobiel || '';
      }
      if (data.adres !== undefined) baserowData.address = data.adres;
      if (data.postcode !== undefined) baserowData.postal_code = data.postcode;
      if (data.plaats !== undefined) baserowData.city = data.plaats;
      if (data.notities !== undefined) baserowData.notes = data.notities || '';
      if (data.eerste_contact_datum !== undefined) baserowData.first_contact_date = data.eerste_contact_datum;
      if (data.laatste_contact_datum !== undefined) baserowData.last_contact_date = data.laatste_contact_datum;
      if (data.volgende_actie_datum !== undefined) baserowData.recontact_date = data.volgende_actie_datum || null;

      const updated = await baserowClient.updateRow<BaserowProspect>(
        PROSPECTS_TABLE_ID,
        parseInt(id),
        baserowData
      );
      return mapBaserowToProspect(updated);
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
      // TODO: Implement n8n webhook for conversion
      // This should:
      // 1. Create a new client in the customers table
      // 2. Update the prospect status to "Gewonnen"
      // 3. Link the prospect to the new client

      // For now, just update the prospect status
      const updated = await baserowClient.updateRow<BaserowProspect>(
        PROSPECTS_TABLE_ID,
        parseInt(prospectId),
        {
          // Status "Gewonnen" needs to be set via the select option ID
          // This is a simplified version - full implementation should use n8n
        }
      );

      const newKlantId = `K-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      return { prospect: mapBaserowToProspect(updated), newKlantId };
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
      const response = await baserowClient.getTableRows<BaserowProspect>(
        PROSPECTS_TABLE_ID,
        { size: 200 }
      );

      const prospects = response.results
        .filter(p => !p.is_deleted)
        .map(mapBaserowToProspect);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const totaal = prospects.length;

      const nieuwDezeWeek = prospects.filter(p =>
        p.status === 'Nieuw' && new Date(p.created_at) >= weekAgo
      ).length;

      const inPipeline = prospects.filter(p =>
        ['Nieuw', 'Contact gehad', 'Gekwalificeerd', 'Offerte'].includes(p.status)
      ).length;

      const gewonnenDezeMaand = prospects.filter(p =>
        p.status === 'Gewonnen' && new Date(p.updated_at) >= monthStart
      ).length;

      return { totaal, nieuwDezeWeek, inPipeline, gewonnenDezeMaand };
    },
  });
}
