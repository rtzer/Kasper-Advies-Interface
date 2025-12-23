import { useQuery } from '@tanstack/react-query';
import { baserowClient, BaserowSelectOption, BaserowLinkRow } from './baserowClient';

const ASSIGNMENTS_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_ASSIGNMENTS || '767';
const TASKS_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_TASKS || '770';
const SUBTASKS_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_SUBTASKS || '782';

// Baserow Assignment structure (table 767)
export interface BaserowAssignment {
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

// Baserow Task structure (table 770)
export interface BaserowTask {
  id: number;
  order: string;
  task_id: string;
  description: string;
  details: string | null;
  status: BaserowSelectOption | null;
  priority: BaserowSelectOption | null;
  task_type: BaserowSelectOption | null;
  deadline: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  is_deleted: boolean;
  version: string;
  _link_interaction: string | null;
  _link_assigned_to: string | null;
  link_to_assignment: BaserowLinkRow[];
}

// Baserow Subtask structure (table 782)
export interface BaserowSubtask {
  id: number;
  order: string;
  subtask_id: string;
  name: string;
  done: boolean;
  link_to_tasks: BaserowLinkRow[];
}

// Fetch all assignments
export function useBaserowAssignments() {
  return useQuery({
    queryKey: ['baserow-assignments'],
    queryFn: async () => {
      const assignments = await baserowClient.getAllTableRows<BaserowAssignment>(ASSIGNMENTS_TABLE_ID);
      return assignments.filter(a => !a.is_deleted);
    },
  });
}

// Fetch assignments for a specific project
export function useProjectAssignments(projectId: number | string | undefined) {
  return useQuery({
    queryKey: ['baserow-assignments', 'project', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const assignments = await baserowClient.getAllTableRows<BaserowAssignment>(ASSIGNMENTS_TABLE_ID, true);
      return assignments.filter(a =>
        !a.is_deleted &&
        a.link_to_project?.some(p => p.id === Number(projectId))
      );
    },
    enabled: !!projectId,
    staleTime: 0,
    gcTime: 0,
  });
}

// Fetch all tasks
export function useBaserowTasks() {
  return useQuery({
    queryKey: ['baserow-tasks'],
    queryFn: async () => {
      const tasks = await baserowClient.getAllTableRows<BaserowTask>(TASKS_TABLE_ID);
      return tasks.filter(t => !t.is_deleted);
    },
  });
}

// Fetch tasks for specific assignments
export function useAssignmentTasks(assignmentIds: number[]) {
  return useQuery({
    queryKey: ['baserow-tasks', 'assignments', assignmentIds],
    queryFn: async () => {
      if (!assignmentIds.length) return [];
      const allTasks = await baserowClient.getAllTableRows<BaserowTask>(TASKS_TABLE_ID, true);
      return allTasks.filter(t =>
        !t.is_deleted &&
        t.link_to_assignment?.some(a => assignmentIds.includes(a.id))
      );
    },
    enabled: assignmentIds.length > 0,
    staleTime: 0,
    gcTime: 0,
  });
}

// Fetch all subtasks
export function useBaserowSubtasks() {
  return useQuery({
    queryKey: ['baserow-subtasks'],
    queryFn: async () => {
      return baserowClient.getAllTableRows<BaserowSubtask>(SUBTASKS_TABLE_ID);
    },
  });
}

// Fetch subtasks for specific tasks
export function useTaskSubtasks(taskIds: number[]) {
  return useQuery({
    queryKey: ['baserow-subtasks', 'tasks', taskIds],
    queryFn: async () => {
      if (!taskIds.length) return [];
      const subtasks = await baserowClient.getAllTableRows<BaserowSubtask>(SUBTASKS_TABLE_ID, true);
      return subtasks.filter(st =>
        st.link_to_tasks?.some(t => taskIds.includes(t.id))
      );
    },
    enabled: taskIds.length > 0,
    staleTime: 0,
    gcTime: 0,
  });
}

// Combined hook to fetch project workflow data (assignments -> tasks -> subtasks)
export function useProjectWorkflow(projectId: number | string | undefined) {
  const { data: assignments, isLoading: assignmentsLoading } = useProjectAssignments(projectId);

  const assignmentIds = assignments?.map(a => a.id) || [];
  const { data: tasks, isLoading: tasksLoading } = useAssignmentTasks(assignmentIds);

  const taskIds = tasks?.map(t => t.id) || [];
  const { data: subtasks, isLoading: subtasksLoading } = useTaskSubtasks(taskIds);

  const isLoading = assignmentsLoading || tasksLoading || subtasksLoading;

  // Build the workflow structure
  const workflow = assignments?.map(assignment => {
    const assignmentTasks = tasks?.filter(t =>
      t.link_to_assignment?.some(a => a.id === assignment.id)
    ) || [];

    const tasksWithSubtasks = assignmentTasks.map(task => {
      const taskSubtasks = subtasks?.filter(st =>
        st.link_to_tasks?.some(t => t.id === task.id)
      ) || [];

      return {
        ...task,
        subtasks: taskSubtasks,
      };
    });

    return {
      ...assignment,
      tasks: tasksWithSubtasks,
    };
  }) || [];

  return {
    workflow,
    assignments,
    tasks,
    subtasks,
    isLoading,
  };
}
