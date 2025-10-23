import { useProjectStats } from '@/lib/api/projects';
import { Clock, AlertTriangle, CheckCircle, Hourglass } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsStats() {
  const { data: stats, isLoading } = useProjectStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">In uitvoering</span>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{stats?.inProgress || 0}</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Wacht op klant</span>
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <Hourglass className="w-4 h-4 text-yellow-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{stats?.waitingOnClient || 0}</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Geblokkeerd</span>
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{stats?.blocked || 0}</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Afgerond</span>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{stats?.completed || 0}</div>
      </div>
    </div>
  );
}
