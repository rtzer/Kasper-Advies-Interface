import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, differenceInDays, addMonths, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { useProjects } from '@/lib/api/projects';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface ProjectTimelineProps {
  filterStatus?: string;
  filterCategory?: string;
}

export default function ProjectTimeline({ filterStatus, filterCategory }: ProjectTimelineProps) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: projectsData, isLoading } = useProjects({
    status: filterStatus,
    category: filterCategory,
  });

  const projects = projectsData?.results || [];

  // Calculate 3-month view range
  const viewStart = startOfMonth(subMonths(currentDate, 1));
  const viewEnd = endOfMonth(addMonths(currentDate, 1));
  const days = eachDayOfInterval({ start: viewStart, end: viewEnd });
  const totalDays = days.length;

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'btw':
      case 'btw bulk':
        return 'bg-emerald-500';
      case 'jaarrekening':
      case 'fiscale begeleiding':
        return 'bg-blue-500';
      case 'hypotheek':
      case 'advies':
      case 'groeibegeleiding':
        return 'bg-amber-500';
      case 'loonadministratie':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Filter projects that overlap with view range
  const visibleProjects = useMemo(() => {
    return projects.filter((project) => {
      const startDate = parseISO(project.start_date);
      const deadline = parseISO(project.deadline);
      
      return (
        isWithinInterval(startDate, { start: viewStart, end: viewEnd }) ||
        isWithinInterval(deadline, { start: viewStart, end: viewEnd }) ||
        (startDate <= viewStart && deadline >= viewEnd)
      );
    });
  }, [projects, viewStart, viewEnd]);

  const getProjectPosition = (project: Project) => {
    const startDate = parseISO(project.start_date);
    const deadline = parseISO(project.deadline);
    
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
          {t('projects.views.timeline', 'Tijdlijn')}
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
            {t('projects.noProjects', 'Geen projecten gevonden')}
          </div>
        ) : (
          visibleProjects.map((project) => {
            const position = getProjectPosition(project);
            
            return (
              <div key={project.id} className="relative h-10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/projects/${project.id}`}
                        className={`absolute h-8 rounded ${getCategoryColor(project.category)} hover:opacity-80 transition-opacity flex items-center px-2 overflow-hidden`}
                        style={{ left: position.left, width: position.width }}
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
                          {project.client_name}
                        </p>
                        <div className="text-xs">
                          <span className="text-muted-foreground">
                            {format(parseISO(project.start_date), 'dd MMM', { locale: nl })} - {format(parseISO(project.deadline), 'dd MMM yyyy', { locale: nl })}
                          </span>
                        </div>
                        <div className="text-xs">
                          {project.completion_percentage || 0}% {t('projects.completed', 'afgerond')}
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
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-muted-foreground">BTW</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-muted-foreground">{t('projects.categories.jaarwerk', 'Jaarwerk')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span className="text-muted-foreground">{t('projects.categories.advies', 'Advies')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-purple-500" />
          <span className="text-muted-foreground">{t('projects.categories.loonadministratie', 'Loonadministratie')}</span>
        </div>
      </div>
    </div>
  );
}
