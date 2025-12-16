import { useState, useMemo } from 'react';
import { useBaserowProjects, BaserowProject } from '@/lib/api/projects';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, User, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatDeadline, getDeadlineColor, getStatusColor, getProjectTypeColor } from '@/lib/utils/projectHelpers';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

interface ProjectsListProps {
  filterStatus: string;
  filterCategory: string;
}

type SortField = 'name' | 'client_name' | 'deadline' | 'completion_percentage' | 'status';
type SortDirection = 'asc' | 'desc';

export default function ProjectsList({ filterStatus, filterCategory }: ProjectsListProps) {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('deadline');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: projects, isLoading } = useBaserowProjects();

  // Filter projects
  let filteredProjects = projects || [];

  if (filterStatus && filterStatus !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.status?.value === filterStatus);
  }

  if (filterCategory && filterCategory !== 'all') {
    filteredProjects = filteredProjects.filter(p => p.project_type?.value === filterCategory);
  }

  // Sorted projects
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'client_name':
          comparison = (a.link_to_customer?.[0]?.value || '').localeCompare(b.link_to_customer?.[0]?.value || '');
          break;
        case 'deadline':
          comparison = new Date(a.planned_end_date || 0).getTime() - new Date(b.planned_end_date || 0).getTime();
          break;
        case 'completion_percentage':
          comparison = parseInt(a.progress_percentage || '0') - parseInt(b.progress_percentage || '0');
          break;
        case 'status':
          comparison = (a.status?.value || '').localeCompare(b.status?.value || '');
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredProjects, sortField, sortDirection]);

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

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 m-4" />
        ))}
      </div>
    );
  }

  if (sortedProjects.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-12 text-center">
        <p className="text-muted-foreground">{t('projects.noProjectsFound')}</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b">
            <tr>
              <th
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  {t('projects.columns.project')}
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('client_name')}
              >
                <div className="flex items-center gap-2">
                  {t('projects.columns.client')}
                  <SortIcon field="client_name" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                {t('projects.columns.category')}
              </th>
              <th
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  {t('projects.columns.status')}
                  <SortIcon field="status" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('completion_percentage')}
              >
                <div className="flex items-center gap-2">
                  {t('projects.columns.progress')}
                  <SortIcon field="completion_percentage" />
                </div>
              </th>
              <th
                className="text-left py-3 px-4 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort('deadline')}
              >
                <div className="flex items-center gap-2">
                  {t('projects.columns.deadline')}
                  <SortIcon field="deadline" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                {t('projects.columns.responsible')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project) => {
              const isOverdue = project.planned_end_date
                ? new Date(project.planned_end_date) < new Date() && project.status?.value !== 'Afgerond'
                : false;
              const clientName = project.link_to_customer?.[0]?.value || '';
              const progressValue = parseInt(project.progress_percentage || '0');

              return (
                <tr key={project.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <Link to={`/projects/${project.id}`} className="hover:underline">
                      <div className="flex items-start">
                        <span className="font-medium text-sm text-foreground">{project.name}</span>
                        {isOverdue && (
                          <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {clientName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {project.project_type?.value && (
                      <Badge variant="outline" className={getProjectTypeColor(project.project_type.value)}>
                        {t(`projects.projectTypes.${getProjectTypeKey(project.project_type.value)}`, project.project_type.value)}
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {project.status?.value && (
                      <Badge className={getStatusColor(project.status.value)}>
                        {t(`projects.status.${getStatusKey(project.status.value)}`, project.status.value)}
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Progress value={progressValue} className="h-2 w-24" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {progressValue}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {project.planned_end_date && (
                      <div className={`flex items-center text-sm ${getDeadlineColor(project.planned_end_date)}`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDeadline(project.planned_end_date)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-1" />
                      {project.responsible_person?.[0]?.value || '-'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
