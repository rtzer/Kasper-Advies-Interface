import { ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjects } from '@/lib/api/projects';
import { getStatusColor, getStatusLabel } from '@/lib/utils/projectHelpers';

export default function TeamWorkloadPage() {
  const { data: projectsData, isLoading } = useProjects({});
  
  const projects = projectsData?.results || [];
  
  // Group projects by team member
  const teamWorkload = projects.reduce((acc, project) => {
    const member = project.responsible_team_member;
    if (!acc[member]) {
      acc[member] = {
        name: member,
        initials: project.responsible_initials,
        projects: [],
        total: 0,
        'niet-gestart': 0,
        'in-uitvoering': 0,
        'wacht-op-klant': 0,
        'geblokkeerd': 0,
        'afgerond': 0,
      };
    }
    
    acc[member].projects.push(project);
    acc[member].total++;
    acc[member][project.status]++;
    
    return acc;
  }, {} as Record<string, any>);

  const teamMembers = Object.values(teamWorkload).sort((a: any, b: any) => b.total - a.total);

  const getWorkloadColor = (activeProjects: number) => {
    if (activeProjects <= 3) return 'bg-green-100 text-green-800 border-green-200';
    if (activeProjects <= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getWorkloadStatus = (activeProjects: number) => {
    if (activeProjects <= 3) return 'Normale belasting';
    if (activeProjects <= 6) return 'Druk';
    return 'Overbelast';
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-screen-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <Link to="/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Terug naar projecten
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Team Workload Overzicht</h1>
        <p className="text-muted-foreground mt-1">
          Verdeling van projecten over het team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member: any) => {
          const activeProjects = member['in-uitvoering'] + member['wacht-op-klant'];
          
          return (
            <Card key={member.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-ka-navy text-white flex items-center justify-center text-lg font-medium">
                    {member.initials}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.total} projecten totaal</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Workload Status Badge */}
                <div className={`p-3 rounded-lg border ${getWorkloadColor(activeProjects)}`}>
                  <p className="text-sm font-medium text-center">
                    {getWorkloadStatus(activeProjects)}
                  </p>
                  <p className="text-xs text-center mt-1">
                    {activeProjects} actieve projecten
                  </p>
                </div>

                {/* Status Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Status verdeling</h4>
                  
                  {member['niet-gestart'] > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Niet gestart</span>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        {member['niet-gestart']}
                      </Badge>
                    </div>
                  )}
                  
                  {member['in-uitvoering'] > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">In uitvoering</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {member['in-uitvoering']}
                      </Badge>
                    </div>
                  )}
                  
                  {member['wacht-op-klant'] > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Wacht op klant</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {member['wacht-op-klant']}
                      </Badge>
                    </div>
                  )}
                  
                  {member['geblokkeerd'] > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Geblokkeerd</span>
                      <Badge variant="destructive">
                        {member['geblokkeerd']}
                      </Badge>
                    </div>
                  )}
                  
                  {member['afgerond'] > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Afgerond</span>
                      <Badge className="bg-green-100 text-green-800">
                        {member['afgerond']}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Recent Projects */}
                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium text-foreground">Recente projecten</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {member.projects.slice(0, 5).map((project: any) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="block text-sm hover:bg-muted p-2 rounded transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate flex-1 text-foreground">{project.name}</span>
                          <Badge className={`${getStatusColor(project.status)} text-xs`} variant="outline">
                            {getStatusLabel(project.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={project.completion_percentage} className="h-1 flex-1" />
                          <span className="text-xs text-muted-foreground">{project.completion_percentage}%</span>
                        </div>
                      </Link>
                    ))}
                    {member.projects.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-1">
                        +{member.projects.length - 5} meer
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
