import { useParams, Link } from 'react-router-dom';
import { useOpdracht } from '@/lib/api/opdrachten';
import { CheckCircle, Circle, Clock, AlertCircle, Send, ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: opdracht, isLoading } = useOpdracht(id || '');

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

  if (!opdracht) {
    return (
      <div className="p-6 max-w-screen-xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">Opdracht niet gevonden</h2>
          <p className="text-muted-foreground mb-4">De opgevraagde opdracht bestaat niet.</p>
          <Link to="/assignments">
            <Button>Terug naar opdrachten</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <Link to="/assignments" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Terug naar opdrachten
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge variant="outline" className="text-sm">
                {opdracht.type_opdracht}
              </Badge>
              <Badge className={getStatusColor(opdracht.status)}>
                {opdracht.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {opdracht.opdracht_naam}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Deadline: {new Date(opdracht.deadline).toLocaleDateString('nl-NL', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Herinnering versturen
            </Button>
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
              Opdracht Details
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground mb-2">Type opdracht</h3>
                <p className="text-muted-foreground">{opdracht.type_opdracht}</p>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Status</h3>
                <p className="text-muted-foreground">{opdracht.status}</p>
              </div>

              {opdracht.boekjaar_periode && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Periode</h3>
                  <p className="text-muted-foreground">{opdracht.boekjaar_periode}</p>
                </div>
              )}

              {opdracht.gefactureerd_bedrag && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Bedrag gefactureerd</h3>
                  <p className="text-muted-foreground">
                    € {opdracht.gefactureerd_bedrag.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}

              {opdracht.beschrijving && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Beschrijving</h3>
                  <p className="text-muted-foreground">{opdracht.beschrijving}</p>
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
                to={`/clients/${opdracht.klant_id}`}
                className="font-medium text-foreground hover:underline block"
              >
                {opdracht.klant_naam}
              </Link>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Phone className="w-4 h-4 mr-2" />
                Contact opnemen
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-foreground mb-3">Verantwoordelijk</h3>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-ka-navy text-white flex items-center justify-center text-sm font-medium mr-3">
                {opdracht.verantwoordelijk?.split(' ').map(n => n[0]).join('') || '?'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{opdracht.verantwoordelijk}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-foreground mb-3">Belangrijke data</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <Clock className="w-4 h-4 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
                <div>
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
