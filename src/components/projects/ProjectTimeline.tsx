import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays, addMonths, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBaserowProjects, BaserowProject } from '@/lib/api/projects';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { getProjectTypeColor } from '@/lib/utils/projectHelpers';

interface ProjectTimelineProps {
  filterStatus?: string;
  filterCategory?: string;
}

export default function ProjectTimeline({ filterStatus, filterCategory }: ProjectTimelineProps) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: projects, isLoading } = useBaserowProjects();

  // Calculate 3-month view range
  const viewStart = startOfMonth(subMonths(currentDate, 1));
  const viewEnd = endOfMonth(addMonths(currentDate, 1));
  const days = eachDayOfInterval({ start: viewStart, end: viewEnd });
  const totalDays = days.length;

  // Filter projects
  let filteredProjects = projects || [];

  if (filterStatus && filterStatus !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.status?.value === filterStatus);
  }

  if (filterCategory && filterCategory !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.project_type?.value === filterCategory);
  }

  // Filter projects that overlap with view range
  const visibleProjects = useMemo(() => {
    return filteredProjects.filter((project) => {
      if (!project.start_date || !project.planned_end_date) return false;
      const startDate = parseISO(project.start_date);
      const deadline = parseISO(project.planned_end_date);

      return (
        isWithinInterval(startDate, { start: viewStart, end: viewEnd }) ||
        isWithinInterval(deadline, { start: viewStart, end: viewEnd }) ||
        (startDate <= viewStart && deadline >= viewEnd)
      );
    });
  }, [filteredProjects, viewStart, viewEnd]);

  const getProjectPosition = (project: BaserowProject) => {
    if (!project.start_date || !project.planned_end_date) return { left: '0%', width: '0%' };

    const startDate = parseISO(project.start_date);
    const deadline = parseISO(project.planned_end_date);

    const clampedStart = startDate < viewStart ? viewStart : startDate;
    const clampedEnd = deadline > viewEnd ? viewEnd : deadline;

    const startOffset = differenceInDays(clampedStart, viewStart);
    const duration = differenceInDays(clampedEnd, clampedStart) + 1;

    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  // Generate month headers
  const months = useMemo(() => {
    const result = [];
    let currentMonth = viewStart;

    while (currentMonth <= viewEnd) {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const clampedStart = monthStart < viewStart ? viewStart : monthStart;
      const clampedEnd = monthEnd > viewEnd ? viewEnd : monthEnd;

      const startOffset = differenceInDays(clampedStart, viewStart);
      const duration = differenceInDays(clampedEnd, clampedStart) + 1;

      result.push({
        name: format(currentMonth, 'MMMM yyyy', { locale: nl }),
        left: (startOffset / totalDays) * 100,
        width: (duration / totalDays) * 100,
      });

      currentMonth = addMonths(currentMonth, 1);
    }

    return result;
  }, [viewStart, viewEnd, totalDays]);

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          {t('projects.views.timeline')}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            {t('common.today', 'Vandaag')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Month headers */}
      <div className="relative h-8 border-b mb-2">
        {months.map((month, index) => (
          <div
            key={index}
            className="absolute text-xs font-medium text-muted-foreground px-2 py-1 border-r last:border-r-0"
            style={{ left: `${month.left}%`, width: `${month.width}%` }}
          >
            {month.name}
          </div>
        ))}
      </div>

      {/* Today marker */}
      {isWithinInterval(new Date(), { start: viewStart, end: viewEnd }) && (
        <div
          className="absolute w-0.5 bg-red-500 z-10 opacity-50"
          style={{
            left: `${(differenceInDays(new Date(), viewStart) / totalDays) * 100}%`,
            top: '88px',
            height: `${visibleProjects.length * 48 + 20}px`,
          }}
        />
      )}

      {/* Projects */}
      <div className="relative space-y-2 min-h-[200px]">
        {visibleProjects.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            {t('projects.noProjects')}
          </div>
        ) : (
          visibleProjects.map((project) => {
            const position = getProjectPosition(project);
            const projectTypeColor = project.project_type?.value
              ? getProjectTypeColor(project.project_type.value).replace('bg-', '').split(' ')[0]
              : 'gray-500';

            return (
              <div key={project.id} className="relative h-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/projects/${project.id}`}
                        className={`absolute h-8 rounded bg-${projectTypeColor} hover:opacity-80 transition-opacity flex items-center px-2 overflow-hidden`}
                        style={{
                          left: position.left,
                          width: position.width,
                          backgroundColor: getBackgroundColor(project.project_type?.value),
                        }}
                      >
                        <span className="text-white text-xs font-medium truncate">
                          {project.name}
                        </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.link_to_customer?.[0]?.value || ''}
                        </p>
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            {project.start_date && format(parseISO(project.start_date), 'dd MMM', { locale: nl })} - {project.planned_end_date && format(parseISO(project.planned_end_date), 'dd MMM yyyy', { locale: nl })}
                          </span>
                        </div>
                        <div className="text-xs">
                          {project.progress_percentage || 0}% {t('projects.status.afgerond').toLowerCase()}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#06b6d4' }} />
          <span className="text-muted-foreground">{t('projects.projectTypes.groeibegeleiding')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-muted-foreground">{t('projects.projectTypes.procesoptimalisatie')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#eab308' }} />
          <span className="text-muted-foreground">{t('projects.projectTypes.digitalisering')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }} />
          <span className="text-muted-foreground">{t('projects.projectTypes.vofNaarBv')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#a855f7' }} />
          <span className="text-muted-foreground">{t('projects.projectTypes.jaarrekeningPakket')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ec4899' }} />
          <span className="text-muted-foreground">{t('projects.projectTypes.bedrijfsoverdracht')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6b7280' }} />
          <span className="text-muted-foreground">{t('projects.projectTypes.overig')}</span>
        </div>
      </div>
    </div>
  );
}

// Helper function for timeline bar colors
function getBackgroundColor(projectType?: string): string {
  const colors: Record<string, string> = {
    'Groeibegeleiding': '#06b6d4',
    'Procesoptimalisatie': '#3b82f6',
    'Digitalisering': '#eab308',
    'VOF naar BV': '#f59e0b',
    'Jaarrekening Pakket': '#a855f7',
    'Bedrijfsoverdracht': '#ec4899',
    'Overig': '#6b7280',
  };
  return colors[projectType || ''] || '#6b7280';
}
