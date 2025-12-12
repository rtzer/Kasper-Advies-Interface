// Baserow API Client
const BASEROW_API_URL = import.meta.env.VITE_BASEROW_API_URL;
const BASEROW_TOKEN = import.meta.env.VITE_BASEROW_TOKEN;

export interface BaserowResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BaserowSelectOption {
  id: number;
  value: string;
  color: string;
}

export interface BaserowLinkRow {
  id: number;
  value: string;
}

// Raw prospect data from Baserow table 765
export interface BaserowProspect {
  id: number;
  order: string;
  prospect_id: string;
  name: string;
  prospect_type: BaserowSelectOption | null;
  status: BaserowSelectOption | null;
  source: BaserowSelectOption | null;
  email: string;
  phone: string;
  website: string;
  address: string;
  postal_code: string;
  city: string;
  country: BaserowSelectOption | null;
  industry: BaserowSelectOption | null;
  interested_services: BaserowSelectOption[];
  estimated_revenue: BaserowSelectOption | null;
  notes: string;
  first_contact_date: string | null;
  last_contact_date: string | null;
  recontact_date: string | null;
  lost_reason: BaserowSelectOption | null;
  created_at: string;
  is_deleted: boolean;
  version: string;
  link_to_interactions: BaserowLinkRow[];
}

// Raw customer data from Baserow table 764
export interface BaserowCustomer {
  id: number;
  order: string;
  client_id: string;
  name: string;
  client_type: BaserowSelectOption | null;
  status: BaserowSelectOption | null;
  lifecycle_stage: BaserowSelectOption | null;
  service_level: BaserowSelectOption | null;
  focus_client: boolean;
  email: string;
  phone: string;
  website: string;
  address: string;
  postal_code: string;
  city: string;
  kvk_number: string;
  vat_number: string;
  bsn: string;
  industry: BaserowSelectOption | null;
  preferred_channel: BaserowSelectOption | null;
  health_score: number;
  data_quality_score: number;
  notes: string;
  reactivated_date: string | null;
  created_at: string;
  is_deleted: boolean;
  is_archived: boolean;
  version: number;
  link_to_contacts: BaserowLinkRow[];
  Assignments: BaserowLinkRow[];
  Projects: BaserowLinkRow[];
  Interactions: BaserowLinkRow[];
  link_to_user: BaserowLinkRow[];
  // Lookup fields (can be various formats from Baserow)
  lookup_full_name: BaserowLinkRow[] | string[] | null;
  lookup_last_interaction_date: string | null;
  lookup_open_tasks: string | null;

  // Invoice address
  invoice_address: string;
  invoice_postal_code: string;
  invoice_city: string;
  country: BaserowSelectOption | null;
  invoice_country: BaserowSelectOption | null;

  // Financial data
  iban: string;
  bic: string;
  bank_name: string;
  iban_secondary: string;
  payment_term_days: string;
  billing_frequency: BaserowSelectOption | null;

  // Financial rollups
  total_revenue: string;
  outstanding_balance: string;

  // Assignments link
  link_to_assignments: BaserowLinkRow[];

  // External accountant
  link_to_external_accountant: BaserowLinkRow[];
  lookup_business_name: BaserowLinkRow[];
  lookup_contact_first_name: BaserowLinkRow[];
  lookup_contact_last_name: BaserowLinkRow[];
  lookup_email: BaserowLinkRow[];
  lookup_contact_phone_number: BaserowLinkRow[];
}

class BaserowClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = BASEROW_API_URL;
    this.token = BASEROW_TOKEN;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Baserow API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Fetch all rows from a table with pagination support
  async getTableRows<T>(
    tableId: number | string,
    params?: {
      page?: number;
      size?: number;
      search?: string;
      orderBy?: string;
      filters?: Record<string, any>;
    }
  ): Promise<BaserowResponse<T>> {
    const searchParams = new URLSearchParams();
    searchParams.set('user_field_names', 'true');

    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.size) searchParams.set('size', params.size.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.orderBy) searchParams.set('order_by', params.orderBy);

    return this.request<BaserowResponse<T>>(
      `/api/database/rows/table/${tableId}/?${searchParams.toString()}`
    );
  }

  // Fetch all rows (handles pagination automatically)
  async getAllTableRows<T>(tableId: number | string): Promise<T[]> {
    const allResults: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getTableRows<T>(tableId, { page, size: 200 });
      allResults.push(...response.results);
      hasMore = response.next !== null;
      page++;
    }

    return allResults;
  }

  // Get a single row
  async getRow<T>(tableId: number | string, rowId: number): Promise<T> {
    return this.request<T>(
      `/api/database/rows/table/${tableId}/${rowId}/?user_field_names=true`
    );
  }

  // Create a new row
  async createRow<T>(tableId: number | string, data: Partial<T>): Promise<T> {
    return this.request<T>(
      `/api/database/rows/table/${tableId}/?user_field_names=true`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // Update a row
  async updateRow<T>(
    tableId: number | string,
    rowId: number,
    data: Partial<T>
  ): Promise<T> {
    return this.request<T>(
      `/api/database/rows/table/${tableId}/${rowId}/?user_field_names=true`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }

  // Delete a row
  async deleteRow(tableId: number | string, rowId: number): Promise<void> {
    await this.request<void>(
      `/api/database/rows/table/${tableId}/${rowId}/`,
      {
        method: 'DELETE',
      }
    );
  }
}

export const baserowClient = new BaserowClient();
