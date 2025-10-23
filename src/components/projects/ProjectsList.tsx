import { useState, useMemo } from 'react';
import { useProjects } from '@/lib/api/projects';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, User, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatDeadline, getDeadlineColor, getStatusColor, getStatusLabel, getCategoryColor } from '@/lib/utils/projectHelpers';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Project } from '@/types';

interface ProjectsListProps {
  filterStatus: string;
  filterCategory: string;
}

type SortField = 'name' | 'client_name' | 'deadline' | 'completion_percentage' | 'status';
type SortDirection = 'asc' | 'desc';

export default function ProjectsList({ filterStatus, filterCategory }: ProjectsListProps) {
  const [sortField, setSortField] = useState<SortField>('deadline');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const { data: projectsData, isLoading } = useProjects({
    status: filterStatus,
    category: filterCategory,
  });

  const projects = projectsData?.results || [];

  // Sorted projects
  const sortedProjects = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'client_name':
          comparison = a.client_name.localeCompare(b.client_name);
          break;
        case 'deadline':
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          break;
        case 'completion_percentage':
          comparison = a.completion_percentage - b.completion_percentage;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [projects, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 m-4" />
        ))}
      </div>
    );
  }

  if (sortedProjects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-muted-foreground">Geen projecten gevonden met de huidige filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b">
            <tr>
              <th 
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Project
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('client_name')}
              >
                <div className="flex items-center gap-2">
                  Klant
                  <SortIcon field="client_name" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Categorie</th>
              <th 
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('completion_percentage')}
              >
                <div className="flex items-center gap-2">
                  Voortgang
                  <SortIcon field="completion_percentage" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('deadline')}
              >
                <div className="flex items-center gap-2">
                  Deadline
                  <SortIcon field="deadline" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Verantwoordelijk</th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project) => (
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
