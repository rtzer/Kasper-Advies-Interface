import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateTaskDialog } from '@/components/projects/CreateTaskDialog';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  ClipboardList, 
  User, 
  Calendar, 
  AlertTriangle, 
  Eye,
  Search,
} from 'lucide-react';
import { useTaken, useUpdateTaak } from '@/lib/api/taken';
import { useUsers } from '@/lib/api/users';
import { Taak } from '@/types';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/hooks/use-toast';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskDetailPanel } from '@/components/tasks/TaskDetailPanel';
import { QuickCreateTask } from '@/components/tasks/QuickCreateTask';
import { cn } from '@/lib/utils';
import { isToday, isPast, isBefore, startOfToday } from 'date-fns';

type TaskStatus = 'Te doen' | 'In uitvoering' | 'Geblokkeerd' | 'Gereed voor controle' | 'Afgerond';

interface TaskColumns {
  [key: string]: Taak[];
}

interface ColumnConfig {
  id: TaskStatus;
  labelKey: string;
  color: string;
  borderColor: string;
  wipLimit?: number;
}

const columnConfigs: ColumnConfig[] = [
  { id: 'Te doen', labelKey: 'tasks.columns.todo', color: 'bg-gray-100 dark:bg-gray-800', borderColor: 'border-t-gray-400' },
  { id: 'In uitvoering', labelKey: 'tasks.columns.inProgress', color: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-t-blue-500', wipLimit: 5 },
  { id: 'Geblokkeerd', labelKey: 'tasks.columns.blocked', color: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-t-red-500' },
  { id: 'Gereed voor controle', labelKey: 'tasks.columns.review', color: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-t-purple-500' },
  { id: 'Afgerond', labelKey: 'tasks.columns.done', color: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-t-green-500' },
];

export default function TasksPage() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();
  const { currentUser } = useUserStore();
  const { data: takenData, isLoading } = useTaken();
  const { data: usersData } = useUsers();
  const updateTaak = useUpdateTaak();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Taak | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [quickCreateColumn, setQuickCreateColumn] = useState<TaskStatus | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssigned, setFilterAssigned] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [onlyMine, setOnlyMine] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  
  const [tasks, setTasks] = useState<TaskColumns>({
    'Te doen': [],
    'In uitvoering': [],
    'Geblokkeerd': [],
    'Gereed voor controle': [],
    'Afgerond': [],
  });
  
  const users = usersData || [];
  const allTasks = takenData?.results || [];
  
  // Calculate stats
  const stats = useMemo(() => {
    const today = startOfToday();
    return {
      totalOpen: allTasks.filter(t => t.status !== 'Afgerond').length,
      myTasks: allTasks.filter(t => t.toegewezen_aan === currentUser?.naam && t.status !== 'Afgerond').length,
      deadlineToday: allTasks.filter(t => t.deadline && isToday(new Date(t.deadline)) && t.status !== 'Afgerond').length,
      overdue: allTasks.filter(t => {
        if (!t.deadline || t.status === 'Afgerond') return false;
        return isBefore(new Date(t.deadline), today);
      }).length,
      needsReview: allTasks.filter(t => t.status === 'Gereed voor controle' || (t.needs_approval && t.approval_status === 'pending')).length,
    };
  }, [allTasks, currentUser]);
  
  // Filter and organize tasks
  useEffect(() => {
    if (takenData?.results) {
      let filtered = [...takenData.results];
      
      // Apply filters
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
          t.taak_omschrijving.toLowerCase().includes(query) ||
          t.notities?.toLowerCase().includes(query)
        );
      }
      
      if (filterAssigned !== 'all') {
        filtered = filtered.filter(t => t.toegewezen_aan === filterAssigned);
      }
      
      if (filterPriority !== 'all') {
        filtered = filtered.filter(t => t.priority === filterPriority);
      }
      
      if (onlyMine && currentUser?.naam) {
        filtered = filtered.filter(t => t.toegewezen_aan === currentUser.naam);
      }
      
      if (!showCompleted) {
        filtered = filtered.filter(t => t.status !== 'Afgerond');
      }
      
      // Organize into columns
      const organized: TaskColumns = {
        'Te doen': [],
        'In uitvoering': [],
        'Geblokkeerd': [],
        'Gereed voor controle': [],
        'Afgerond': [],
      };
      
      filtered.forEach((task) => {
        const status = task.status as TaskStatus;
        if (organized[status]) {
          organized[status].push(task);
        }
      });
      
      setTasks(organized);
    }
  }, [takenData, searchQuery, filterAssigned, filterPriority, onlyMine, showCompleted, currentUser]);
  
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
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
    
    // Show toast with undo
    if (source.droppableId !== destination.droppableId) {
      toast({
        title: t('tasks.taskMoved', { column: destination.droppableId }),
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Revert changes
              const revertTasks = { ...tasks };
              setTasks(revertTasks);
            }}
          >
            {t('tasks.undo')}
          </Button>
        ),
      });
      
      // Update in API
      try {
        await updateTaak.mutateAsync({
          id: draggableId,
          data: { status: destination.droppableId as TaskStatus },
        });
      } catch (error) {
        // Revert on error
        setTasks(tasks);
        toast({
          title: t('common.error'),
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleQuickCreate = async (title: string, column: TaskStatus) => {
    // In real app, call API to create task
    console.log('Creating task:', title, 'in column:', column);
    setQuickCreateColumn(null);
    toast({
      title: t('common.success'),
      description: `Task "${title}" created`,
    });
  };
  
  const handleTaskClick = (task: Taak) => {
    setSelectedTask(task);
    setDetailPanelOpen(true);
  };
  
  const getWipCount = (columnId: TaskStatus) => {
    if (!currentUser?.naam) return 0;
    return tasks[columnId]?.filter(t => t.toegewezen_aan === currentUser.naam).length || 0;
  };
  
  if (isLoading) {
    return (
      <div className="p-6 h-screen bg-background">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-5 gap-4 h-[calc(100vh-12rem)]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-6 h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('tasks.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('tasks.totalTasks', { count: allTasks.length })}
          </p>
        </div>
        
        <Button className="bg-ka-green hover:bg-ka-green/90" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('tasks.newTask')}
        </Button>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ka-navy/10 rounded-lg">
              <ClipboardList className="w-4 h-4 text-ka-navy" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.totalOpen}</p>
              <p className="text-xs text-muted-foreground">{t('tasks.stats.totalOpen')}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.myTasks}</p>
              <p className="text-xs text-muted-foreground">{t('tasks.stats.myTasks')}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.deadlineToday}</p>
              <p className="text-xs text-muted-foreground">{t('tasks.stats.deadlineToday')}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">{t('tasks.stats.overdue')}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-3 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Eye className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.needsReview}</p>
              <p className="text-xs text-muted-foreground">{t('tasks.stats.needsReview')}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('tasks.filters.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filterAssigned} onValueChange={setFilterAssigned}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('tasks.filters.assignedTo')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tasks.filters.all')}</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('tasks.filters.priority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tasks.filters.all')}</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
            <SelectItem value="Hoog">{t('tasks.priorityHigh')}</SelectItem>
            <SelectItem value="Normaal">{t('tasks.priorityNormal')}</SelectItem>
            <SelectItem value="Laag">{t('tasks.priorityLow')}</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
          <Switch id="onlyMine" checked={onlyMine} onCheckedChange={setOnlyMine} />
          <Label htmlFor="onlyMine" className="text-sm whitespace-nowrap">
            {t('tasks.filters.onlyMine')}
          </Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch id="showCompleted" checked={showCompleted} onCheckedChange={setShowCompleted} />
          <Label htmlFor="showCompleted" className="text-sm whitespace-nowrap">
            {t('tasks.filters.showCompleted')}
          </Label>
        </div>
      </div>

      <CreateTaskDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      
      <TaskDetailPanel 
        task={selectedTask} 
        open={detailPanelOpen} 
        onClose={() => setDetailPanelOpen(false)} 
      />
      
      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[calc(100vh-24rem)] overflow-x-auto">
          {columnConfigs.map((column) => {
            const taskList = tasks[column.id] || [];
            const wipCount = getWipCount(column.id);
            const isWipExceeded = column.wipLimit && wipCount > column.wipLimit;
            
            return (
              <div key={column.id} className="flex flex-col min-w-[250px]">
                {/* Column Header */}
                <div className={cn(
                  'flex items-center justify-between mb-3 px-3 py-2 rounded-t-lg border-t-4',
                  column.color,
                  column.borderColor,
                  isWipExceeded && 'ring-2 ring-red-500'
                )}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground">{t(column.labelKey)}</h3>
                    <Badge variant="secondary" className="text-xs">{taskList.length}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setQuickCreateColumn(column.id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* WIP Warning */}
                {isWipExceeded && (
                  <div className="mb-2 px-2">
                    <Badge variant="destructive" className="text-xs w-full justify-center">
                      {t('tasks.wipWarning')}
                    </Badge>
                  </div>
                )}
                
                {/* Droppable Column */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        'flex-1 space-y-2 overflow-y-auto rounded-lg p-2 transition-colors',
                        column.color,
                        snapshot.isDraggingOver && 'ring-2 ring-ka-green ring-inset'
                      )}
                    >
                      {/* Quick Create */}
                      {quickCreateColumn === column.id && (
                        <QuickCreateTask
                          onSubmit={(title) => handleQuickCreate(title, column.id)}
                          onCancel={() => setQuickCreateColumn(null)}
                        />
                      )}
                      
                      {taskList.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                isDragging={snapshot.isDragging}
                                onClick={() => handleTaskClick(task)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {/* Empty state */}
                      {taskList.length === 0 && quickCreateColumn !== column.id && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          {t('tasks.noTasks')}
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
    </div>
  );
}
