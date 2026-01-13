import { useParams, Link } from 'react-router-dom';
import { useTaak } from '@/lib/api/taken';
import { CheckCircle, Circle, Clock, AlertCircle, ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { useDeviceChecks } from '@/hooks/useBreakpoint';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: taak, isLoading } = useTaak(id || '');
  const { currentUser } = useUserStore();
  const { isMobile } = useDeviceChecks();

  if (isLoading) {
    return (
      <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto space-y-3 xs:space-y-4 sm:space-y-6">
        <Skeleton className="h-32 xs:h-40 sm:h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-80 xs:h-96" />
          </div>
          <Skeleton className="h-80 xs:h-96" />
        </div>
      </div>
    );
  }

  if (!taak) {
    return (
      <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto">
        <div className="text-center py-8 xs:py-10 sm:py-12">
          <h2 className={`${responsiveHeading.h3} mb-2`}>Taak niet gevonden</h2>
          <p className={`${responsiveBody.base} mb-3 xs:mb-4`}>De opgevraagde taak bestaat niet.</p>
          <Link to="/app/tasks">
            <Button className="h-9 xs:h-10">Terug naar taken</Button>
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
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto">
      <Link to="/app/tasks" className="inline-flex items-center text-xs xs:text-sm text-muted-foreground hover:text-foreground mb-3 xs:mb-4">
        <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
        Terug naar taken
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 mb-3 xs:mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 xs:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 mb-2">
              <Badge className={`${getStatusColor(taak.status)} text-[10px] xs:text-xs px-1.5 xs:px-2`}>
                {taak.status}
              </Badge>
              <Badge variant={getPriorityColor(taak.priority)} className="text-[10px] xs:text-xs px-1.5 xs:px-2">
                {taak.priority}
              </Badge>
              {taak.blocked_reason && (
                <Badge variant="destructive" className="text-[10px] xs:text-xs px-1.5 xs:px-2">
                  <AlertCircle className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-1" />
                  Geblokkeerd
                </Badge>
              )}
            </div>
            <h1 className={`${responsiveHeading.h3} mb-1 xs:mb-2`}>
              {taak.taak_omschrijving}
            </h1>
            {taak.deadline && (
              <p className={`${responsiveBody.small} flex items-center`}>
                <Clock className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2 flex-shrink-0" />
                Deadline: {formatDate(taak.deadline, currentUser?.language || 'nl')}
              </p>
            )}
          </div>

          <div className="flex gap-1.5 xs:gap-2 w-full lg:w-auto">
            <Button 
              className="bg-ka-green hover:bg-ka-green/90 h-8 xs:h-9 text-xs xs:text-sm w-full lg:w-auto" 
              size="sm"
            >
              Status updaten
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6">
            <h2 className={`${responsiveHeading.h4} mb-3 xs:mb-4`}>
              Taak Details
            </h2>

            <div className="space-y-3 xs:space-y-4">
              <div>
                <h3 className={`${responsiveBody.base} font-medium mb-1 xs:mb-2`}>Beschrijving</h3>
                <p className={responsiveBody.small}>
                  {taak.taak_omschrijving}
                </p>
              </div>

              {taak.blocked_reason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 xs:px-4 py-3 xs:py-4">
                  <h3 className={`${responsiveBody.base} font-semibold mb-2 flex items-center`}>
                    <AlertCircle className="w-4 h-4 xs:w-5 xs:h-5 text-red-600 mr-1.5 xs:mr-2 flex-shrink-0" />
                    <span>Taak geblokkeerd</span>
                  </h3>
                  <p className="text-xs xs:text-sm text-red-800 dark:text-red-300">
                    {taak.blocked_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 xs:space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>Klant</h3>
            <div className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm">
              <Link 
                to={`/app/clients/${taak.klant_id}`}
                className="font-medium text-foreground hover:underline block truncate"
              >
                {taak.klant_naam}
              </Link>
              <Button variant="outline" size="sm" className="w-full mt-2 xs:mt-3 h-8 xs:h-9 text-xs">
                <Phone className="w-3 h-3 xs:w-4 xs:h-4 mr-1.5" />
                Contact opnemen
              </Button>
            </div>
          </div>

          {taak.toegewezen_aan && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
              <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>Toegewezen aan</h3>
              <div className="flex items-center">
                <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-ka-navy text-white flex items-center justify-center text-xs xs:text-sm font-medium mr-2 xs:mr-3 flex-shrink-0">
                  <User className="w-3 h-3 xs:w-4 xs:h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs xs:text-sm font-medium text-foreground truncate">{taak.toegewezen_aan}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>Belangrijke data</h3>
            <div className="space-y-2 xs:space-y-3 text-xs xs:text-sm">
              {taak.deadline && (
                <div className="flex items-start">
                  <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-muted-foreground mr-1.5 xs:mr-2 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
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
