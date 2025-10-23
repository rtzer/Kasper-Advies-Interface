import { useProjects } from '@/lib/api/projects';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, User, AlertTriangle } from 'lucide-react';
import { formatDeadline, getDeadlineColor, getStatusColor, getStatusLabel, getCategoryColor } from '@/lib/utils/projectHelpers';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectsListProps {
  filterStatus: string;
  filterCategory: string;
}

export default function ProjectsList({ filterStatus, filterCategory }: ProjectsListProps) {
  const { data: projectsData, isLoading } = useProjects({
    status: filterStatus,
    category: filterCategory,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 m-4" />
        ))}
      </div>
    );
  }

  const projects = projectsData?.results || [];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Project</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Klant</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Categorie</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Voortgang</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Deadline</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Verantwoordelijk</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <Link to={`/projects/${project.id}`} className="hover:underline">
                    <div className="flex items-start">
                      <span className="font-medium text-sm text-foreground">{project.name}</span>
                      {project.is_overdue && (
                        <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                      )}
                    </div>
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-muted-foreground">{project.client_name}</span>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className={getCategoryColor(project.category)}>
                    {project.category}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Progress value={project.completion_percentage} className="h-2 w-24" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {project.completion_percentage}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className={`flex items-center text-sm ${getDeadlineColor(project.deadline)}`}>
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDeadline(project.deadline)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-1" />
                    {project.responsible_team_member}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
