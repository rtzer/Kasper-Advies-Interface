import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { useProjects, useUpdateProjectStatus } from '@/lib/api/projects';
import ProjectCard from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Project } from '@/types';
import { useTranslation } from 'react-i18next';

const COLUMNS = [
  { id: 'niet-gestart', color: 'bg-gray-200 dark:bg-gray-700' },
  { id: 'in-uitvoering', color: 'bg-blue-200 dark:bg-blue-900/50' },
  { id: 'in-review', color: 'bg-purple-200 dark:bg-purple-900/50' },
  { id: 'wacht-op-klant', color: 'bg-orange-200 dark:bg-orange-900/50' },
  { id: 'afgerond', color: 'bg-green-200 dark:bg-green-900/50' },
];

interface ProjectsKanbanProps {
  filterStatus: string;
  filterCategory: string;
}

export default function ProjectsKanban({ filterStatus, filterCategory }: ProjectsKanbanProps) {
  const { t } = useTranslation();
  const { data: projectsData, isLoading } = useProjects({
    status: filterStatus,
    category: filterCategory,
  });
  const updateStatusMutation = useUpdateProjectStatus();

  const getColumnTitle = (id: string) => {
    const titles: Record<string, string> = {
      'niet-gestart': t('projects.columns.planned', 'Gepland'),
      'in-uitvoering': t('projects.columns.active', 'Actief'),
      'in-review': t('projects.columns.inReview', 'In Review'),
      'wacht-op-klant': t('projects.columns.waitingClient', 'Wacht op Klant'),
      'afgerond': t('projects.columns.completed', 'Afgerond'),
    };
    return titles[id] || id;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      updateStatusMutation.mutate({
        id: draggableId,
        status: destination.droppableId as Project['status'],
      });
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

  const projects = projectsData?.results || [];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 xs:gap-4 overflow-x-auto">
        {COLUMNS.map((column) => {
          const columnProjects = projects.filter((p) => p.status === column.id);
          
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
                        draggableId={project.id}
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
                            <ProjectCard project={project} />
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
