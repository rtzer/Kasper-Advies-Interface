import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Klant, LifecycleStage, Channel } from '@/types';
import { baserowClient, BaserowCustomer } from './baserowClient';

const CUSTOMERS_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_CUSTOMERS;

// Extract value from lookup field (can be array of objects or strings)
function getLookupValue(lookup: any): string {
  if (!lookup || !Array.isArray(lookup) || lookup.length === 0) return '';
  const first = lookup[0];
  // If it's an object with a 'value' property (BaserowLinkRow format)
  if (typeof first === 'object' && first?.value) return first.value;
  // If it's a string
  if (typeof first === 'string') return first;
  return '';
}

// Alias for backwards compatibility
function getAccountManagerName(lookup: any): string {
  return getLookupValue(lookup);
}

// Map Baserow customer to our Klant type
function mapBaserowToKlant(customer: BaserowCustomer): Klant {
  return {
    id: customer.id.toString(),
    klant_nummer: customer.client_id || '',
    naam: customer.name || '',

    // Type mapping
    type_klant: mapClientType(customer.client_type?.value),
    klant_type_details: customer.client_type?.value || '',

    // Contact info
    email: customer.email || '',
    telefoonnummer: customer.phone || '',
    mobiel: customer.phone || '',
    website: customer.website || '',

    // Address
    adres: customer.address || '',
    postcode: customer.postal_code || '',
    plaats: customer.city || '',
    land: customer.country?.value || 'Nederland',
    branche: customer.industry?.value || '',

    // Invoice address
    factuur_adres: customer.invoice_address || '',
    factuur_postcode: customer.invoice_postal_code || '',
    factuur_plaats: customer.invoice_city || '',
    factuur_land: customer.invoice_country?.value || '',

    // Business info
    kvk_nummer: customer.kvk_number || '',
    btw_nummer: customer.vat_number || '',
    bsn: customer.bsn || '',

    // Financial data
    iban: customer.iban || '',
    bic: customer.bic || '',
    bank_naam: customer.bank_name || '',
    alternatief_iban: customer.iban_secondary || '',
    betalingstermijn: customer.payment_term_days ? parseInt(customer.payment_term_days) : undefined,
    facturatie_frequentie: customer.billing_frequency?.value || '',

    // Financial rollups
    totale_omzet: customer.total_revenue ? parseFloat(customer.total_revenue) : 0,
    openstaand_bedrag: customer.outstanding_balance ? parseFloat(customer.outstanding_balance) : 0,

    // Status
    status: mapStatus(customer.status?.value),
    status_historisch: customer.is_deleted,

    // Lifecycle & Health
    lifecycle_stage: (customer.lifecycle_stage?.value as LifecycleStage) || 'Actief',
    health_score: parseFloat(String(customer.health_score)) || 0,
    focus_client: customer.focus_client || false,
    last_contact_date: customer.lookup_last_interaction_date || '', // Days since last contact, empty if no data
    open_tasks_count: parseInt(String(customer.lookup_open_tasks)) || 0,

    // Communication preferences
    voorkeur_kanaal: mapPreferredChannel(customer.preferred_channel?.value),
    taal_voorkeur: 'nl',

    // Relations
    gerelateerde_klanten: [],
    tags: [],

    // Account management (from lookup_full_name - can be array of objects or strings)
    accountmanager: getAccountManagerName(customer.lookup_full_name),
    sinds_wanneer_klant: customer.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],

    // Notes
    notities: customer.notes || '',

    // External accountant (from linked record and lookups)
    externe_accountant: customer.link_to_external_accountant?.length > 0
      ? `${getLookupValue(customer.lookup_contact_first_name)} ${getLookupValue(customer.lookup_contact_last_name)}`.trim()
      : undefined,
    accountant_kantoor: getLookupValue(customer.lookup_business_name) || undefined,
    accountant_email: getLookupValue(customer.lookup_email) || undefined,
    accountant_telefoonnummer: getLookupValue(customer.lookup_contact_phone_number) || undefined,

    // Audit
    created_at: customer.created_at,
    updated_at: customer.created_at,

    // Calculated fields
    aantal_opdrachten: customer.Assignments?.length || 0,
    aantal_interacties: customer.Interactions?.length || 0,

    // Assigned user IDs (for "My Clients" filtering)
    assigned_user_ids: customer.link_to_user?.map(u => u.id.toString()) || [],
  };
}

function mapClientType(value?: string): 'Particulier' | 'MKB' | 'ZZP' {
  if (!value) return 'Particulier';
  const lower = value.toLowerCase();
  if (lower.includes('mkb') || lower.includes('business') || lower.includes('company')) return 'MKB';
  if (lower.includes('zzp') || lower.includes('freelance') || lower.includes('self')) return 'ZZP';
  return 'Particulier';
}

function mapStatus(value?: string): 'Actief' | 'Inactief' | 'Prospect' {
  if (!value) return 'Actief';
  const lower = value.toLowerCase();
  if (lower.includes('inactive') || lower.includes('inactief')) return 'Inactief';
  if (lower.includes('prospect') || lower.includes('lead')) return 'Prospect';
  return 'Actief';
}

function mapPreferredChannel(value?: string): Channel | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (lower.includes('email') || lower.includes('e-mail')) return 'E-mail';
  if (lower.includes('whatsapp')) return 'WhatsApp';
  if (lower.includes('phone') || lower.includes('telefoon')) return 'Telefoon';
  return undefined;
}

// Map Klant to Baserow format for create/update
function mapKlantToBaserow(klant: Partial<Klant>): Partial<BaserowCustomer> {
  return {
    client_id: klant.klant_nummer,
    name: klant.naam,
    email: klant.email,
    phone: klant.telefoonnummer || klant.mobiel,
    website: klant.website,
    address: klant.adres,
    postal_code: klant.postcode,
    city: klant.plaats,
    kvk_number: klant.kvk_nummer,
    vat_number: klant.btw_nummer,
    bsn: klant.bsn,
    focus_client: klant.focus_client,
    health_score: klant.health_score,
    notes: klant.notities,
  };
}

export function useKlanten(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['klanten', filters],
    queryFn: async () => {
      const response = await baserowClient.getTableRows<BaserowCustomer>(
        CUSTOMERS_TABLE_ID,
        { size: 200 }
      );

      let results = response.results
        .filter(c => !c.is_deleted && !c.is_archived)
        .map(mapBaserowToKlant);

      // Apply filters
      if (filters?.status) {
        results = results.filter(k => k.status === filters.status);
      }

      return {
        results,
        count: results.length,
      };
    },
  });
}

export function useActieveKlanten() {
  return useQuery({
    queryKey: ['klanten', 'actief'],
    queryFn: async () => {
      const response = await baserowClient.getTableRows<BaserowCustomer>(
        CUSTOMERS_TABLE_ID,
        { size: 200 }
      );

      const results = response.results
        .filter(c => !c.is_deleted && !c.is_archived)
        .map(mapBaserowToKlant)
        .filter(k => k.status === 'Actief');

      return {
        results,
        count: results.length,
      };
    },
  });
}

export function useKlant(klantId: string) {
  return useQuery({
    queryKey: ['klanten', klantId],
    queryFn: async () => {
      const customer = await baserowClient.getRow<BaserowCustomer>(
        CUSTOMERS_TABLE_ID,
        parseInt(klantId)
      );
      return mapBaserowToKlant(customer);
    },
    enabled: !!klantId,
  });
}

export function useCreateKlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Klant>) => {
      const baserowData = mapKlantToBaserow(data);
      const created = await baserowClient.createRow<BaserowCustomer>(
        CUSTOMERS_TABLE_ID,
        baserowData
      );
      return mapBaserowToKlant(created);
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
      const baserowData = mapKlantToBaserow(data);
      const updated = await baserowClient.updateRow<BaserowCustomer>(
        CUSTOMERS_TABLE_ID,
        parseInt(id),
        baserowData
      );
      return mapBaserowToKlant(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['klanten'] });
    },
  });
}
