import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/types';
import { mockProjects } from '@/lib/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useProjects(filters?: { status?: string; category?: string }) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      await delay(300);
      
      let filtered = [...mockProjects];
      
      if (filters?.status && filters.status !== 'all') {
        filtered = filtered.filter(p => p.status === filters.status);
      }
      
      if (filters?.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
      }
      
      return {
        results: filtered,
        count: filtered.length,
      };
    },
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      await delay(200);
      return mockProjects.find(p => p.id === projectId) || null;
    },
    enabled: !!projectId,
  });
}

export function useProjectStats() {
  return useQuery({
    queryKey: ['projects', 'stats'],
    queryFn: async () => {
      await delay(200);
      
      const total = mockProjects.length;
      const inProgress = mockProjects.filter(p => p.status === 'in-uitvoering').length;
      const waitingOnClient = mockProjects.filter(p => p.status === 'wacht-op-klant').length;
      const blocked = mockProjects.filter(p => p.status === 'geblokkeerd').length;
      const completed = mockProjects.filter(p => p.status === 'afgerond').length;
      
      return {
        total,
        inProgress,
        waitingOnClient,
        blocked,
        completed,
      };
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Project>) => {
      await delay(500);
      return { id: `${Date.now()}`, ...data } as Project;
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
      await delay(300);
      const project = mockProjects.find(p => p.id === id);
      return { ...project, ...data } as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Project['status'] }) => {
      await delay(300);
      const project = mockProjects.find(p => p.id === id);
      return { ...project, status } as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
