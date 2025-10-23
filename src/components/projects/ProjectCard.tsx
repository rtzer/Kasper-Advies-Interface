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
  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className={getCategoryColor(project.category)}>
            {project.category}
          </Badge>
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
