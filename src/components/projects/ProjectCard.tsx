import { Clock, User, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Project } from '@/types';
import { formatDeadline, getDeadlineColor, getCategoryColor } from '@/lib/utils/projectHelpers';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch(priority) {
      case 'Urgent': return 'text-red-600 bg-red-50';
      case 'Hoog': return 'text-orange-600 bg-orange-50';
      case 'Normaal': return 'text-blue-600 bg-blue-50';
      case 'Laag': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2">
            <Badge variant="outline" className={getCategoryColor(project.category)}>
              {project.category}
            </Badge>
            {project.status && (
              <Badge variant="secondary" className="text-xs">
                {project.status}
              </Badge>
            )}
          </div>
          {project.is_overdue && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>

        <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
          {project.name}
        </h4>

        <p className="text-xs text-muted-foreground mb-3">
          {project.client_name}
        </p>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Voortgang</span>
            <span>{project.completion_percentage}%</span>
          </div>
          <Progress value={project.completion_percentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center ${getDeadlineColor(project.deadline)}`}>
            <Clock className="w-3 h-3 mr-1" />
            {formatDeadline(project.deadline)}
          </div>
          <div className="flex items-center text-muted-foreground">
            <User className="w-3 h-3 mr-1" />
            {project.responsible_initials}
          </div>
        </div>
      </div>
    </Link>
  );
}
