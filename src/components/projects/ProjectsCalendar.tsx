import { useProjects } from '@/lib/api/projects';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { getCategoryColor, getStatusColor, getStatusLabel, formatDeadline } from '@/lib/utils/projectHelpers';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';

interface ProjectsCalendarProps {
  filterStatus: string;
  filterCategory: string;
}

export default function ProjectsCalendar({ filterStatus, filterCategory }: ProjectsCalendarProps) {
  const { data: projectsData } = useProjects({
    status: filterStatus,
    category: filterCategory,
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const projects = projectsData?.results || [];

  const projectsOnDate = projects.filter((p) => {
    if (!selectedDate) return false;
    const deadlineDate = new Date(p.deadline);
    return (
      deadlineDate.getDate() === selectedDate.getDate() &&
      deadlineDate.getMonth() === selectedDate.getMonth() &&
      deadlineDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const datesWithProjects = projects.map((p) => new Date(p.deadline));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-foreground mb-4">
          {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: nl }) : 'Selecteer een datum'}
        </h3>

        {projectsOnDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Geen projecten op deze datum
          </p>
        ) : (
          <TooltipProvider>
            <div className="space-y-3">
              {projectsOnDate.map((project) => (
                <Tooltip key={project.id}>
                  <TooltipTrigger asChild>
                    <Link to={`/projects/${project.id}`}>
                      <div className="border rounded-lg p-3 hover:bg-muted/50 hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className={getCategoryColor(project.category)}>
                            {project.category}
                          </Badge>
                          <Badge className={getStatusColor(project.status)} variant="outline">
                            {getStatusLabel(project.status)}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm text-foreground mb-1">
                          {project.name}
                        </h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {project.client_name}
                        </p>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-medium">{project.name}</p>
                      <div className="space-y-1 text-xs">
                        <p className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>Deadline: {formatDeadline(project.deadline)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>Klant: {project.client_name}</span>
                        </p>
                        <p>Voortgang: {project.completion_percentage}%</p>
                        <p>Verantwoordelijk: {project.responsible_team_member}</p>
                      </div>
                      {project.blocked_reason && (
                        <p className="text-red-600 text-xs">
                          Geblokkeerd: {project.blocked_reason}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
