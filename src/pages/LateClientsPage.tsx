import { useState } from 'react';
import { AlertCircle, Send, CheckSquare, Square, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjects, useSendReminder } from '@/lib/api/projects';
import { toast } from 'sonner';
import { formatDeadline, getStatusColor, getStatusLabel } from '@/lib/utils/projectHelpers';
import { differenceInDays } from 'date-fns';
import { Project } from '@/types';

export default function LateClientsPage() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  const { data: projectsData, isLoading } = useProjects({ status: 'wacht-op-klant' });
  const sendReminderMutation = useSendReminder();
  
  const projects = projectsData?.results || [];
  
  // Sort by days waiting (descending)
  const sortedProjects = [...projects].sort((a, b) => {
    const daysA = differenceInDays(new Date(), new Date(a.last_reminder_sent || a.start_date));
    const daysB = differenceInDays(new Date(), new Date(b.last_reminder_sent || b.start_date));
    return daysB - daysA;
  });

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const selectAll = () => {
    setSelectedProjects(sortedProjects.map(p => p.id));
  };

  const deselectAll = () => {
    setSelectedProjects([]);
  };

  const handleBulkReminders = async () => {
    if (selectedProjects.length === 0) {
      toast.error('Selecteer minimaal één project');
      return;
    }

    setIsSending(true);
    
    let successCount = 0;
    let failCount = 0;

    for (const projectId of selectedProjects) {
      try {
        await sendReminderMutation.mutateAsync({ projectId });
        successCount++;
        
        // Small delay between reminders
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Fout bij versturen herinnering voor project ${projectId}:`, error);
        failCount++;
      }
    }

    setIsSending(false);

    if (successCount > 0) {
      toast.success(`${successCount} herinneringen verzonden!`);
    }

    if (failCount > 0) {
      toast.error(`${failCount} herinneringen konden niet worden verzonden`);
    }

    setSelectedProjects([]);
  };

  const getDaysWaiting = (project: Project) => {
    const referenceDate = project.last_reminder_sent || project.start_date;
    return differenceInDays(new Date(), new Date(referenceDate));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-screen-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <Link to="/app/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Terug naar projecten
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Late Klanten Tracking
          </CardTitle>
          <CardDescription>
            Projecten die wachten op klant actie - sorteerd op meest urgent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Geen projecten die wachten op klant actie</p>
            </div>
          ) : (
            <>
              {/* Selection Controls */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckSquare className="w-4 h-4" />
                  {selectedProjects.length} van {sortedProjects.length} geselecteerd
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    disabled={isSending}
                  >
                    <CheckSquare className="w-4 h-4 mr-1" />
                    Alles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deselectAll}
                    disabled={isSending}
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Geen
                  </Button>
                  <Button
                    onClick={handleBulkReminders}
                    disabled={selectedProjects.length === 0 || isSending}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isSending ? (
                      'Bezig met verzenden...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Verstuur herinneringen ({selectedProjects.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {sortedProjects.map((project) => {
                  const daysWaiting = getDaysWaiting(project);
                  const isOverdue = differenceInDays(new Date(project.deadline), new Date()) < 0;
                  
                  return (
                    <div
                      key={project.id}
                      className={`
                        border rounded-lg p-4 transition-all duration-200
                        ${selectedProjects.includes(project.id) ? 'border-yellow-600 bg-yellow-50' : 'border-border bg-background'}
                        ${isSending && !selectedProjects.includes(project.id) ? 'opacity-50' : ''}
                        hover:shadow-md
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => toggleProject(project.id)}
                          disabled={isSending}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link 
                                to={`/app/projects/${project.id}`}
                                className="font-medium text-foreground hover:underline"
                              >
                                {project.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">{project.client_name}</p>
                            </div>
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusLabel(project.status)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <AlertCircle className={`w-4 h-4 ${daysWaiting > 7 ? 'text-red-500' : daysWaiting > 3 ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                              <span className={daysWaiting > 7 ? 'text-red-600 font-medium' : daysWaiting > 3 ? 'text-yellow-600' : 'text-muted-foreground'}>
                                {daysWaiting} {daysWaiting === 1 ? 'dag' : 'dagen'} wachten
                              </span>
                            </div>

                            <div className="text-muted-foreground">
                              Deadline: <span className={isOverdue ? 'text-red-600 font-medium' : ''}>{formatDeadline(project.deadline)}</span>
                            </div>

                            {project.last_reminder_sent && (
                              <div className="text-muted-foreground">
                                Laatste herinnering: {new Date(project.last_reminder_sent).toLocaleDateString('nl-NL')}
                              </div>
                            )}

                            {project.reminder_count > 0 && (
                              <div className="text-muted-foreground">
                                {project.reminder_count} {project.reminder_count === 1 ? 'herinnering' : 'herinneringen'} verzonden
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
