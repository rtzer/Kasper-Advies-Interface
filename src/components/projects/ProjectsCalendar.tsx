import { useBaserowProjects, BaserowProject } from '@/lib/api/projects';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { getProjectTypeColor, getStatusColor, formatDeadline } from '@/lib/utils/projectHelpers';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectsCalendarProps {
  filterStatus: string;
  filterCategory: string;
}

export default function ProjectsCalendar({ filterStatus, filterCategory }: ProjectsCalendarProps) {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useBaserowProjects();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Filter projects
  let filteredProjects = projects || [];

  if (filterStatus && filterStatus !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.status?.value === filterStatus);
  }

  if (filterCategory && filterCategory !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.project_type?.value === filterCategory);
  }

  // Get status translation key
  const getStatusKey = (status: string) => {
    const keys: Record<string, string> = {
      'Concept': 'concept',
      'Actief': 'actief',
      'On hold': 'onHold',
      'Afgerond': 'afgerond',
      'Geannuleerd': 'geannuleerd',
    };
    return keys[status] || status.toLowerCase().replace(/ /g, '');
  };

  // Get project type translation key
  const getProjectTypeKey = (type: string) => {
    const keys: Record<string, string> = {
      'Groeibegeleiding': 'groeibegeleiding',
      'Procesoptimalisatie': 'procesoptimalisatie',
      'Digitalisering': 'digitalisering',
      'VOF naar BV': 'vofNaarBv',
      'Jaarrekening Pakket': 'jaarrekeningPakket',
      'Bedrijfsoverdracht': 'bedrijfsoverdracht',
      'Overig': 'overig',
    };
    return keys[type] || type.toLowerCase().replace(/ /g, '');
  };

  const projectsOnDate = filteredProjects.filter((p) => {
    if (!selectedDate || !p.planned_end_date) return false;
    const deadlineDate = new Date(p.planned_end_date);
    return (
      deadlineDate.getDate() === selectedDate.getDate() &&
      deadlineDate.getMonth() === selectedDate.getMonth() &&
      deadlineDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const datesWithProjects = filteredProjects
    .filter(p => p.planned_end_date)
    .map((p) => new Date(p.planned_end_date!));

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Liste des projets */}
        <div className="flex-1 order-2 lg:order-1">
            <h3 className="font-semibold text-foreground mb-4">
              {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: nl }) : t('projects.calendar.selectDate')}
            </h3>

            {projectsOnDate.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t('projects.calendar.noProjectsOnDate')}
              </p>
            ) : (
              <TooltipProvider>
                <div className="space-y-3">
                  {projectsOnDate.map((project) => (
                    <Tooltip key={project.id}>
                      <TooltipTrigger asChild>
                        <Link to={`/app/projects/${project.id}`}>
                          <div className="border rounded-lg p-3 hover:bg-muted/50 hover:shadow-md transition-all duration-200 cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              {project.project_type?.value && (
                                <Badge variant="outline" className={getProjectTypeColor(project.project_type.value)}>
                                  {t(`projects.projectTypes.${getProjectTypeKey(project.project_type.value)}`, project.project_type.value)}
                                </Badge>
                              )}
                              {project.status?.value && (
                                <Badge className={getStatusColor(project.status.value)} variant="outline">
                                  {t(`projects.status.${getStatusKey(project.status.value)}`, project.status.value)}
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium text-sm text-foreground mb-1">
                              {project.name}
                            </h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {project.link_to_customer?.[0]?.value || '-'}
                            </p>
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div className="space-y-2">
                          <p className="font-medium">{project.name}</p>
                          <div className="space-y-1 text-xs">
                            {project.planned_end_date && (
                              <p className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>{t('projects.deadline')}: {formatDeadline(project.planned_end_date)}</span>
                              </p>
                            )}
                            <p className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              <span>{t('projects.client')}: {project.link_to_customer?.[0]?.value || '-'}</span>
                            </p>
                            <p>{t('projects.progress')}: {project.progress_percentage || 0}%</p>
                            <p>{t('projects.columns.responsible')}: {project.responsible_person?.[0]?.value || '-'}</p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            )}
          </div>

        {/* Calendrier */}
        <div className="order-1 lg:order-2 shrink-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={nl}
            className="rounded-md border"
            modifiers={{
              hasProjects: datesWithProjects,
            }}
            modifiersClassNames={{
              hasProjects: 'bg-ka-green text-white font-bold',
            }}
          />
        </div>
      </div>
    </div>
  );
}
