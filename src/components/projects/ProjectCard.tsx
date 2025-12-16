import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import { formatDeadline, getDeadlineColor, getStatusColor, getProjectTypeColor } from '@/lib/utils/projectHelpers';
import { Link } from 'react-router-dom';
import ProjectProgressBar from './ProjectProgressBar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation();

  // Get initials for team members
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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

  return (
    <Link to={`/projects/${project.id}`}>
      <div className="bg-card border rounded-lg p-3 xs:p-4 hover:shadow-md transition-shadow cursor-pointer">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-2 mb-2 xs:mb-3">
          <div className="flex flex-wrap gap-1.5">
            {project.category && (
              <Badge className={`${getProjectTypeColor(project.category)} text-[10px] xs:text-xs px-1.5`}>
                {t(`projects.projectTypes.${getProjectTypeKey(project.category)}`, project.category)}
              </Badge>
            )}
            {project.status && (
              <Badge className={`${getStatusColor(project.status)} text-[10px] xs:text-xs px-1.5`}>
                {t(`projects.status.${getStatusKey(project.status)}`, project.status)}
              </Badge>
            )}
          </div>
          {(project.is_overdue || project.blocked_reason) && (
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
        </div>

        {/* Project name */}
        <h4 className="font-medium text-foreground text-xs xs:text-sm mb-1.5 xs:mb-2 line-clamp-2">
          {project.name}
        </h4>

        {/* Client name */}
        <p className="text-[10px] xs:text-xs text-muted-foreground mb-2 xs:mb-3 truncate">
          {project.client_name}
        </p>

        {/* Progress bar */}
        <div className="mb-2 xs:mb-3">
          <ProjectProgressBar
            tasksTotal={project.tasks_total}
            tasksCompleted={project.tasks_completed}
            percentage={project.completion_percentage}
            size="sm"
          />
        </div>

        {/* Footer with deadline and team */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center text-[10px] xs:text-xs ${getDeadlineColor(project.deadline)}`}>
            <Clock className="w-3 h-3 mr-1" />
            {formatDeadline(project.deadline)}
          </div>

          {/* Team avatars */}
          <div className="flex -space-x-2">
            <TooltipProvider>
              {(project.team_members || [project.responsible_team_member]).slice(0, 3).map((member, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Avatar className="w-6 h-6 border-2 border-background">
                      <AvatarFallback className="text-[10px] bg-ka-navy text-white">
                        {member ? getInitials(member) : '?'}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{member}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {(project.team_members?.length || 0) > 3 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="w-6 h-6 border-2 border-background">
                      <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                        +{(project.team_members?.length || 0) - 3}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">
                      {project.team_members?.slice(3).join(', ')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </div>

        {/* Task count badge */}
        {project.tasks_total && project.tasks_total > 0 && (
          <div className="mt-2 pt-2 border-t">
            <span className="text-[10px] xs:text-xs text-muted-foreground">
              {project.tasks_completed || 0}/{project.tasks_total} {t('projects.tasks', 'taken')}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
