import { useParams, Link } from 'react-router-dom';
import { useProject, useSendReminder } from '@/lib/api/projects';
import { CheckCircle, Circle, Clock, AlertCircle, Send, ArrowLeft, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getStatusColor, getStatusLabel, formatDeadline, getCategoryColor } from '@/lib/utils/projectHelpers';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import UpdateStatusDialog from '@/components/projects/UpdateStatusDialog';
import ProjectStageTracker from '@/components/projects/ProjectStageTracker';
import { useState } from 'react';
import { useKlanten } from '@/lib/api/klanten';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { useDeviceChecks } from '@/hooks/useBreakpoint';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id || '');
  const { data: klantenData } = useKlanten();
  const sendReminderMutation = useSendReminder();
  const { toast } = useToast();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  const { isMobile } = useDeviceChecks();

  // Find client details
  const client = klantenData?.results?.find(k => k.id === project?.client_id);

  const handleSendReminder = () => {
    if (!project) return;
    
    sendReminderMutation.mutate(
      { projectId: project.id },
      {
        onSuccess: () => {
          toast({
            title: "Herinnering verzonden",
            description: `Herinnering verzonden naar ${project.client_name}`,
          });
        },
        onError: () => {
          toast({
            title: "Fout",
            description: "Kon herinnering niet verzenden. Probeer opnieuw.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handlePhoneCall = () => {
    if (client?.telefoonnummer) {
      window.location.href = `tel:${client.telefoonnummer}`;
      toast({
        title: "Bellen...",
        description: `${client.telefoonnummer}`,
      });
    } else {
      toast({
        title: "Geen telefoonnummer",
        description: "Er is geen telefoonnummer beschikbaar voor deze klant.",
        variant: "destructive",
      });
    }
  };

  const handleEmail = () => {
    if (client?.email) {
      window.location.href = `mailto:${client.email}`;
      toast({
        title: "Email openen...",
        description: `${client.email}`,
      });
    } else {
      toast({
        title: "Geen email",
        description: "Er is geen email beschikbaar voor deze klant.",
        variant: "destructive",
      });
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
          <h2 className={`${responsiveHeading.h3} mb-2`}>Project niet gevonden</h2>
          <p className={`${responsiveBody.base} mb-3 xs:mb-4`}>Het opgevraagde project bestaat niet.</p>
          <Link to="/projects">
            <Button className="h-9 xs:h-10">Terug naar projecten</Button>
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
        Terug naar projecten
      </Link>

      {/* Project Header Card - Optimized for 360px */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 mb-3 xs:mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 xs:gap-4">
          <div className="flex-1 min-w-0">
            {/* Badges - Wrap and smaller on mobile */}
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
                  Geblokkeerd
                </Badge>
              )}
            </div>
            <h1 className={`${responsiveHeading.h3} mb-1 xs:mb-2`}>
              {project.name}
            </h1>
            <p className={responsiveBody.small}>
              Deadline: {formatDeadline(project.deadline)}
            </p>
          </div>

          {/* Action buttons - Stack on mobile */}
          <div className="flex flex-col xs:flex-row gap-1.5 xs:gap-2 w-full lg:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSendReminder}
              disabled={sendReminderMutation.isPending}
              className="h-8 xs:h-9 text-xs xs:text-sm w-full xs:w-auto"
            >
              <Send className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
              <span className="xs:inline">{sendReminderMutation.isPending ? 'Verzenden...' : isMobile ? 'Herinnering' : 'Herinnering versturen'}</span>
            </Button>
            <Button 
              className="bg-ka-green hover:bg-ka-green/90 h-8 xs:h-9 text-xs xs:text-sm w-full xs:w-auto" 
              size="sm"
              onClick={() => setStatusDialogOpen(true)}
            >
              Status updaten
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 xs:mt-5 sm:mt-6">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <span className={`${responsiveBody.small} font-medium`}>Totale voortgang</span>
            <span className={`${responsiveBody.small} font-medium`}>{project.completion_percentage}%</span>
          </div>
          <Progress value={project.completion_percentage} className="h-2 xs:h-2.5 sm:h-3" />
        </div>
      </div>

      {/* Two-column layout - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        {/* Workflow Stages - Full width on mobile */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
            <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>
              Workflow Stadia
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
        </div>

        {/* Sidebar - Stack on mobile */}
        <div className="space-y-3 xs:space-y-4 sm:space-y-6">
          {/* Client card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>Klant</h3>
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
                  <span className="hidden xs:inline">Bellen</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-8 xs:h-9 text-xs"
                  onClick={handleEmail}
                  disabled={!client?.email}
                >
                  <Mail className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
                  <span className="hidden xs:inline">Email</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Team card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>Team</h3>
            <div className="space-y-2 xs:space-y-3">
              <div className="flex items-center">
                <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-ka-navy text-white flex items-center justify-center text-xs xs:text-sm font-medium mr-2 xs:mr-3 flex-shrink-0">
                  {project.responsible_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-foreground truncate">{project.responsible_team_member}</p>
                  <p className="text-[10px] xs:text-xs text-muted-foreground">Verantwoordelijk</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important dates card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>Belangrijke data</h3>
            <div className="space-y-2 xs:space-y-3 text-xs xs:text-sm">
              <div className="flex items-start">
                <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-muted-foreground mr-1.5 xs:mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Uiterlijke deadline</p>
                  <p className="text-muted-foreground truncate">{formatDeadline(project.deadline)}</p>
                </div>
              </div>
              {project.last_reminder_sent && (
                <div className="flex items-start">
                  <AlertCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-yellow-600 mr-1.5 xs:mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Laatste herinnering</p>
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
                <span>Project geblokkeerd</span>
              </h3>
              <p className="text-xs xs:text-sm text-red-800 dark:text-red-200 mb-2 xs:mb-3">
                {project.blocked_reason}
              </p>
              <Button
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700 h-8 xs:h-9 text-xs xs:text-sm"
              >
                Blokkade oplossen
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
