import { useParams, Link } from 'react-router-dom';
import { useProject, useSendReminder } from '@/lib/api/projects';
import { useOpdrachten } from '@/lib/api/opdrachten';
import { useTaken } from '@/lib/api/taken';
import { CheckCircle, Circle, Clock, AlertCircle, Send, ArrowLeft, Phone, Mail, FileText, ClipboardList, LayoutList, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatusColor, getStatusLabel, formatDeadline, getCategoryColor } from '@/lib/utils/projectHelpers';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import UpdateStatusDialog from '@/components/projects/UpdateStatusDialog';
import ProjectStageTracker from '@/components/projects/ProjectStageTracker';
import { useState } from 'react';
import { useKlanten } from '@/lib/api/klanten';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { useDeviceChecks } from '@/hooks/useBreakpoint';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { OpdrachtTypeBadge } from '@/components/assignments/OpdrachtTypeBadge';
import { TaskDeadlineBadge } from '@/components/tasks/TaskDeadlineBadge';

export default function ProjectDetailPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'nl' ? nl : enUS;
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id || '');
  const { data: klantenData } = useKlanten();
  const { data: opdrachtenData } = useOpdrachten();
  const { data: takenData } = useTaken();
  const sendReminderMutation = useSendReminder();
  const { toast } = useToast();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { isMobile } = useDeviceChecks();

  // Find client details
  const client = klantenData?.results?.find(k => k.id === project?.client_id);
  
  // Find related opdrachten and taken
  const relatedOpdrachten = opdrachtenData?.results?.filter(o => o.project_id === id) || [];
  const relatedTaken = takenData?.results?.filter(t => 
    relatedOpdrachten.some(o => o.id === t.gerelateerde_opdracht_id)
  ) || [];

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
          <Link to="/projects">
            <Button className="h-9 xs:h-10">{t('projects.detail.backToProjects')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto">
      {/* Back button */}
      <Link to="/projects" className="inline-flex items-center text-xs xs:text-sm text-muted-foreground hover:text-foreground mb-3 xs:mb-4">
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
                <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>
                  {t('projects.detail.workflowStages')}
                </h2>
                <ProjectStageTracker 
                  stages={[
                    {
                      id: 1,
                      name: 'Documentatie aanvragen',
                      completed: true,
                      completedDate: '5 oktober 2025',
                      checklist: [
                        { id: '1-1', text: 'Verkoopfacturen verzameld', completed: true },
                        { id: '1-2', text: 'Aankoopfacturen verzameld', completed: true },
                        { id: '1-3', text: 'Bankafschriften ontvangen', completed: true },
                      ]
                    },
                    {
                      id: 2,
                      name: 'Controle & Verwerking',
                      completed: false,
                      startDate: '6 oktober',
                      expectedCompletion: '13 oktober',
                      checklist: [
                        { id: '2-1', text: 'Facturen verwerkt in systeem', completed: true },
                        { id: '2-2', text: 'BTW berekend (bezig)', completed: false },
                        { id: '2-3', text: 'Controle op fouten', completed: false },
                      ]
                    },
                    {
                      id: 3,
                      name: 'Aangifte indienen',
                      completed: false,
                      startDate: '14 oktober',
                      checklist: [
                        { id: '3-1', text: 'Definitieve controle', completed: false },
                        { id: '3-2', text: 'BTW aangifte indienen bij Belastingdienst', completed: false },
                        { id: '3-3', text: 'Bevestiging ontvangen', completed: false },
                      ]
                    },
                    {
                      id: 4,
                      name: 'Betaling & Afsluiting',
                      completed: false,
                      startDate: '17 oktober',
                      checklist: [
                        { id: '4-1', text: 'Betaling gecontroleerd', completed: false },
                        { id: '4-2', text: 'Klant geïnformeerd', completed: false },
                        { id: '4-3', text: 'Project afgesloten', completed: false },
                      ]
                    }
                  ]}
                  projectId={project.id}
                />
              </div>
            </TabsContent>

            {/* Opdrachten Tab */}
            <TabsContent value="opdrachten" className="mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
                <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>
                  {t('projects.linkedAssignments', 'Gekoppelde Opdrachten')}
                </h2>
                {relatedOpdrachten.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('projects.noAssignments', 'Geen opdrachten gekoppeld aan dit project')}</p>
                ) : (
                  <div className="space-y-3">
                    {relatedOpdrachten.map((opdracht) => (
                      <Link key={opdracht.id} to={`/assignments/${opdracht.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <OpdrachtTypeBadge type={opdracht.type_opdracht} />
                              <Badge variant="outline">{opdracht.status}</Badge>
                            </div>
                            <h4 className="font-medium text-sm">{opdracht.opdracht_naam}</h4>
                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                              <span>{opdracht.verantwoordelijk}</span>
                              {opdracht.deadline && (
                                <span>Deadline: {format(new Date(opdracht.deadline), 'dd MMM', { locale })}</span>
                              )}
                            </div>
                            {opdracht.voortgang_percentage !== undefined && (
                              <Progress value={opdracht.voortgang_percentage} className="h-1.5 mt-2" />
                            )}
                          </CardContent>
                        </Card>
                      </Link>
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
                {relatedTaken.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('projects.noTasks', 'Geen taken voor dit project')}</p>
                ) : (
                  <div className="space-y-3">
                    {relatedTaken.map((taak) => (
                      <Card key={taak.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={taak.status === 'Afgerond' ? 'default' : 'outline'}>
                              {taak.status}
                            </Badge>
                            {taak.deadline && <TaskDeadlineBadge deadline={taak.deadline} />}
                          </div>
                          <h4 className="font-medium text-sm">{taak.taak_omschrijving}</h4>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{taak.toegewezen_aan}</span>
                            <span>{taak.priority}</span>
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
                to={`/clients/${project.client_id}`}
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
                <span className="font-medium">{relatedOpdrachten.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('projects.detail.tasks')}</span>
                <span className="font-medium">{relatedTaken.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('projects.detail.completed')}</span>
                <span className="font-medium">{relatedTaken.filter(task => task.status === 'Afgerond').length}</span>
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
    </div>
  );
}