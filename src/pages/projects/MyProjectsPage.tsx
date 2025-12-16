import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBaserowProjects } from '@/lib/api/projects';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FolderKanban } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

export default function MyProjectsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useUserStore();
  const { data: projects, isLoading } = useBaserowProjects();

  const myProjects = (projects || []).filter((project) => {
    const matchesSearch =
      project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.link_to_customer?.[0]?.value?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Afgerond': return 'bg-green-500';
      case 'Actief': return 'bg-blue-500';
      case 'On hold': return 'bg-yellow-500';
      case 'Geannuleerd': return 'bg-red-500';
      case 'Concept': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'Concept': return t('projects.status.concept');
      case 'Actief': return t('projects.status.actief');
      case 'On hold': return t('projects.status.onHold');
      case 'Afgerond': return t('projects.status.afgerond');
      case 'Geannuleerd': return t('projects.status.geannuleerd');
      default: return status || '';
    }
  };

  const getProjectTypeLabel = (projectType?: string) => {
    switch (projectType) {
      case 'Groeibegeleiding': return t('projects.projectTypes.groeibegeleiding');
      case 'Procesoptimalisatie': return t('projects.projectTypes.procesoptimalisatie');
      case 'Digitalisering': return t('projects.projectTypes.digitalisering');
      case 'VOF naar BV': return t('projects.projectTypes.vofNaarBv');
      case 'Jaarrekening Pakket': return t('projects.projectTypes.jaarrekeningPakket');
      case 'Bedrijfsoverdracht': return t('projects.projectTypes.bedrijfsoverdracht');
      case 'Overig': return t('projects.projectTypes.overig');
      default: return projectType || '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderKanban className="w-8 h-8 text-primary" />
            {t('projects.myProjects')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('projects.myProjectsSubtitle')}
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('projects.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid gap-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </>
        ) : myProjects.length === 0 ? (
          <Card className="p-8 text-center">
            <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">
              {t('projects.noProjectsFound')}
            </h3>
            <p className="text-muted-foreground">
              {t('projects.noProjectsAssigned')}
            </p>
          </Card>
        ) : (
          myProjects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="p-6 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">
                        {getProjectTypeLabel(project.project_type?.value)}
                      </Badge>
                      <Badge className={getStatusColor(project.status?.value)}>
                        {getStatusLabel(project.status?.value)}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {project.link_to_customer?.[0]?.value || ''}
                    </p>
                  </div>
                </div>

                {project.progress_percentage && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('projects.progress')}</span>
                      <span className="font-medium">{project.progress_percentage}%</span>
                    </div>
                    <Progress value={parseInt(project.progress_percentage)} />
                  </div>
                )}

                {project.planned_end_date && (
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>{t('projects.deadline')}: {new Date(project.planned_end_date).toLocaleDateString()}</span>
                  </div>
                )}
              </Card>
            </Link>
          ))
        )}
      </div>

      {!isLoading && myProjects.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {t('projects.projectCount', { count: myProjects.length })}
        </div>
      )}
    </div>
  );
}
