import { useQuery } from '@tanstack/react-query';
import { ProjectTemplate } from '@/types';
import { mockProjectTemplates } from '@/lib/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useProjectTemplates() {
  return useQuery({
    queryKey: ['projectTemplates'],
    queryFn: async () => {
      await delay(200);
      return {
        results: mockProjectTemplates,
        count: mockProjectTemplates.length,
      };
    },
  });
}

export function useProjectTemplate(templateId: string) {
  return useQuery({
    queryKey: ['projectTemplates', templateId],
    queryFn: async () => {
      await delay(200);
      return mockProjectTemplates.find(t => t.id === templateId) || null;
    },
    enabled: !!templateId,
  });
}
