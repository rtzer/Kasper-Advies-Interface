import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Euro, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Opdracht {
  id: string;
  naam: string;
  type: string;
  status: 'Niet gestart' | 'In behandeling' | 'Afgerond';
  deadline: string;
  gefactureerd?: string;
  geschat?: string;
  betaald: boolean;
  voortgang: number;
  verantwoordelijk: string;
  afgerond_op?: string;
  aantal_taken?: number;
}

// Mock data
const mockOpdrachten: Opdracht[] = [
  {
    id: 'o1',
    naam: 'IB Aangifte 2023',
    type: 'IB (Inkomstenbelasting)',
    status: 'In behandeling',
    deadline: '2024-11-15',
    gefactureerd: '€450',
    betaald: false,
    voortgang: 65,
    verantwoordelijk: 'Harm-Jan Kaspers',
    aantal_taken: 3,
  },
  {
    id: 'o2',
    naam: 'Jaarrekening 2024',
    type: 'Jaarrekening',
    status: 'Niet gestart',
    deadline: '2025-02-28',
    geschat: '€1.200',
    betaald: false,
    voortgang: 0,
    verantwoordelijk: 'Linda Prins',
    aantal_taken: 0,
  },
  {
    id: 'o3',
    naam: 'BTW Aangifte Q2 2024',
    type: 'BTW-aangifte',
    status: 'Afgerond',
    deadline: '2024-08-31',
    gefactureerd: '€275',
    betaald: true,
    voortgang: 100,
    verantwoordelijk: 'Harm-Jan Kaspers',
    afgerond_op: '2024-08-20',
    aantal_taken: 2,
  },
  {
    id: 'o4',
    naam: 'Adviesgesprek Q4',
    type: 'Advies',
    status: 'In behandeling',
    deadline: '2024-12-15',
    geschat: '€500',
    betaald: false,
    voortgang: 30,
    verantwoordelijk: 'Harm-Jan Kaspers',
    aantal_taken: 1,
  },
];

export default function ClientAssignments({ klantId }: { klantId: string }) {
  const [opdrachten] = useState<Opdracht[]>(mockOpdrachten);

  const getStatusColor = (status: string) => {
    if (status === 'Afgerond') return 'bg-ka-green text-white';
    if (status === 'In behandeling') return 'bg-ka-warning text-white';
    return 'bg-ka-gray-500 text-white';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Afgerond') return <CheckCircle className="w-4 h-4" />;
    if (status === 'In behandeling') return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (deadline: string, status: string) => {
    if (status === 'Afgerond') return 'text-ka-gray-500 dark:text-gray-400';
    
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return 'text-red-600 dark:text-red-400';
    if (days <= 7) return 'text-orange-600 dark:text-orange-400';
    return 'text-ka-gray-600 dark:text-gray-400';
  };

  // Sort: active first, then by deadline
  const sortedOpdrachten = [...opdrachten].sort((a, b) => {
    if (a.status === 'Afgerond' && b.status !== 'Afgerond') return 1;
    if (a.status !== 'Afgerond' && b.status === 'Afgerond') return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  if (opdrachten.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-ka-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-ka-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-ka-navy dark:text-white mb-2">Geen opdrachten</h3>
            <p className="text-sm text-ka-gray-600 dark:text-gray-400">
              Er zijn nog geen opdrachten voor deze klant
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-ka-gray-600 dark:text-gray-400">
            <span className="font-semibold text-ka-navy dark:text-white">
              {opdrachten.filter(o => o.status !== 'Afgerond').length}
            </span> actief
          </div>
          <div className="text-sm text-ka-gray-600 dark:text-gray-400">
            <span className="font-semibold text-ka-navy dark:text-white">
              {opdrachten.filter(o => o.status === 'Afgerond').length}
            </span> afgerond
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedOpdrachten.map((opdracht) => {
          const daysUntil = getDaysUntilDeadline(opdracht.deadline);
          
          return (
            <Link key={opdracht.id} to={`/projects/${opdracht.id}`}>
              <Card className="p-6 hover:shadow-lg transition-all hover:scale-[1.01] border-2 border-transparent hover:border-ka-green cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-ka-navy dark:text-white">
                        {opdracht.naam}
                      </h3>
                      <Badge className={cn("flex items-center space-x-1", getStatusColor(opdracht.status))}>
                        {getStatusIcon(opdracht.status)}
                        <span>{opdracht.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-ka-gray-600 dark:text-gray-400">{opdracht.type}</p>
                  </div>

                  {opdracht.voortgang > 0 && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-ka-green">{opdracht.voortgang}%</div>
                      <div className="text-xs text-ka-gray-500">voortgang</div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {opdracht.voortgang > 0 && (
                  <div className="mb-4">
                    <Progress value={opdracht.voortgang} className="h-2" />
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Deadline</div>
                    <div className={cn("flex items-center space-x-1 text-sm font-medium", getDeadlineColor(opdracht.deadline, opdracht.status))}>
                      <Calendar className="w-3 h-3" />
                      <span>
                        {opdracht.status === 'Afgerond' 
                          ? new Date(opdracht.deadline).toLocaleDateString('nl-NL')
                          : daysUntil < 0 
                            ? `${Math.abs(daysUntil)} dagen te laat`
                            : daysUntil === 0 
                              ? 'Vandaag'
                              : daysUntil === 1
                                ? 'Morgen'
                                : `${daysUntil} dagen`
                        }
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Verantwoordelijk</div>
                    <div className="flex items-center space-x-1 text-sm">
                      <User className="w-3 h-3 text-ka-gray-500" />
                      <span className="font-medium text-ka-navy dark:text-white">
                        {opdracht.verantwoordelijk.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Bedrag</div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Euro className="w-3 h-3 text-ka-gray-500" />
                      <span className="font-semibold text-ka-green">
                        {opdracht.gefactureerd || opdracht.geschat}
                      </span>
                      {!opdracht.gefactureerd && opdracht.geschat && (
                        <span className="text-xs text-ka-gray-500">(schatting)</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Status</div>
                    <div className="flex items-center space-x-2">
                      {opdracht.betaald ? (
                        <Badge className="bg-ka-green text-white text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Betaald
                        </Badge>
                      ) : opdracht.gefactureerd ? (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Te betalen
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-ka-gray-200 dark:border-gray-700">
                  {opdracht.aantal_taken !== undefined && opdracht.aantal_taken > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {opdracht.aantal_taken} {opdracht.aantal_taken === 1 ? 'taak' : 'taken'}
                    </Badge>
                  )}
                  
                  {opdracht.afgerond_op && (
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400">
                      Afgerond op {new Date(opdracht.afgerond_op).toLocaleDateString('nl-NL')}
                    </div>
                  )}

                  <div className="ml-auto text-xs text-ka-green flex items-center space-x-1">
                    <span>Bekijk details</span>
                    <span>→</span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
