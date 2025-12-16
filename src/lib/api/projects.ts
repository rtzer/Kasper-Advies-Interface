import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/types';
import { baserowClient, BaserowResponse, BaserowSelectOption, BaserowLinkRow } from './baserowClient';

const PROJECTS_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_PROJECTS || '768';

// Raw project data from Baserow table 768
export interface BaserowProject {
  id: number;
  order: string;
  project_id: string;
  name: string;
  description: string;
  project_type: BaserowSelectOption | null;
  status: BaserowSelectOption | null;
  start_date: string | null;
  planned_end_date: string | null;
  actual_end_date: string | null;
  budget_hours: string | null;
  budget_amount: string | null;
  spent_hours: string | null;
  progress_percentage: string | null;
  notes: string;
  created_at: string;
  is_deleted: boolean;
  version: string;
  link_to_assignments: BaserowLinkRow[];
  link_to_customer: BaserowLinkRow[];
  link_to_user_project_lead: BaserowLinkRow[];
  link_to_users_team_members: BaserowLinkRow[];
  lookup_open_tasks: string | null;
}

// Transform Baserow project to frontend Project type
function transformBaserowProject(raw: BaserowProject): Project {
  return {
    id: raw.id.toString(),
    project_nummer: raw.project_id,
    name: raw.name,
    beschrijving: raw.description,

    // Client info from linked customer
    client_id: raw.link_to_customer?.[0]?.id?.toString() || '',
    client_name: raw.link_to_customer?.[0]?.value || '',

    // Category/type mapping
    category: raw.project_type?.value as Project['category'] || 'Other',
    project_category: raw.project_type?.value,

    // Status from Baserow
    status: mapBaserowStatus(raw.status?.value),

    // Dates
    start_date: raw.start_date || new Date().toISOString().split('T')[0],
    deadline: raw.planned_end_date || new Date().toISOString().split('T')[0],
    completed_date: raw.actual_end_date || undefined,
    created_at: raw.created_at,

    // Team
    responsible_team_member: raw.link_to_user_project_lead?.[0]?.value || '',
    team_member_ids: raw.link_to_users_team_members?.map(m => m.id.toString()) || [],

    // Progress
    completion_percentage: raw.progress_percentage ? parseInt(raw.progress_percentage) : 0,

    // Tasks
    tasks_total: 0,
    tasks_completed: 0,

    // Budget
    totaal_geschatte_uren: raw.budget_hours ? parseFloat(raw.budget_hours) : undefined,
    totaal_bestede_uren: raw.spent_hours ? parseFloat(raw.spent_hours) : undefined,

    // Assignments
    opdracht_ids: raw.link_to_assignments?.map(a => a.id.toString()) || [],

    // Calculated
    is_overdue: raw.planned_end_date ? new Date(raw.planned_end_date) < new Date() && raw.status?.value !== 'Afgerond' : false,
  };
}

// Map Baserow status to frontend status
function mapBaserowStatus(baserowStatus?: string): Project['status'] {
  switch (baserowStatus) {
    case 'Concept': return 'niet-gestart';
    case 'Actief': return 'in-uitvoering';
    case 'On hold': return 'geblokkeerd';
    case 'Afgerond': return 'afgerond';
    case 'Geannuleerd': return 'afgerond';
    default: return 'niet-gestart';
  }
}

export function useProjects(filters?: { status?: string; projectType?: string }) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const response = await baserowClient.getTableRows<BaserowProject>(PROJECTS_TABLE_ID, {
        size: 200,
      });

      // Filter out deleted projects
      let projects = response.results
        .filter(p => !p.is_deleted)
        .map(transformBaserowProject);

      // Apply status filter
      if (filters?.status && filters.status !== 'all') {
        projects = projects.filter(p => {
          const rawProject = response.results.find(r => r.id.toString() === p.id);
          return rawProject?.status?.value === filters.status;
        });
      }

      // Apply project type filter
      if (filters?.projectType && filters.projectType !== 'all') {
        projects = projects.filter(p => {
          const rawProject = response.results.find(r => r.id.toString() === p.id);
          return rawProject?.project_type?.value === filters.projectType;
        });
      }

      return {
        results: projects,
        count: projects.length,
      };
    },
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const raw = await baserowClient.getRow<BaserowProject>(PROJECTS_TABLE_ID, parseInt(projectId));
      if (raw.is_deleted) return null;
      return transformBaserowProject(raw);
    },
    enabled: !!projectId,
  });
}

export function useProjectStats() {
  return useQuery({
    queryKey: ['projects', 'stats'],
    queryFn: async () => {
      const response = await baserowClient.getTableRows<BaserowProject>(PROJECTS_TABLE_ID, {
        size: 200,
      });

      const projects = response.results.filter(p => !p.is_deleted);

      const total = projects.length;
      const active = projects.filter(p => p.status?.value === 'Actief').length;
      const onHold = projects.filter(p => p.status?.value === 'On hold').length;
      const completed = projects.filter(p => p.status?.value === 'Afgerond').length;
      const concept = projects.filter(p => p.status?.value === 'Concept').length;

      return {
        total,
        active,
        onHold,
        completed,
        concept,
      };
    },
  });
}

// Keep mutation hooks for future use with n8n webhooks
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Project>) => {
      // TODO: Implement via n8n webhook
      throw new Error('Not implemented - use n8n webhook');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Project> }) => {
      // TODO: Implement via n8n webhook
      throw new Error('Not implemented - use n8n webhook');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      blocked_reason
    }: {
      id: string;
      status: Project['status'];
      blocked_reason?: string | null;
    }) => {
      // TODO: Implement via n8n webhook
      throw new Error('Not implemented - use n8n webhook');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useSendReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: { projectId: string }) => {
      // TODO: Implement via n8n webhook
      throw new Error('Not implemented - use n8n webhook');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Export raw Baserow projects for components that need direct access
export function useBaserowProjects() {
  return useQuery({
    queryKey: ['baserow-projects'],
    queryFn: async () => {
      const response = await baserowClient.getTableRows<BaserowProject>(PROJECTS_TABLE_ID, {
        size: 200,
      });
      return response.results.filter(p => !p.is_deleted);
    },
  });
}
