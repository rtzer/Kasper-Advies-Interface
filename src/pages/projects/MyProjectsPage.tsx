import { useState } from 'react';
import { useProjects } from '@/lib/api/projects';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FolderKanban } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

export default function MyProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useUserStore();
  const { data, isLoading } = useProjects();
  
  const projects = data?.results || [];
  
  const myProjects = projects.filter((project: any) => {
    const matchesSearch = 
      project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'afgerond': return 'bg-green-500';
      case 'in-uitvoering': return 'bg-blue-500';
      case 'wacht-op-klant': return 'bg-yellow-500';
      case 'geblokkeerd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'niet-gestart': return 'Niet gestart';
      case 'in-uitvoering': return 'In uitvoering';
      case 'wacht-op-klant': return 'Wacht op klant';
      case 'geblokkeerd': return 'Geblokkeerd';
      case 'afgerond': return 'Afgerond';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderKanban className="w-8 h-8 text-primary" />
            Mijn Projecten
          </h1>
          <p className="text-muted-foreground mt-1">
            Projecten waar jij verantwoordelijk voor bent
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Zoek op naam, nummer, klant..."
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
              Geen projecten gevonden
            </h3>
            <p className="text-muted-foreground">
              Je hebt nog geen projecten toegewezen
            </p>
          </Card>
        ) : (
          myProjects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="p-6 hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {project.client_name}
                    </p>
                  </div>
                </div>

                {project.completion_percentage !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Voortgang</span>
                      <span className="font-medium">{project.completion_percentage}%</span>
                    </div>
                    <Progress value={project.completion_percentage} />
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>Deadline: {new Date(project.deadline).toLocaleDateString('nl-NL')}</span>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {!isLoading && myProjects.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {myProjects.length} {myProjects.length === 1 ? 'project' : 'projecten'}
        </div>
      )}
    </div>
  );
}
