import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useOpdrachten, useUpdateOpdracht } from '@/lib/api/opdrachten';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { OpdrachtTypeBadge } from './OpdrachtTypeBadge';
import { DeadlineIndicator } from './DeadlineIndicator';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Opdracht } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const statusColumns = [
  { id: 'Intake', label: 'Nieuw', color: 'border-t-blue-500' },
  { id: 'In behandeling', label: 'In behandeling', color: 'border-t-cyan-500' },
  { id: 'Wacht op klant', label: 'Wacht op klant', color: 'border-t-orange-500' },
  { id: 'Gereed voor controle', label: 'Wacht op goedkeuring', color: 'border-t-purple-500' },
  { id: 'Afgerond', label: 'Afgerond', color: 'border-t-ka-green' },
  { id: 'Ingediend', label: 'Gefactureerd', color: 'border-t-gray-500' },
];

interface AssignmentsKanbanProps {
  filterStatus?: string;
  filterType?: string;
  filterVerantwoordelijke?: string;
  onlyMine?: boolean;
  currentUserName?: string;
}

export function AssignmentsKanban({ 
  filterStatus, 
  filterType, 
  filterVerantwoordelijke,
  onlyMine,
  currentUserName,
}: AssignmentsKanbanProps) {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();
  const { data: opdrachtenData, isLoading } = useOpdrachten();
  const updateOpdracht = useUpdateOpdracht();

  const opdrachten = opdrachtenData?.results || [];

  // Apply filters
  let filteredOpdrachten = [...opdrachten];
  
  if (filterType && filterType !== 'all') {
    filteredOpdrachten = filteredOpdrachten.filter(o => o.type_opdracht === filterType);
  }
  if (filterVerantwoordelijke && filterVerantwoordelijke !== 'all') {
    filteredOpdrachten = filteredOpdrachten.filter(o => o.verantwoordelijk === filterVerantwoordelijke);
  }
  if (onlyMine && currentUserName) {
    filteredOpdrachten = filteredOpdrachten.filter(o => o.verantwoordelijk === currentUserName);
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceStatus = result.source.droppableId;
    const destStatus = result.destination.droppableId;

    if (sourceStatus === destStatus) return;

    const opdrachtId = result.draggableId;
    
    try {
      await updateOpdracht.mutateAsync({
        id: opdrachtId,
        data: { status: destStatus as Opdracht['status'] },
      });
      toast({
        title: t('assignments.statusUpdated'),
        description: t('assignments.statusChangedTo', { status: destStatus }),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('assignments.statusUpdateFailed'),
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-4">
        {statusColumns.map((col) => (
          <div key={col.id} className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {statusColumns.map((column) => {
          const columnOpdrachten = filteredOpdrachten.filter(o => o.status === column.id);
          
          return (
            <div key={column.id} className="min-w-[200px]">
              <div className={cn(
                'bg-muted/50 rounded-t-lg p-3 border-t-4',
                column.color
              )}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-foreground">{column.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnOpdrachten.length}
                  </Badge>
                </div>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'min-h-[400px] bg-muted/30 rounded-b-lg p-2 space-y-2',
                      snapshot.isDraggingOver && 'bg-muted/60'
                    )}
                  >
                    {columnOpdrachten.map((opdracht, index) => (
                      <Draggable key={opdracht.id} draggableId={opdracht.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Link to={`/assignments/${opdracht.id}`}>
                              <Card className={cn(
                                'p-3 cursor-pointer hover:shadow-md transition-shadow',
                                snapshot.isDragging && 'shadow-lg rotate-2'
                              )}>
                                <div className="space-y-2">
                                  <OpdrachtTypeBadge type={opdracht.type_opdracht} className="text-xs" />
                                  
                                  <p className="text-sm font-medium text-foreground line-clamp-2">
                                    {opdracht.klant_naam}
                                  </p>
                                  
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {opdracht.opdracht_naam}
                                  </p>
                                  
                                  {opdracht.deadline && (
                                    <DeadlineIndicator 
                                      deadline={opdracht.deadline} 
                                      className="text-xs"
                                    />
                                  )}
                                  
                                  <div className="flex items-center justify-between pt-1">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs bg-ka-navy text-white">
                                        {opdracht.verantwoordelijk?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    {opdracht.voortgang_percentage !== undefined && (
                                      <span className="text-xs text-muted-foreground">
                                        {opdracht.voortgang_percentage}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            </Link>
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
