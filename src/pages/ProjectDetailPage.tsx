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

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id || '');
  const sendReminderMutation = useSendReminder();
  const { toast } = useToast();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

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

  if (isLoading) {
    return (
      <div className="p-6 max-w-screen-xl mx-auto space-y-6">
        <Skeleton className="h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 max-w-screen-xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">Project niet gevonden</h2>
          <p className="text-muted-foreground mb-4">Het opgevraagde project bestaat niet.</p>
          <Link to="/projects">
            <Button>Terug naar projecten</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <Link to="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Terug naar projecten
      </Link>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge variant="outline" className={getCategoryColor(project.category)}>
                {project.category}
              </Badge>
              <Badge className={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
              {project.blocked_reason && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Geblokkeerd
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {project.name}
            </h1>
            <p className="text-muted-foreground">
              Deadline: {formatDeadline(project.deadline)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSendReminder}
                disabled={sendReminderMutation.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {sendReminderMutation.isPending ? 'Verzenden...' : 'Herinnering versturen'}
              </Button>
            <Button 
              className="bg-ka-green hover:bg-ka-green/90" 
              size="sm"
              onClick={() => setStatusDialogOpen(true)}
            >
              Status updaten
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Totale voortgang</span>
            <span className="text-sm font-medium text-foreground">{project.completion_percentage}%</span>
          </div>
          <Progress value={project.completion_percentage} className="h-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
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

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-foreground mb-3">Klant</h3>
            <div className="space-y-2 text-sm">
              <Link 
                to={`/clients/${project.client_id}`}
                className="font-medium text-foreground hover:underline block"
              >
                {project.client_name}
              </Link>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Phone className="w-4 h-4 mr-2" />
                Contact opnemen
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-foreground mb-3">Team</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-ka-navy text-white flex items-center justify-center text-sm font-medium mr-3">
                  {project.responsible_initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{project.responsible_team_member}</p>
                  <p className="text-xs text-muted-foreground">Verantwoordelijk</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-foreground mb-3">Belangrijke data</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <Clock className="w-4 h-4 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Uiterlijke deadline</p>
                  <p className="text-muted-foreground">{formatDeadline(project.deadline)}</p>
                </div>
              </div>
              {project.last_reminder_sent && (
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Laatste herinnering</p>
                    <p className="text-muted-foreground">{project.last_reminder_sent}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {project.blocked_reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                Project geblokkeerd
              </h3>
              <p className="text-sm text-red-800 mb-3">
                {project.blocked_reason}
              </p>
              <Button
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700"
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
