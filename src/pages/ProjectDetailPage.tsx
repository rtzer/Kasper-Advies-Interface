import { useParams, Link } from 'react-router-dom';
import { useProject, useSendReminder } from '@/lib/api/projects';
import { useProjectWorkflow } from '@/lib/api/assignments';
import { Clock, AlertCircle, Send, ArrowLeft, Phone, Mail, FileText, ClipboardList, LayoutList, Calendar, CheckCircle, Circle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { getStatusColor, getStatusLabel, formatDeadline, getCategoryColor } from '@/lib/utils/projectHelpers';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import UpdateStatusDialog from '@/components/projects/UpdateStatusDialog';
import CreateAssignmentDialog from '@/components/projects/CreateAssignmentDialog';
import CreateAssignmentTaskDialog from '@/components/projects/CreateAssignmentTaskDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useKlanten } from '@/lib/api/klanten';
import { useAuth } from '@/contexts/AuthContext';
import { createSubtaskWebhook, toggleSubtaskWebhook } from '@/lib/api/n8nProxy';
import { Input } from '@/components/ui/input';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { useDeviceChecks } from '@/hooks/useBreakpoint';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { TaskDeadlineBadge } from '@/components/tasks/TaskDeadlineBadge';

export default function ProjectDetailPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'nl' ? nl : enUS;
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id || '');
  const { data: klantenData } = useKlanten();
  const { workflow, assignments, tasks, isLoading: workflowLoading } = useProjectWorkflow(id);
  const sendReminderMutation = useSendReminder();
  const { toast } = useToast();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<{ id: number; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Inline subtask creation state
  const [addingSubtaskForTask, setAddingSubtaskForTask] = useState<number | null>(null);
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [isCreatingSubtask, setIsCreatingSubtask] = useState(false);
  const [togglingSubtaskId, setTogglingSubtaskId] = useState<string | null>(null);
  const subtaskInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { isMobile } = useDeviceChecks();

  // Focus input when adding subtask
  useEffect(() => {
    if (addingSubtaskForTask !== null && subtaskInputRef.current) {
      subtaskInputRef.current.focus();
    }
  }, [addingSubtaskForTask]);

  // Handle subtask creation
  const handleCreateSubtask = async (taskId: number) => {
    if (!newSubtaskName.trim() || !user) return;

    setIsCreatingSubtask(true);
    try {
      const response = await createSubtaskWebhook({
        name: newSubtaskName.trim(),
        task_id: taskId,
        user_id: Number(user.id),
      });

      if (response.success && response.data?.success) {
        toast({
          title: t('subtasks.created', 'Subtaak aangemaakt'),
          description: newSubtaskName.trim(),
        });
        setNewSubtaskName('');
        setAddingSubtaskForTask(null);
        // Refetch workflow data
        await queryClient.refetchQueries({
          predicate: (query) => {
            const key = query.queryKey[0];
            return key === 'baserow-assignments' || key === 'baserow-tasks' || key === 'baserow-subtasks';
          }
        });
      } else {
        toast({
          title: t('common.error', 'Fout'),
          description: response.error || t('subtasks.createError', 'Fout bij aanmaken subtaak'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error', 'Fout'),
        description: t('subtasks.createError', 'Fout bij aanmaken subtaak'),
        variant: 'destructive',
      });
    } finally {
      setIsCreatingSubtask(false);
    }
  };

  // Handle keyboard events for subtask input
  const handleSubtaskKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, taskId: number) => {
    if (e.key === 'Enter' && !isCreatingSubtask) {
      e.preventDefault();
      handleCreateSubtask(taskId);
    } else if (e.key === 'Escape') {
      setNewSubtaskName('');
      setAddingSubtaskForTask(null);
    }
  };

  // Handle subtask toggle
  const handleToggleSubtask = async (subtaskId: string, currentDone: boolean) => {
    setTogglingSubtaskId(subtaskId);
    try {
      const response = await toggleSubtaskWebhook({
        subtask_id: Number(subtaskId),
        done: !currentDone,
      });

      if (response.success && response.data?.success) {
        toast({
          title: !currentDone ? t('subtasks.completed', 'Subtaak afgerond') : t('subtasks.reopened', 'Subtaak heropend'),
        });
        // Refetch workflow data
        await queryClient.refetchQueries({
          predicate: (query) => {
            const key = query.queryKey[0];
            return key === 'baserow-assignments' || key === 'baserow-tasks' || key === 'baserow-subtasks';
          }
        });
      } else {
        toast({
          title: t('common.error', 'Fout'),
          description: response.error || t('subtasks.toggleError', 'Fout bij bijwerken subtaak'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: t('common.error', 'Fout'),
        description: t('subtasks.toggleError', 'Fout bij bijwerken subtaak'),
        variant: 'destructive',
      });
    } finally {
      setTogglingSubtaskId(null);
    }
  };

  // Find client details
  const client = klantenData?.results?.find(k => k.id === project?.client_id);

  // Sort assignments by ID and transform for display
  const sortedWorkflow = [...workflow].sort((a, b) => a.id - b.id);

  // Transform workflow data: Assignments -> Tasks -> Subtasks
  const workflowStages = sortedWorkflow.map((assignment, index) => ({
    assignmentNumber: index + 1,
    assignmentId: assignment.id,
    assignmentName: assignment.description,
    assignmentStatus: assignment.status?.value,
    startDate: assignment.start_date ? format(new Date(assignment.start_date), 'dd MMMM', { locale }) : undefined,
    deadline: assignment.deadline ? format(new Date(assignment.deadline), 'dd MMMM', { locale }) : undefined,
    tasks: assignment.tasks.map((task) => ({
      id: task.id,
      name: task.description,
      completed: task.status?.value === 'Afgerond' || task.status?.value === 'Completed',
      completedDate: task.completed_at ? format(new Date(task.completed_at), 'dd MMMM yyyy', { locale }) : undefined,
      startDate: assignment.start_date ? format(new Date(assignment.start_date), 'dd MMMM', { locale }) : undefined,
      expectedCompletion: task.deadline ? format(new Date(task.deadline), 'dd MMMM', { locale }) : undefined,
      status: task.status?.value,
      subtasks: task.subtasks.map((subtask: { id: number; name: string; done: boolean }) => ({
        id: subtask.id.toString(),
        text: subtask.name,
        completed: subtask.done,
      })),
    })),
  }));

  const handleSendReminder = () => {
    if (!project) return;

    sendReminderMutation.mutate(
      { projectId: project.id },
      {
        onSuccess: () => {
          toast({
            title: t('projects.detail.reminderSent'),
            description: t('projects.detail.reminderSentDescription', { name: project.client_name }),
          });
        },
        onError: () => {
          toast({
            title: t('projects.detail.reminderError'),
            description: t('projects.detail.reminderErrorDescription'),
            variant: "destructive",
          });
        },
      }
    );
  };

  const handlePhoneCall = () => {
    if (client?.telefoonnummer) {
      window.location.href = `tel:${client.telefoonnummer}`;
    }
  };

  const handleEmail = () => {
    if (client?.email) {
      window.location.href = `mailto:${client.email}`;
    }
  };

  if (isLoading) {
    return (
      <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto space-y-3 xs:space-y-4 sm:space-y-6">
        <Skeleton className="h-32 xs:h-40 sm:h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-80 xs:h-96" />
          </div>
          <Skeleton className="h-80 xs:h-96" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto">
        <div className="text-center py-8 xs:py-10 sm:py-12">
          <h2 className={`${responsiveHeading.h3} mb-2`}>{t('projects.detail.notFound')}</h2>
          <p className={`${responsiveBody.base} mb-3 xs:mb-4`}>{t('projects.detail.notFoundDescription')}</p>
          <Link to="/app/projects">
            <Button className="h-9 xs:h-10">{t('projects.detail.backToProjects')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto">
      {/* Back button */}
      <Link to="/app/projects" className="inline-flex items-center text-xs xs:text-sm text-muted-foreground hover:text-foreground mb-3 xs:mb-4">
        <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
        {t('projects.detail.backToProjects')}
      </Link>

      {/* Project Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 mb-3 xs:mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 xs:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 mb-2">
              <Badge variant="outline" className={`${getCategoryColor(project.category)} text-[10px] xs:text-xs px-1.5 xs:px-2`}>
                {project.category}
              </Badge>
              <Badge className={`${getStatusColor(project.status)} text-[10px] xs:text-xs px-1.5 xs:px-2`}>
                {getStatusLabel(project.status)}
              </Badge>
              {project.blocked_reason && (
                <Badge variant="destructive" className="text-[10px] xs:text-xs px-1.5 xs:px-2">
                  <AlertCircle className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-1" />
                  {t('projects.detail.blocked')}
                </Badge>
              )}
            </div>
            <h1 className={`${responsiveHeading.h3} mb-1 xs:mb-2`}>
              {project.name}
            </h1>
            <p className={responsiveBody.small}>
              {t('projects.deadline')}: {formatDeadline(project.deadline)}
            </p>
          </div>

          <div className="flex flex-col xs:flex-row gap-1.5 xs:gap-2 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendReminder}
              disabled={sendReminderMutation.isPending}
              className="h-8 xs:h-9 text-xs xs:text-sm w-full xs:w-auto"
            >
              <Send className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
              <span className="xs:inline">{sendReminderMutation.isPending ? t('projects.detail.sending') : isMobile ? t('projects.detail.sendReminderShort') : t('projects.detail.sendReminder')}</span>
            </Button>
            <Button
              className="bg-ka-green hover:bg-ka-green/90 h-8 xs:h-9 text-xs xs:text-sm w-full xs:w-auto"
              size="sm"
              onClick={() => setStatusDialogOpen(true)}
            >
              {t('projects.detail.updateStatus')}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 xs:mt-5 sm:mt-6">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <span className={`${responsiveBody.small} font-medium`}>{t('projects.detail.totalProgress')}</span>
            <span className={`${responsiveBody.small} font-medium`}>{project.completion_percentage}%</span>
          </div>
          <Progress value={project.completion_percentage} className="h-2 xs:h-2.5 sm:h-3" />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        {/* Main content with tabs */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-4">
              <TabsTrigger value="overview" className="text-xs xs:text-sm">
                <LayoutList className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1" />
                <span className="hidden xs:inline">{t('projects.tabs.overview', 'Overzicht')}</span>
              </TabsTrigger>
              <TabsTrigger value="opdrachten" className="text-xs xs:text-sm">
                <FileText className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1" />
                <span className="hidden xs:inline">{t('projects.tabs.assignments', 'Opdrachten')}</span>
              </TabsTrigger>
              <TabsTrigger value="taken" className="text-xs xs:text-sm">
                <ClipboardList className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1" />
                <span className="hidden xs:inline">{t('projects.tabs.tasks', 'Taken')}</span>
              </TabsTrigger>
              <TabsTrigger value="documenten" className="text-xs xs:text-sm">
                <FileText className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1" />
                <span className="hidden xs:inline">{t('projects.tabs.documents', 'Docs')}</span>
              </TabsTrigger>
              <TabsTrigger value="tijdlijn" className="text-xs xs:text-sm">
                <Calendar className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1" />
                <span className="hidden xs:inline">{t('projects.tabs.timeline', 'Tijdlijn')}</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              {/* Add Assignment Button */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 xs:h-9 text-xs xs:text-sm"
                  onClick={() => setCreateAssignmentOpen(true)}
                >
                  <Plus className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
                  {t('projects.addAssignment', 'Opdracht')}
                </Button>
              </div>

              {workflowLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
              ) : workflowStages.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
                  <p className="text-sm text-muted-foreground">{t('projects.noAssignments', 'Geen opdrachten voor dit project')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflowStages.map((assignment) => {
                    const allTasksCompleted = assignment.tasks.length > 0 && assignment.tasks.every(t => t.completed);
                    const someTasksCompleted = assignment.tasks.some(t => t.completed);
                    const assignmentStatusLabel = allTasksCompleted ? t('projects.workflowStatus.complete') : someTasksCompleted ? t('projects.workflowStatus.inProgress') : t('projects.workflowStatus.notStarted');
                    const statusBgColor = allTasksCompleted ? 'bg-green-100 text-green-800' : someTasksCompleted ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';

                    return (
                      <Card key={assignment.assignmentId} className="overflow-hidden">
                        {/* Assignment Header */}
                        <div className={`px-4 py-3 border-b ${allTasksCompleted ? 'bg-green-50' : someTasksCompleted ? 'bg-blue-50' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {allTasksCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              ) : (
                                <Circle className={`w-5 h-5 flex-shrink-0 ${someTasksCompleted ? 'text-blue-500' : 'text-gray-400'}`} />
                              )}
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {assignment.assignmentNumber}. {assignment.assignmentName}
                                </h3>
                                {(assignment.startDate || assignment.deadline) && (
                                  <p className="text-xs text-muted-foreground">
                                    {assignment.startDate && `${t('projects.detail.start')}: ${assignment.startDate}`}
                                    {assignment.startDate && assignment.deadline && ' • '}
                                    {assignment.deadline && `${t('projects.detail.deadline')}: ${assignment.deadline}`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge className={statusBgColor}>{assignmentStatusLabel}</Badge>
                          </div>
                        </div>

                        {/* Tasks */}
                        <CardContent className="p-0">
                          <div className="divide-y">
                            {assignment.tasks.map((task) => {
                              const taskStatusLabel = task.completed ? t('projects.workflowStatus.complete') : task.status === 'In behandeling' ? t('projects.workflowStatus.inProgress') : t('projects.workflowStatus.notStarted');
                              const taskStatusColor = task.completed ? 'bg-green-100 text-green-800' : task.status === 'In behandeling' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';

                              return (
                                <div key={task.id} className={`px-4 py-3 ${task.completed ? 'bg-green-50/30' : ''}`}>
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {task.completed ? (
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                      )}
                                      <span className={`text-sm font-medium ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                        {task.name}
                                      </span>
                                    </div>
                                    <Badge className={`text-xs ${taskStatusColor}`}>{taskStatusLabel}</Badge>
                                  </div>

                                  {/* Task dates */}
                                  {(task.completedDate || task.expectedCompletion) && (
                                    <p className="text-xs text-muted-foreground ml-6 mb-2">
                                      {task.completed && task.completedDate
                                        ? `${t('projects.detail.completedOn')} ${task.completedDate}`
                                        : task.expectedCompletion
                                        ? `${t('projects.detail.expectedCompletion')}: ${task.expectedCompletion}`
                                        : ''}
                                    </p>
                                  )}

                                  {/* Subtasks */}
                                  <div className="ml-6 mt-2 space-y-1.5">
                                    {task.subtasks.map((subtask) => (
                                      <div key={subtask.id} className="flex items-center gap-2">
                                        <Checkbox
                                          id={`subtask-${subtask.id}`}
                                          checked={subtask.completed}
                                          disabled={togglingSubtaskId === subtask.id}
                                          onCheckedChange={() => handleToggleSubtask(subtask.id, subtask.completed)}
                                          className="h-4 w-4 cursor-pointer"
                                        />
                                        <label
                                          htmlFor={`subtask-${subtask.id}`}
                                          className={`text-sm cursor-pointer ${subtask.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                                        >
                                          {subtask.text}
                                        </label>
                                      </div>
                                    ))}

                                    {/* Add Subtask Input/Button */}
                                    {addingSubtaskForTask === task.id ? (
                                      <div className="flex items-center gap-2 mt-1">
                                        <Input
                                          ref={subtaskInputRef}
                                          type="text"
                                          value={newSubtaskName}
                                          onChange={(e) => setNewSubtaskName(e.target.value)}
                                          onKeyDown={(e) => handleSubtaskKeyDown(e, task.id)}
                                          onBlur={() => {
                                            if (!newSubtaskName.trim()) {
                                              setAddingSubtaskForTask(null);
                                            }
                                          }}
                                          placeholder={t('subtasks.namePlaceholder', 'Naam subtaak...')}
                                          className="h-7 text-sm flex-1"
                                          disabled={isCreatingSubtask}
                                        />
                                        <Button
                                          size="sm"
                                          className="h-7 px-2 text-xs"
                                          onClick={() => handleCreateSubtask(task.id)}
                                          disabled={isCreatingSubtask || !newSubtaskName.trim()}
                                        >
                                          {isCreatingSubtask ? '...' : t('common.add', 'Toevoegen')}
                                        </Button>
                                      </div>
                                    ) : (
                                      <button
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                                        onClick={() => setAddingSubtaskForTask(task.id)}
                                      >
                                        <Plus className="w-3 h-3" />
                                        {t('projects.addSubtask', 'Subtaak')}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Empty tasks state */}
                            {assignment.tasks.length === 0 && (
                              <div className="px-4 py-3 text-sm text-muted-foreground">
                                {t('projects.noTasks', 'Geen taken voor deze opdracht')}
                              </div>
                            )}

                            {/* Add Task Button */}
                            <div className="px-4 py-3 border-t">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-muted-foreground hover:text-foreground w-full justify-start"
                                onClick={() => {
                                  setSelectedAssignment({ id: assignment.assignmentId, name: assignment.assignmentName });
                                  setCreateTaskOpen(true);
                                }}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                {t('projects.addTask', 'Taak toevoegen')}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Opdrachten Tab */}
            <TabsContent value="opdrachten" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
                <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>
                  {t('projects.linkedAssignments', 'Gekoppelde Opdrachten')}
                </h2>
                {workflowLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                  </div>
                ) : !assignments || assignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('projects.noAssignments', 'Geen opdrachten gekoppeld aan dit project')}</p>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            {assignment.assignment_type && (
                              <Badge className="bg-blue-100 text-blue-800">{assignment.assignment_type.value}</Badge>
                            )}
                            <Badge variant="outline">{assignment.status?.value || '-'}</Badge>
                          </div>
                          <h4 className="font-medium text-sm">{assignment.description}</h4>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{assignment.assignment_id}</span>
                            {assignment.deadline && (
                              <span>{t('projects.detail.deadline')}: {format(new Date(assignment.deadline), 'dd MMM', { locale })}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Taken Tab */}
            <TabsContent value="taken" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
                <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>
                  {t('projects.projectTasks', 'Project Taken')}
                </h2>
                {workflowLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                  </div>
                ) : !tasks || tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('projects.noTasks', 'Geen taken voor dit project')}</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={task.status?.value === 'Afgerond' ? 'default' : 'outline'}>
                              {task.status?.value || '-'}
                            </Badge>
                            {task.deadline && <TaskDeadlineBadge deadline={task.deadline} />}
                          </div>
                          <h4 className="font-medium text-sm">{task.description}</h4>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{task.task_id}</span>
                            {task.priority && <span>{task.priority.value}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Documenten Tab */}
            <TabsContent value="documenten" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
                <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>
                  {t('projects.documents')}
                </h2>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{t('projects.noDocuments')}</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    {t('projects.detail.uploadDocument')}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Tijdlijn Tab */}
            <TabsContent value="tijdlijn" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
                <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>
                  {t('projects.activityTimeline')}
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-ka-green rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">{t('projects.detail.projectCreated')}</p>
                      <p className="text-xs text-muted-foreground">{project.created_at ? format(new Date(project.created_at), 'dd MMMM yyyy HH:mm', { locale }) : t('projects.detail.dateUnknown')}</p>
                    </div>
                  </div>
                  {project.start_date && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">{t('projects.detail.projectStarted')}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(project.start_date), 'dd MMMM yyyy', { locale })}</p>
                      </div>
                    </div>
                  )}
                  {project.last_reminder_sent && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">{t('projects.detail.reminderSentEvent')}</p>
                        <p className="text-xs text-muted-foreground">{project.last_reminder_sent}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-3 xs:space-y-4 sm:space-y-6">
          {/* Client card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>{t('projects.detail.client')}</h3>
            <div className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
              <Link 
                to={`/app/clients/${project.client_id}`}
                className="font-medium text-foreground hover:underline block truncate"
              >
                {project.client_name}
              </Link>
              {client?.email && (
                <p className="text-[10px] xs:text-xs text-muted-foreground truncate">{client.email}</p>
              )}
              {client?.telefoonnummer && (
                <p className="text-[10px] xs:text-xs text-muted-foreground">{client.telefoonnummer}</p>
              )}
              <div className="flex gap-1.5 xs:gap-2 mt-2 xs:mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 xs:h-9 text-xs"
                  onClick={handlePhoneCall}
                  disabled={!client?.telefoonnummer}
                >
                  <Phone className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
                  <span className="hidden xs:inline">{t('projects.detail.call')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 xs:h-9 text-xs"
                  onClick={handleEmail}
                  disabled={!client?.email}
                >
                  <Mail className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
                  <span className="hidden xs:inline">{t('projects.detail.email')}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Team card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>{t('projects.detail.team')}</h3>
            <div className="space-y-2 xs:space-y-3">
              <div className="flex items-center">
                <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-ka-navy text-white flex items-center justify-center text-xs xs:text-sm font-medium mr-2 xs:mr-3 flex-shrink-0">
                  {project.responsible_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-foreground truncate">{project.responsible_team_member}</p>
                  <p className="text-[10px] xs:text-xs text-muted-foreground">{t('projects.detail.responsible')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>{t('projects.detail.statistics')}</h3>
            <div className="space-y-2 text-xs xs:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('projects.detail.assignments')}</span>
                <span className="font-medium">{assignments?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('projects.detail.tasks')}</span>
                <span className="font-medium">{tasks?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('projects.detail.completed')}</span>
                <span className="font-medium">{tasks?.filter(task => task.status?.value === 'Afgerond').length || 0}</span>
              </div>
            </div>
          </div>

          {/* Important dates card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>{t('projects.detail.importantDates')}</h3>
            <div className="space-y-2 xs:space-y-3 text-xs xs:text-sm">
              <div className="flex items-start">
                <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-muted-foreground mr-1.5 xs:mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{t('projects.detail.deadline')}</p>
                  <p className="text-muted-foreground truncate">{formatDeadline(project.deadline)}</p>
                </div>
              </div>
              {project.last_reminder_sent && (
                <div className="flex items-start">
                  <AlertCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-yellow-600 mr-1.5 xs:mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{t('projects.detail.lastReminder')}</p>
                    <p className="text-muted-foreground truncate">{project.last_reminder_sent}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Blocked reason card */}
          {project.blocked_reason && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg px-3 xs:px-4 py-3 xs:py-4">
              <h3 className={`${responsiveBody.base} font-semibold mb-2 flex items-center`}>
                <AlertCircle className="w-4 h-4 xs:w-5 xs:h-5 text-red-600 mr-1.5 xs:mr-2 flex-shrink-0" />
                <span>{t('projects.detail.projectBlocked')}</span>
              </h3>
              <p className="text-xs xs:text-sm text-red-800 dark:text-red-200 mb-2 xs:mb-3">
                {project.blocked_reason}
              </p>
              <Button
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700 h-8 xs:h-9 text-xs xs:text-sm"
              >
                {t('projects.detail.resolveBlock')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {project && (
        <UpdateStatusDialog
          project={project}
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
        />
      )}

      {/* Create Assignment Dialog */}
      <CreateAssignmentDialog
        projectId={id || ''}
        open={createAssignmentOpen}
        onOpenChange={setCreateAssignmentOpen}
      />

      {/* Create Task Dialog */}
      {selectedAssignment && (
        <CreateAssignmentTaskDialog
          assignmentId={selectedAssignment.id}
          assignmentName={selectedAssignment.name}
          open={createTaskOpen}
          onOpenChange={setCreateTaskOpen}
        />
      )}
    </div>
  );
}