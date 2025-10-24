import { useState } from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Taak {
  id: string;
  titel: string;
  status: 'Te doen' | 'In uitvoering' | 'Afgerond';
  priority: 'Hoog' | 'Normaal' | 'Laag';
  deadline: string;
  toegewezen: string;
  gerelateerde_opdracht: string | null;
}

// Mock data
const mockTaken: Taak[] = [
  {
    id: 't1',
    titel: 'Aanvullende stukken opvragen IB aangifte',
    status: 'Te doen',
    priority: 'Hoog',
    deadline: '2024-10-28',
    toegewezen: 'Harm-Jan Kaspers',
    gerelateerde_opdracht: 'IB Aangifte 2023',
  },
  {
    id: 't2',
    titel: 'Beoordelen balans Q3',
    status: 'In uitvoering',
    priority: 'Normaal',
    deadline: '2024-11-05',
    toegewezen: 'Jan Jansen',
    gerelateerde_opdracht: 'Jaarrekening 2024',
  },
  {
    id: 't3',
    titel: 'Followup bellen na BTW aangifte',
    status: 'Te doen',
    priority: 'Laag',
    deadline: '2024-11-10',
    toegewezen: 'Harm-Jan Kaspers',
    gerelateerde_opdracht: null,
  },
  {
    id: 't4',
    titel: 'Factuur versturen Q2',
    status: 'Afgerond',
    priority: 'Normaal',
    deadline: '2024-10-15',
    toegewezen: 'Linda Prins',
    gerelateerde_opdracht: 'BTW Aangifte Q2 2024',
  },
];

export default function ClientTasks({ klantId }: { klantId: string }) {
  const [taken] = useState<Taak[]>(mockTaken);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Te doen': true,
    'In uitvoering': true,
    'Afgerond': false,
  });

  const toggleSection = (status: string) => {
    setExpandedSections(prev => ({ ...prev, [status]: !prev[status] }));
  };

  const takenByStatus = {
    'Te doen': taken.filter(t => t.status === 'Te doen'),
    'In uitvoering': taken.filter(t => t.status === 'In uitvoering'),
    'Afgerond': taken.filter(t => t.status === 'Afgerond'),
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return 'text-red-600 dark:text-red-400';
    if (days <= 3) return 'text-orange-600 dark:text-orange-400';
    if (days <= 7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-ka-gray-600 dark:text-gray-400';
  };

  const getPriorityVariant = (priority: string) => {
    if (priority === 'Hoog') return 'destructive';
    if (priority === 'Normaal') return 'default';
    return 'secondary';
  };

  if (taken.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-ka-green/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-ka-green" />
          </div>
          <div>
            <h3 className="font-semibold text-ka-navy dark:text-white mb-2">Geen openstaande taken</h3>
            <p className="text-sm text-ka-gray-600 dark:text-gray-400">
              Alle taken voor deze klant zijn afgerond! 🎉
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(takenByStatus).map(([status, taskList]) => (
        <div key={status}>
          <button
            onClick={() => toggleSection(status)}
            className="flex items-center justify-between w-full p-3 bg-ka-gray-50 dark:bg-gray-800 rounded-lg hover:bg-ka-gray-100 dark:hover:bg-gray-700 transition-colors mb-2"
          >
            <div className="flex items-center space-x-3">
              {expandedSections[status] ? (
                <ChevronDown className="w-5 h-5 text-ka-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-ka-gray-500" />
              )}
              <h3 className="font-semibold text-ka-navy dark:text-white">{status}</h3>
              <Badge variant="outline">{taskList.length}</Badge>
            </div>
          </button>

          {expandedSections[status] && (
            <div className="space-y-3">
              {taskList.map((taak) => {
                const daysUntil = getDaysUntilDeadline(taak.deadline);
                
                return (
                  <Card
                    key={taak.id}
                    className={cn(
                      "p-4 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] border-2 border-transparent hover:border-ka-green",
                      taak.status === 'Afgerond' && 'opacity-60'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Checkbox
                          checked={taak.status === 'Afgerond'}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className={cn(
                            "font-medium text-ka-navy dark:text-white mb-2",
                            taak.status === 'Afgerond' && 'line-through'
                          )}>
                            {taak.titel}
                          </h4>
                          
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Badge variant={getPriorityVariant(taak.priority)} className="text-xs">
                              {taak.priority}
                            </Badge>
                            
                            <div className={cn("flex items-center space-x-1", getDeadlineColor(taak.deadline))}>
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">
                                {daysUntil < 0 ? `${Math.abs(daysUntil)} dagen te laat` :
                                 daysUntil === 0 ? 'Vandaag' :
                                 daysUntil === 1 ? 'Morgen' :
                                 `Nog ${daysUntil} dagen`}
                              </span>
                            </div>
                            
                            <span className="text-xs text-ka-gray-500 dark:text-gray-400">
                              • {taak.toegewezen}
                            </span>
                          </div>

                          {taak.gerelateerde_opdracht && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                📋 {taak.gerelateerde_opdracht}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {daysUntil < 0 && taak.status !== 'Afgerond' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
