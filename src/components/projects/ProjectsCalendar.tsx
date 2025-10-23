import { useProjects } from '@/lib/api/projects';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { getCategoryColor } from '@/lib/utils/projectHelpers';
import { Link } from 'react-router-dom';

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
          <div className="space-y-3">
            {projectsOnDate.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Badge variant="outline" className={`${getCategoryColor(project.category)} mb-2`}>
                    {project.category}
                  </Badge>
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    {project.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {project.client_name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
