import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreateTaskDialog } from '@/components/projects/CreateTaskDialog';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, User } from 'lucide-react';
import { useTaken } from '@/lib/api/taken';
import { Taak } from '@/types';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { Link } from 'react-router-dom';

type TaskStatus = 'Te doen' | 'In uitvoering' | 'Geblokkeerd' | 'Afgerond';

interface TaskColumns {
  [key: string]: Taak[];
}

export default function TasksPage() {
  const { currentUser } = useUserStore();
  const { data: takenData, isLoading } = useTaken();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskColumns>({
    'Te doen': [],
    'In uitvoering': [],
    'Geblokkeerd': [],
    'Afgerond': [],
  });
  
  // Organize tasks into columns
  useEffect(() => {
    if (takenData?.results) {
      const organized: TaskColumns = {
        'Te doen': [],
        'In uitvoering': [],
        'Geblokkeerd': [],
        'Afgerond': [],
      };
      
      takenData.results.forEach((task) => {
        const status = task.status as TaskStatus;
        if (organized[status]) {
          organized[status].push(task);
        }
      });
      
      setTasks(organized);
    }
  }, [takenData]);
  
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // If dropped in same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Create new state
    const newTasks = { ...tasks };
    const sourceColumn = Array.from(newTasks[source.droppableId]);
    const destColumn = source.droppableId === destination.droppableId 
      ? sourceColumn 
      : Array.from(newTasks[destination.droppableId]);
    
    // Move task
    const [movedTask] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, movedTask);
    
    // Update state
    newTasks[source.droppableId] = sourceColumn;
    if (source.droppableId !== destination.droppableId) {
      newTasks[destination.droppableId] = destColumn;
    }
    
    setTasks(newTasks);
    
    // TODO: Update task status in API
    console.log(`Moved task ${movedTask.id} from ${source.droppableId} to ${destination.droppableId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-ka-gray-50 dark:bg-gray-900">
        <p className="text-ka-gray-500 dark:text-gray-400">Laden...</p>
      </div>
    );
  }
  
  return (
    <div className="p-6 h-screen overflow-hidden bg-ka-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ka-navy dark:text-white">Taken</h1>
          <p className="text-sm text-ka-gray-600 dark:text-gray-400 mt-1">
            {takenData?.results.length || 0} taken in totaal
          </p>
        </div>
        
        <Button className="bg-ka-green hover:bg-ka-green/90" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nieuwe taak
        </Button>
      </div>

      <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      
      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
          {(Object.entries(tasks) as [TaskStatus, Taak[]][]).map(([status, taskList]) => (
            <div key={status} className="flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold text-ka-gray-700 dark:text-gray-300">{status}</h3>
                <Badge variant="secondary">{taskList.length}</Badge>
              </div>
              
              {/* Droppable Column */}
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 overflow-y-auto rounded-lg p-3 transition-colors ${
                      snapshot.isDraggingOver 
                        ? 'bg-ka-green/10 dark:bg-ka-green/20' 
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    {taskList.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Link to={`/tasks/${task.id}`}>
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 cursor-pointer transition-shadow hover:shadow-md ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-ka-navy dark:text-white">
                                  {task.taak_omschrijving}
                                </h4>
                                
                                <Link 
                                  to={`/clients/${task.klant_id}`}
                                  className="text-xs text-ka-gray-600 dark:text-gray-400 hover:underline inline-block"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {task.klant_naam}
                                </Link>
                                
                                <div className="flex items-center justify-between pt-2">
                                <Badge variant={
                                  task.priority === 'Urgent' ? 'destructive' :
                                  task.priority === 'Hoog' ? 'default' :
                                  'secondary'
                                } className="text-xs">
                                  {task.priority}
                                </Badge>
                                
                                  {task.deadline && (
                                    <span className="text-xs text-ka-gray-500 dark:text-gray-400 flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {formatDate(task.deadline, currentUser?.language || 'nl')}
                                    </span>
                                  )}
                                </div>
                                
                                {task.blocked_reason && status === 'Geblokkeerd' && (
                                <div className="mt-2 pt-2 border-t border-ka-gray-200 dark:border-gray-700">
                                  <p className="text-xs text-ka-danger">
                                    🚫 {task.blocked_reason}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </Card>
                          </Link>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {/* Empty state */}
                    {taskList.length === 0 && (
                      <div className="text-center py-8 text-ka-gray-400 dark:text-gray-500 text-sm">
                        Geen taken
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
