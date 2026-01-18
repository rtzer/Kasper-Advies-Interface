import { useParams, Link } from 'react-router-dom';
import { useOpdracht } from '@/lib/api/opdrachten';
import { CheckCircle, Circle, Clock, AlertCircle, Send, ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { useDeviceChecks } from '@/hooks/useBreakpoint';

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: opdracht, isLoading } = useOpdracht(id || '');
  const { isMobile } = useDeviceChecks();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Niet gestart':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'In uitvoering':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Wacht op klant':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Controle':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Afgerond':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Ingediend':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

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

  if (!opdracht) {
    return (
      <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto">
        <div className="text-center py-8 xs:py-10 sm:py-12">
          <h2 className={`${responsiveHeading.h3} mb-2`}>Opdracht niet gevonden</h2>
          <p className={`${responsiveBody.base} mb-3 xs:mb-4`}>De opgevraagde opdracht bestaat niet.</p>
          <Link to="/app/assignments">
            <Button className="h-9 xs:h-10">Terug naar opdrachten</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-xl mx-auto">
      <Link to="/app/assignments" className="inline-flex items-center text-xs xs:text-sm text-muted-foreground hover:text-foreground mb-3 xs:mb-4">
        <ArrowLeft className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
        Terug naar opdrachten
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 mb-3 xs:mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 xs:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 mb-2">
              <Badge variant="outline" className="text-[10px] xs:text-xs px-1.5 xs:px-2">
                {opdracht.type_opdracht}
              </Badge>
              <Badge className={`${getStatusColor(opdracht.status)} text-[10px] xs:text-xs px-1.5 xs:px-2`}>
                {opdracht.status}
              </Badge>
            </div>
            <h1 className={`${responsiveHeading.h3} mb-1 xs:mb-2`}>
              {opdracht.opdracht_naam}
            </h1>
            <p className={`${responsiveBody.small} flex items-center`}>
              <Clock className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2 flex-shrink-0" />
              Deadline: {new Date(opdracht.deadline).toLocaleDateString('nl-NL', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="flex flex-col xs:flex-row gap-1.5 xs:gap-2 w-full lg:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 xs:h-9 text-xs xs:text-sm w-full xs:w-auto"
            >
              <Send className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
              <span className="xs:inline">{isMobile ? 'Herinnering' : 'Herinnering versturen'}</span>
            </Button>
            <Button 
              className="bg-ka-green hover:bg-ka-green/90 h-8 xs:h-9 text-xs xs:text-sm w-full xs:w-auto" 
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
              Opdracht Details
            </h2>

            <div className="space-y-3 xs:space-y-4">
              <div>
                <h3 className={`${responsiveBody.base} font-medium mb-1 xs:mb-2`}>Type opdracht</h3>
                <p className={responsiveBody.small}>{opdracht.type_opdracht}</p>
              </div>

              <div>
                <h3 className={`${responsiveBody.base} font-medium mb-1 xs:mb-2`}>Status</h3>
                <p className={responsiveBody.small}>{opdracht.status}</p>
              </div>

              {opdracht.boekjaar_periode && (
                <div>
                  <h3 className={`${responsiveBody.base} font-medium mb-1 xs:mb-2`}>Periode</h3>
                  <p className={responsiveBody.small}>{opdracht.boekjaar_periode}</p>
                </div>
              )}

              {opdracht.gefactureerd_bedrag && (
                <div>
                  <h3 className={`${responsiveBody.base} font-medium mb-1 xs:mb-2`}>Bedrag gefactureerd</h3>
                  <p className={responsiveBody.small}>
                    € {opdracht.gefactureerd_bedrag.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}

              {opdracht.beschrijving && (
                <div>
                  <h3 className={`${responsiveBody.base} font-medium mb-1 xs:mb-2`}>Beschrijving</h3>
                  <p className={responsiveBody.small}>{opdracht.beschrijving}</p>
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
                to={`/app/clients/${opdracht.klant_id}`}
                className="font-medium text-foreground hover:underline block truncate"
              >
                {opdracht.klant_naam}
              </Link>
              <Button variant="outline" size="sm" className="w-full mt-2 xs:mt-3 h-8 xs:h-9 text-xs">
                <Phone className="w-3 h-3 xs:w-4 xs:h-4 mr-1.5" />
                Contact opnemen
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>Verantwoordelijk</h3>
            <div className="flex items-center">
              <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-ka-navy text-white flex items-center justify-center text-xs xs:text-sm font-medium mr-2 xs:mr-3 flex-shrink-0">
                {opdracht.verantwoordelijk?.split(' ').map(n => n[0]).join('') || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs xs:text-sm font-medium text-foreground truncate">{opdracht.verantwoordelijk}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 xs:px-4 py-3 xs:py-4">
            <h3 className={`${responsiveBody.base} font-semibold mb-2 xs:mb-3`}>Belangrijke data</h3>
            <div className="space-y-2 xs:space-y-3 text-xs xs:text-sm">
              <div className="flex items-start">
                <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-muted-foreground mr-1.5 xs:mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Deadline</p>
                  <p className="text-muted-foreground">
                    {new Date(opdracht.deadline).toLocaleDateString('nl-NL', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
