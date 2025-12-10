import { useQuery } from '@tanstack/react-query';
import { baserowClient, BaserowLinkRow } from './baserowClient';

const EXTERNAL_ACCOUNTANTS_TABLE_ID = 781;

// Raw external accountant data from Baserow table 781
export interface BaserowExternalAccountant {
  id: number;
  order: string;
  business_name: string;
  contact_first_name: string;
  contact_last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  website: string;
  notes: string;
  link_to_customers: BaserowLinkRow[];
  created_at: string;
  is_deleted?: boolean;
}

// Mapped external accountant type for frontend use
export interface ExternalAccountant {
  id: string;
  businessName: string;
  contactFirstName: string;
  contactLastName: string;
  contactFullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  website: string;
  notes: string;
  customerCount: number;
}

// Map Baserow external accountant to frontend type
function mapBaserowToExternalAccountant(accountant: BaserowExternalAccountant): ExternalAccountant {
  return {
    id: accountant.id.toString(),
    businessName: accountant.business_name || '',
    contactFirstName: accountant.contact_first_name || '',
    contactLastName: accountant.contact_last_name || '',
    contactFullName: `${accountant.contact_first_name || ''} ${accountant.contact_last_name || ''}`.trim(),
    email: accountant.email || '',
    phone: accountant.phone || '',
    address: accountant.address || '',
    postalCode: accountant.postal_code || '',
    city: accountant.city || '',
    website: accountant.website || '',
    notes: accountant.notes || '',
    customerCount: accountant.link_to_customers?.length || 0,
  };
}

// Get all external accountants
export function useExternalAccountants() {
  return useQuery({
    queryKey: ['externalAccountants'],
    queryFn: async () => {
      try {
        const response = await baserowClient.getTableRows<BaserowExternalAccountant>(
          EXTERNAL_ACCOUNTANTS_TABLE_ID,
          { size: 200 }
        );

        const results = (response.results || [])
          .filter(a => !a.is_deleted)
          .map(mapBaserowToExternalAccountant);

        return {
          results,
          count: results.length,
        };
      } catch (error) {
        console.error('Failed to fetch external accountants:', error);
        return { results: [], count: 0 };
      }
    },
  });
}

// Get a single external accountant
export function useExternalAccountant(accountantId: string) {
  return useQuery({
    queryKey: ['externalAccountants', accountantId],
    queryFn: async () => {
      const accountant = await baserowClient.getRow<BaserowExternalAccountant>(
        EXTERNAL_ACCOUNTANTS_TABLE_ID,
        parseInt(accountantId)
      );
      return mapBaserowToExternalAccountant(accountant);
    },
    enabled: !!accountantId,
  });
}
