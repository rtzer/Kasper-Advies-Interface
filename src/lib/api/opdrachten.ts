import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Opdracht } from '@/types';
import { baserowClient, BaserowSelectOption, BaserowLinkRow } from './baserowClient';

const ASSIGNMENTS_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_ASSIGNMENTS || '767';

// Baserow Assignment structure (table 767)
interface BaserowAssignment {
  id: number;
  order: string;
  assignment_id: string;
  description: string;
  assignment_type: BaserowSelectOption | null;
  status: BaserowSelectOption | null;
  priority: BaserowSelectOption | null;
  start_date: string | null;
  deadline: string | null;
  end_date: string | null;
  estimated_hours: string | null;
  actual_hours: string | null;
  hourly_rate: string | null;
  fixed_amount: string | null;
  billing_status: BaserowSelectOption | null;
  invoice_date: string | null;
  fiscal_year: string | null;
  notes: string | null;
  created_at: string;
  is_deleted: boolean;
  version: string;
  link_to_user: BaserowLinkRow[];
  link_to_project: BaserowLinkRow[];
  link_to_tasks: BaserowLinkRow[];
  lookup_open_tasks: string | null;
  invoice_amount: string | null;
  Customers: BaserowLinkRow[];
}

// Map Baserow status to Opdracht status
function mapStatus(status: string | undefined): Opdracht['status'] {
  const statusMap: Record<string, Opdracht['status']> = {
    'Nieuw': 'Intake',
    'Intake': 'Intake',
    'In behandeling': 'In behandeling',
    'Wacht op klant': 'Wacht op klant',
    'Gereed voor controle': 'Gereed voor controle',
    'Afgerond': 'Afgerond',
    'Ingediend': 'Ingediend',
  };
  return statusMap[status || ''] || 'Intake';
}

// Map Baserow priority to Opdracht priority
function mapPriority(priority: string | undefined): Opdracht['priority'] {
  const priorityMap: Record<string, Opdracht['priority']> = {
    'Urgent': 'Urgent',
    'Hoog': 'Hoog',
    'Normaal': 'Normaal',
    'Laag': 'Laag',
  };
  return priorityMap[priority || ''] || 'Normaal';
}

// Map Baserow assignment type to OpdrachtType
function mapAssignmentType(type: string | undefined): Opdracht['type_opdracht'] {
  // Return the type as is, since it should match OpdrachtType
  return (type || 'Overig') as Opdracht['type_opdracht'];
}

// Map Baserow billing status to facturatie status
function mapBillingStatus(status: string | undefined): Opdracht['facturatie_status'] {
  const statusMap: Record<string, Opdracht['facturatie_status']> = {
    'Niet gefactureerd': 'niet_gefactureerd',
    'Gefactureerd': 'gefactureerd',
    'Betaald': 'betaald',
    'In dispuut': 'in_dispuut',
  };
  return statusMap[status || ''] || 'niet_gefactureerd';
}

// Transform Baserow assignment to Opdracht type
function transformAssignment(assignment: BaserowAssignment): Opdracht {
  const customer = assignment.Customers?.[0];
  const user = assignment.link_to_user?.[0];
  const project = assignment.link_to_project?.[0];
  const openTasks = parseInt(assignment.lookup_open_tasks || '0', 10);
  const totalTasks = assignment.link_to_tasks?.length || 0;
  const completedTasks = totalTasks - openTasks;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    id: String(assignment.id),
    opdracht_nummer: assignment.assignment_id || `OPD-${assignment.id}`,
    opdracht_naam: assignment.description || 'Geen naam',
    beschrijving: assignment.notes || undefined,
    project_id: project?.id ? String(project.id) : undefined,
    project_naam: project?.value || undefined,
    klant_id: customer?.id ? String(customer.id) : '',
    klant_naam: customer?.value || 'Onbekende klant',
    type_opdracht: mapAssignmentType(assignment.assignment_type?.value),
    categorie: 'Traditie', // Default, could be mapped from assignment_type
    status: mapStatus(assignment.status?.value),
    priority: mapPriority(assignment.priority?.value),
    boekjaar_periode: assignment.fiscal_year || undefined,
    start_datum: assignment.start_date || new Date().toISOString().split('T')[0],
    deadline: assignment.deadline || '',
    afgerond_datum: assignment.end_date || undefined,
    geschat_aantal_uren: assignment.estimated_hours ? parseFloat(assignment.estimated_hours) : undefined,
    bestede_uren: assignment.actual_hours ? parseFloat(assignment.actual_hours) : 0,
    budget_uren: assignment.estimated_hours ? parseFloat(assignment.estimated_hours) : 0,
    gefactureerd_bedrag: assignment.invoice_amount ? parseFloat(assignment.invoice_amount) : undefined,
    betaald: assignment.billing_status?.value === 'Betaald',
    verantwoordelijk: user?.value || 'Niet toegewezen',
    user_ids: assignment.link_to_user?.map(u => String(u.id)) || [],
    facturatie_status: mapBillingStatus(assignment.billing_status?.value),
    voortgang_percentage: progress,
    aantal_taken: totalTasks,
    aantal_openstaande_taken: openTasks,
    bijzonderheden: assignment.notes || undefined,
  };
}

export function useOpdrachten(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['opdrachten', filters],
    queryFn: async () => {
      const assignments = await baserowClient.getAllTableRows<BaserowAssignment>(ASSIGNMENTS_TABLE_ID);

      let filtered = assignments
        .filter(a => !a.is_deleted)
        .map(transformAssignment);

      if (filters?.status) {
        filtered = filtered.filter(o => o.status === filters.status);
      }

      if (filters?.klant_id) {
        filtered = filtered.filter(o => o.klant_id === filters.klant_id);
      }

      return {
        results: filtered,
        count: filtered.length,
      };
    },
  });
}

export function useActieveOpdrachten() {
  return useQuery({
    queryKey: ['opdrachten', 'actief'],
    queryFn: async () => {
      const assignments = await baserowClient.getAllTableRows<BaserowAssignment>(ASSIGNMENTS_TABLE_ID);

      const actief = assignments
        .filter(a => !a.is_deleted)
        .map(transformAssignment)
        .filter(o => o.status !== 'Afgerond' && o.status !== 'Ingediend');

      return {
        results: actief,
        count: actief.length,
      };
    },
  });
}

export function useOpdracht(opdrachtId: string) {
  return useQuery({
    queryKey: ['opdrachten', opdrachtId],
    queryFn: async () => {
      const assignment = await baserowClient.getRow<BaserowAssignment>(ASSIGNMENTS_TABLE_ID, parseInt(opdrachtId, 10));
      if (!assignment || assignment.is_deleted) return null;
      return transformAssignment(assignment);
    },
    enabled: !!opdrachtId,
  });
}

export function useCreateOpdracht() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Opdracht>) => {
      // For now, just return the data with a temp ID
      // In the future, this would create a row in Baserow
      return { id: `${Date.now()}`, ...data } as Opdracht;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opdrachten'] });
    },
  });
}

export function useUpdateOpdracht() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Opdracht> }) => {
      // Map status back to Baserow format if needed
      const updateData: Record<string, unknown> = {};

      if (data.status) {
        // The status field in Baserow is a select field, we need to send the ID
        // For now, we'll just invalidate the queries and let the UI update optimistically
      }

      // In the future, this would update a row in Baserow
      // await baserowClient.updateRow(ASSIGNMENTS_TABLE_ID, parseInt(id, 10), updateData);

      return { id, ...data } as Opdracht;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opdrachten'] });
    },
  });
}
