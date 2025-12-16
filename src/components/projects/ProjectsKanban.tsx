import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { useBaserowProjects } from '@/lib/api/projects';
import ProjectCard from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { updateProjectStatusWebhook } from '@/lib/api/n8nProxy';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Baserow status values
const COLUMNS = [
  { id: 'Concept', color: 'bg-gray-200 dark:bg-gray-700' },
  { id: 'Actief', color: 'bg-blue-200 dark:bg-blue-900/50' },
  { id: 'On hold', color: 'bg-yellow-200 dark:bg-yellow-900/50' },
  { id: 'Afgerond', color: 'bg-green-200 dark:bg-green-900/50' },
  { id: 'Geannuleerd', color: 'bg-red-200 dark:bg-red-900/50' },
];

interface ProjectsKanbanProps {
  filterStatus: string;
  filterCategory: string;
}

export default function ProjectsKanban({ filterStatus, filterCategory }: ProjectsKanbanProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useBaserowProjects();

  const getColumnTitle = (id: string) => {
    const titles: Record<string, string> = {
      'Concept': t('projects.status.concept'),
      'Actief': t('projects.status.actief'),
      'On hold': t('projects.status.onHold'),
      'Afgerond': t('projects.status.afgerond'),
      'Geannuleerd': t('projects.status.geannuleerd'),
    };
    return titles[id] || id;
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const projectId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const oldStatus = result.source.droppableId;

    // Don't do anything if dropped in same column
    if (newStatus === oldStatus) return;

    // Optimistic update: update the cache immediately
    const previousProjects = queryClient.getQueryData<typeof projects>(['baserow-projects']);

    queryClient.setQueryData(['baserow-projects'], (old: typeof projects) => {
      if (!old) return old;
      return old.map(project => {
        if (project.id.toString() === projectId) {
          return {
            ...project,
            status: { ...project.status, value: newStatus, id: project.status?.id || 0 },
          };
        }
        return project;
      });
    });

    try {
      const response = await updateProjectStatusWebhook(projectId, newStatus);

      if (response.success && response.data?.success) {
        toast.success(t('projects.updateStatusDialog.success'));
        // Refresh to get the server state
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['baserow-projects'] });
      } else {
        // Revert on error
        queryClient.setQueryData(['baserow-projects'], previousProjects);
        toast.error(t('projects.updateStatusDialog.error'));
      }
    } catch (error) {
      // Revert on error
      queryClient.setQueryData(['baserow-projects'], previousProjects);
      toast.error(t('projects.updateStatusDialog.error'));
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 xs:gap-4">
        {COLUMNS.map((column) => (
          <Skeleton key={column.id} className="h-96" />
        ))}
      </div>
    );
  }

  // Filter projects
  let filteredProjects = projects || [];

  if (filterStatus && filterStatus !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.status?.value === filterStatus);
  }

  if (filterCategory && filterCategory !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.project_type?.value === filterCategory);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 xs:gap-4 overflow-x-auto">
        {COLUMNS.map((column) => {
          const columnProjects = filteredProjects.filter((p) => p.status?.value === column.id);

          return (
            <div key={column.id} className="flex flex-col min-w-[250px]">
              <div className={`${column.color} p-2 xs:p-3 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-xs xs:text-sm">
                    {getColumnTitle(column.id)}
                  </h3>
                  <Badge variant="secondary" className="text-[10px] xs:text-xs">
                    {columnProjects.length}
                  </Badge>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 xs:p-3 rounded-b-lg border-2 border-t-0 min-h-[400px] space-y-2 xs:space-y-3 ${
                      snapshot.isDraggingOver
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300'
                        : 'bg-background border-border'
                    }`}
                  >
                    {columnProjects.map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-transform ${
                              snapshot.isDragging
                                ? 'opacity-80 rotate-2 scale-105 shadow-lg'
                                : ''
                            }`}
                          >
                            <ProjectCardFromBaserow project={project} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {columnProjects.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-8 text-muted-foreground text-xs">
                        {t('projects.noProjectsInColumn', 'Geen projecten')}
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

// Simple card component for Baserow projects
import { Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDeadline, getDeadlineColor, getStatusColor, getProjectTypeColor } from '@/lib/utils/projectHelpers';
import { Progress } from '@/components/ui/progress';
import { BaserowProject } from '@/lib/api/projects';

function ProjectCardFromBaserow({ project }: { project: BaserowProject }) {
  const { t } = useTranslation();
  const isOverdue = project.planned_end_date
    ? new Date(project.planned_end_date) < new Date() && project.status?.value !== 'Afgerond'
    : false;

  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-card border rounded-lg p-3 xs:p-4 hover:shadow-md transition-shadow cursor-pointer">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-2 mb-2 xs:mb-3">
          <div className="flex flex-wrap gap-1.5">
            {project.project_type?.value && (
              <Badge className={`${getProjectTypeColor(project.project_type.value)} text-[10px] xs:text-xs px-1.5`}>
                {t(`projects.projectTypes.${project.project_type.value.toLowerCase().replace(/ /g, '')}`, project.project_type.value)}
              </Badge>
            )}
            {project.status?.value && (
              <Badge className={`${getStatusColor(project.status.value)} text-[10px] xs:text-xs px-1.5`}>
                {t(`projects.status.${project.status.value.toLowerCase().replace(/ /g, '')}`, project.status.value)}
              </Badge>
            )}
          </div>
          {isOverdue && (
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
        </div>

        {/* Project name */}
        <h4 className="font-medium text-foreground text-xs xs:text-sm mb-1.5 xs:mb-2 line-clamp-2">
          {project.name}
        </h4>

        {/* Client name */}
        <p className="text-[10px] xs:text-xs text-muted-foreground mb-2 xs:mb-3 truncate">
          {project.link_to_customer?.[0]?.value || ''}
        </p>

        {/* Progress bar */}
        {project.progress_percentage && (
          <div className="mb-2 xs:mb-3">
            <div className="flex justify-between text-[10px] xs:text-xs text-muted-foreground mb-1">
              <span>{t('projects.progress')}</span>
              <span>{project.progress_percentage}%</span>
            </div>
            <Progress value={parseInt(project.progress_percentage)} className="h-1.5" />
          </div>
        )}

        {/* Footer with deadline */}
        {project.planned_end_date && (
          <div className={`flex items-center text-[10px] xs:text-xs ${getDeadlineColor(project.planned_end_date)}`}>
            <Clock className="w-3 h-3 mr-1" />
            {formatDeadline(project.planned_end_date)}
          </div>
        )}
      </div>
    </Link>
  );
}
