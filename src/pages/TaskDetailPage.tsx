import { useParams, Link } from 'react-router-dom';
import { useTaak } from '@/lib/api/taken';
import { CheckCircle, Circle, Clock, AlertCircle, ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: taak, isLoading } = useTaak(id || '');
  const { currentUser } = useUserStore();

  if (isLoading) {
    return (
      <div className="p-6 max-w-screen-xl mx-auto space-y-6">
        <Skeleton className="h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!taak) {
    return (
      <div className="p-6 max-w-screen-xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">Taak niet gevonden</h2>
          <p className="text-muted-foreground mb-4">De opgevraagde taak bestaat niet.</p>
          <Link to="/tasks">
            <Button>Terug naar taken</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Te doen':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'In uitvoering':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Geblokkeerd':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Afgerond':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'destructive';
      case 'Hoog':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <Link to="/tasks" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Terug naar taken
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className={getStatusColor(taak.status)}>
                {taak.status}
              </Badge>
              <Badge variant={getPriorityColor(taak.priority)}>
                {taak.priority}
              </Badge>
              {taak.blocked_reason && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Geblokkeerd
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {taak.taak_omschrijving}
            </h1>
            {taak.deadline && (
              <p className="text-muted-foreground flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Deadline: {formatDate(taak.deadline, currentUser?.language || 'nl')}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              className="bg-ka-green hover:bg-ka-green/90" 
              size="sm"
            >
              Status updaten
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Taak Details
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Beschrijving</h3>
                <p className="text-muted-foreground">
                  {taak.taak_omschrijving}
                </p>
              </div>

              {taak.blocked_reason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    Taak geblokkeerd
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {taak.blocked_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-foreground mb-3">Klant</h3>
            <div className="space-y-2 text-sm">
              <Link 
                to={`/clients/${taak.klant_id}`}
                className="font-medium text-foreground hover:underline block"
              >
                {taak.klant_naam}
              </Link>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Phone className="w-4 h-4 mr-2" />
                Contact opnemen
              </Button>
            </div>
          </div>

          {taak.toegewezen_aan && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-foreground mb-3">Toegewezen aan</h3>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-ka-navy text-white flex items-center justify-center text-sm font-medium mr-3">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{taak.toegewezen_aan}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-foreground mb-3">Belangrijke data</h3>
            <div className="space-y-3 text-sm">
              {taak.deadline && (
                <div className="flex items-start">
                  <Clock className="w-4 h-4 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Deadline</p>
                    <p className="text-muted-foreground">
                      {formatDate(taak.deadline, currentUser?.language || 'nl')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
