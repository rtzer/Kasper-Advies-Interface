import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { useProjects, useUpdateProjectStatus } from '@/lib/api/projects';
import { getStatusLabel } from '@/lib/utils/projectHelpers';
import ProjectCard from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Project } from '@/types';

const COLUMNS = [
  { id: 'niet-gestart', title: 'Niet gestart', color: 'bg-gray-100' },
  { id: 'in-uitvoering', title: 'In uitvoering', color: 'bg-blue-100' },
  { id: 'wacht-op-klant', title: 'Wacht op klant', color: 'bg-yellow-100' },
  { id: 'geblokkeerd', title: 'Geblokkeerd', color: 'bg-red-100' },
  { id: 'afgerond', title: 'Afgerond', color: 'bg-green-100' },
];

interface ProjectsKanbanProps {
  filterStatus: string;
  filterCategory: string;
}

export default function ProjectsKanban({ filterStatus, filterCategory }: ProjectsKanbanProps) {
  const { data: projectsData, isLoading } = useProjects({
    status: filterStatus,
    category: filterCategory,
  });
  const updateStatusMutation = useUpdateProjectStatus();

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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((column) => (
          <Skeleton key={column.id} className="h-96" />
        ))}
      </div>
    );
  }

  const projects = projectsData?.results || [];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((column) => {
          const columnProjects = projects.filter((p) => p.status === column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`${column.color} p-3 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnProjects.length}
                  </Badge>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 rounded-b-lg border-2 border-t-0 min-h-[500px] space-y-3 ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-background'
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
                            className={snapshot.isDragging ? 'opacity-50' : ''}
                          >
                            <ProjectCard project={project} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
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
