import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjects } from '@/lib/api/projects';
import { useTaken } from '@/lib/api/taken';
import WorkloadIndicator from '@/components/projects/WorkloadIndicator';
import { useTranslation } from 'react-i18next';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';

export default function TeamWorkloadPage() {
  const { t } = useTranslation();
  const { data: projectsData, isLoading: projectsLoading } = useProjects({});
  const { data: takenData, isLoading: takenLoading } = useTaken({});
  
  const projects = projectsData?.results || [];
  const taken = takenData?.results || [];
  
  // Group projects and tasks by team member
  const teamWorkload = projects.reduce((acc, project) => {
    const member = project.responsible_team_member;
    if (!member) return acc;
    
    if (!acc[member]) {
      acc[member] = {
        name: member,
        initials: project.responsible_initials || member.split(' ').map(n => n[0]).join(''),
        projects: [],
        tasks: [],
        total: 0,
        activeProjects: 0,
        'niet-gestart': 0,
        'in-uitvoering': 0,
        'wacht-op-klant': 0,
        'in-review': 0,
        'geblokkeerd': 0,
        'afgerond': 0,
      };
    }
    
    acc[member].projects.push(project);
    acc[member].total++;
    if (project.status === 'in-uitvoering' || project.status === 'wacht-op-klant' || project.status === 'in-review') {
      acc[member].activeProjects++;
    }
    if (acc[member][project.status] !== undefined) {
      acc[member][project.status]++;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Add tasks to team workload
  taken.forEach(taak => {
    const member = taak.toegewezen_aan;
    if (member && teamWorkload[member]) {
      teamWorkload[member].tasks.push(taak);
    }
  });

  const teamMembers = Object.values(teamWorkload).sort((a: any, b: any) => b.activeProjects - a.activeProjects);

  const isOverloaded = (projects: number, tasks: number) => projects > 10 || tasks > 15;
  const isLoading = projectsLoading || takenLoading;

  if (isLoading) {
    return (
      <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-2xl mx-auto">
      <Link to="/projects" className="inline-flex items-center text-xs xs:text-sm text-muted-foreground hover:text-foreground mb-3 xs:mb-4">
        <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
        {t('projects.backToProjects', 'Terug naar projecten')}
      </Link>

      <div className="mb-4 xs:mb-6">
        <h1 className={`${responsiveHeading.h2}`}>
          {t('projects.workloadOverview', 'Team Workload Overzicht')}
        </h1>
        <p className={`${responsiveBody.small} mt-1`}>
          {t('projects.workloadDescription', 'Verdeling van projecten en taken over het team')}
        </p>
      </div>

      {/* Warning banner if someone is overloaded */}
      {teamMembers.some((m: any) => isOverloaded(m.activeProjects, m.tasks.filter((t: any) => t.status !== 'Afgerond').length)) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 xs:p-4 mb-4 xs:mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 xs:w-5 xs:h-5 text-red-600" />
            <span className="text-xs xs:text-sm font-medium text-red-800 dark:text-red-200">
              {t('projects.workloadWarning', 'Let op: Er zijn teamleden met een hoge werkbelasting!')}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
        {teamMembers.map((member: any) => {
          const activeTasks = member.tasks.filter((t: any) => t.status !== 'Afgerond').length;
          const memberOverloaded = isOverloaded(member.activeProjects, activeTasks);
          
          return (
            <Card 
              key={member.name} 
              className={`hover:shadow-lg transition-shadow ${memberOverloaded ? 'border-red-300 dark:border-red-700' : ''}`}
            >
              <CardHeader className="pb-2 xs:pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 xs:w-12 xs:h-12 rounded-full flex items-center justify-center text-sm xs:text-lg font-medium ${
                    memberOverloaded 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                      : 'bg-ka-navy text-white'
                  }`}>
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm xs:text-base lg:text-lg truncate">{member.name}</CardTitle>
                    <CardDescription className="text-[10px] xs:text-xs">
                      {member.total} {t('projects.projectsTotal', 'projecten totaal')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 xs:space-y-4">
                {/* Workload Meter */}
                <WorkloadIndicator 
                  projectCount={member.activeProjects}
                  taskCount={activeTasks}
                  variant="meter"
                />

                {/* Status Breakdown */}
                <div className="space-y-1.5 xs:space-y-2">
                  <h4 className="text-xs xs:text-sm font-medium text-foreground">
                    {t('projects.statusDistribution', 'Status verdeling')}
                  </h4>
                  
                  {member['in-uitvoering'] > 0 && (
                    <div className="flex items-center justify-between text-xs xs:text-sm">
                      <span className="text-muted-foreground">{t('projects.status.inProgress', 'In uitvoering')}</span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] xs:text-xs">
                        {member['in-uitvoering']}
                      </Badge>
                    </div>
                  )}
                  
                  {member['in-review'] > 0 && (
                    <div className="flex items-center justify-between text-xs xs:text-sm">
                      <span className="text-muted-foreground">{t('projects.status.inReview', 'In review')}</span>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-[10px] xs:text-xs">
                        {member['in-review']}
                      </Badge>
                    </div>
                  )}
                  
                  {member['wacht-op-klant'] > 0 && (
                    <div className="flex items-center justify-between text-xs xs:text-sm">
                      <span className="text-muted-foreground">{t('projects.status.waitingClient', 'Wacht op klant')}</span>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 text-[10px] xs:text-xs">
                        {member['wacht-op-klant']}
                      </Badge>
                    </div>
                  )}
                  
                  {member['geblokkeerd'] > 0 && (
                    <div className="flex items-center justify-between text-xs xs:text-sm">
                      <span className="text-muted-foreground">{t('projects.status.blocked', 'Geblokkeerd')}</span>
                      <Badge variant="destructive" className="text-[10px] xs:text-xs">
                        {member['geblokkeerd']}
                      </Badge>
                    </div>
                  )}
                  
                  {member['afgerond'] > 0 && (
                    <div className="flex items-center justify-between text-xs xs:text-sm">
                      <span className="text-muted-foreground">{t('projects.status.completed', 'Afgerond')}</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-[10px] xs:text-xs">
                        {member['afgerond']}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Recent Projects */}
                <div className="space-y-1.5 xs:space-y-2 pt-2 xs:pt-3 border-t">
                  <h4 className="text-xs xs:text-sm font-medium text-foreground">
                    {t('projects.recentProjects', 'Recente projecten')}
                  </h4>
                  <div className="space-y-1.5 xs:space-y-2 max-h-36 xs:max-h-40 overflow-y-auto">
                    {member.projects.slice(0, 5).map((project: any) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block text-xs xs:text-sm hover:bg-muted p-1.5 xs:p-2 rounded transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate flex-1 text-foreground">{project.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={project.completion_percentage} className="h-1 flex-1" />
                          <span className="text-[10px] xs:text-xs text-muted-foreground">
                            {project.completion_percentage}%
                          </span>
                        </div>
                      </Link>
                    ))}
                    {member.projects.length > 5 && (
                      <p className="text-[10px] xs:text-xs text-muted-foreground text-center pt-1">
                        +{member.projects.length - 5} {t('common.more', 'meer')}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
