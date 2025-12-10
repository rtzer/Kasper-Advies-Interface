import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactPersoon } from '@/types';
import { baserowClient, BaserowLinkRow, BaserowSelectOption } from './baserowClient';

const CONTACTS_TABLE_ID = 766;

// Raw contact data from Baserow table 766
export interface BaserowContact {
  id: number;
  order: string;
  contact_id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  email: string;
  phone: string;
  mobile: string;
  is_primary: boolean;
  linkedin: string;
  notes: string;
  preferred_communication: BaserowSelectOption | null;
  language_preference: BaserowSelectOption | null;
  link_to_customers: BaserowLinkRow[];
  Interactions: BaserowLinkRow[];
  created_at: string;
  is_deleted: boolean;
}

// Map Baserow contact to our ContactPersoon type
function mapBaserowToContactPersoon(contact: BaserowContact): ContactPersoon {
  const klantLink = contact.link_to_customers?.[0];

  return {
    id: contact.id.toString(),
    naam: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
    functie: contact.job_title || '',

    // Klant relatie
    klant_id: klantLink?.id?.toString() || '',
    bedrijfsnaam: klantLink?.value || '',
    primair: contact.is_primary || false,

    // Contactgegevens
    email: contact.email || '',
    telefoonnummer: contact.phone || '',
    mobiel: contact.mobile || '',

    // Social
    linkedin: contact.linkedin || '',

    // Notities
    notities: contact.notes || '',

    // Voorkeuren
    voorkeur_communicatie: mapPreferredCommunication(contact.preferred_communication?.value),
    taal_voorkeur: mapLanguagePreference(contact.language_preference?.value),

    // Calculated fields
    aantal_interacties: contact.Interactions?.length || 0,
  };
}

function mapPreferredCommunication(value?: string): 'E-mail' | 'Telefoon' | 'WhatsApp' | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (lower.includes('email') || lower.includes('e-mail')) return 'E-mail';
  if (lower.includes('phone') || lower.includes('telefoon')) return 'Telefoon';
  if (lower.includes('whatsapp')) return 'WhatsApp';
  return undefined;
}

function mapLanguagePreference(value?: string): 'nl' | 'en' | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (lower.includes('dutch') || lower.includes('nl') || lower.includes('nederlands')) return 'nl';
  if (lower.includes('english') || lower.includes('en') || lower.includes('engels')) return 'en';
  return undefined;
}

// Map ContactPersoon to Baserow format for create/update
function mapContactPersoonToBaserow(contact: Partial<ContactPersoon>): Partial<BaserowContact> {
  const nameParts = contact.naam?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    first_name: firstName,
    last_name: lastName,
    job_title: contact.functie,
    email: contact.email,
    phone: contact.telefoonnummer,
    mobile: contact.mobiel,
    is_primary: contact.primair,
    linkedin: contact.linkedin,
    notes: contact.notities,
  };
}

// Get all contact persons for a specific client
export function useContactPersonenByKlant(klantId: string) {
  return useQuery({
    queryKey: ['contactpersonen', 'klant', klantId],
    queryFn: async () => {
      const response = await baserowClient.getTableRows<BaserowContact>(
        CONTACTS_TABLE_ID,
        { size: 200 }
      );

      // Filter contacts that are linked to this specific klant
      const filteredContacts = response.results
        .filter(c => !c.is_deleted)
        .filter(c => c.link_to_customers?.some(link => link.id.toString() === klantId))
        .map(mapBaserowToContactPersoon);

      return {
        results: filteredContacts,
        count: filteredContacts.length,
      };
    },
    enabled: !!klantId,
  });
}

// Get all contact persons
export function useContactPersonen() {
  return useQuery({
    queryKey: ['contactpersonen'],
    queryFn: async () => {
      try {
        const response = await baserowClient.getTableRows<BaserowContact>(
          CONTACTS_TABLE_ID,
          { size: 200 }
        );

        const results = (response.results || [])
          .filter(c => !c.is_deleted)
          .map(mapBaserowToContactPersoon);

        return {
          results,
          count: results.length,
        };
      } catch (error) {
        console.error('Failed to fetch contact persons:', error);
        return { results: [], count: 0 };
      }
    },
  });
}

// Get a single contact person
export function useContactPersoon(contactId: string) {
  return useQuery({
    queryKey: ['contactpersonen', contactId],
    queryFn: async () => {
      const contact = await baserowClient.getRow<BaserowContact>(
        CONTACTS_TABLE_ID,
        parseInt(contactId)
      );
      return mapBaserowToContactPersoon(contact);
    },
    enabled: !!contactId,
  });
}

// Create a new contact person
export function useCreateContactPersoon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ContactPersoon> & { klant_id: string }) => {
      const baserowData = {
        ...mapContactPersoonToBaserow(data),
        link_to_customers: [parseInt(data.klant_id)],
      };
      const created = await baserowClient.createRow<BaserowContact>(
        CONTACTS_TABLE_ID,
        baserowData as any
      );
      return mapBaserowToContactPersoon(created);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contactpersonen'] });
      queryClient.invalidateQueries({ queryKey: ['contactpersonen', 'klant', variables.klant_id] });
    },
  });
}

// Update a contact person
export function useUpdateContactPersoon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactPersoon> }) => {
      const baserowData = mapContactPersoonToBaserow(data);
      const updated = await baserowClient.updateRow<BaserowContact>(
        CONTACTS_TABLE_ID,
        parseInt(id),
        baserowData as any
      );
      return mapBaserowToContactPersoon(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactpersonen'] });
    },
  });
}

// Delete a contact person
export function useDeleteContactPersoon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await baserowClient.deleteRow(CONTACTS_TABLE_ID, parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactpersonen'] });
    },
  });
}
