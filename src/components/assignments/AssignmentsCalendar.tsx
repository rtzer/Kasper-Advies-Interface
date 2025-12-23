import { useState } from 'react';
import { useOpdrachten } from '@/lib/api/opdrachten';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, isSameDay } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Clock, User, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OpdrachtTypeBadge } from './OpdrachtTypeBadge';
import { DeadlineIndicator } from './DeadlineIndicator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AssignmentsCalendarProps {
  filterType?: string;
  filterVerantwoordelijke?: string;
  onlyMine?: boolean;
  currentUserId?: string;
}

export function AssignmentsCalendar({
  filterType,
  filterVerantwoordelijke,
  onlyMine,
  currentUserId,
}: AssignmentsCalendarProps) {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language === 'nl' ? nl : enUS;
  const { data: opdrachtenData, isLoading } = useOpdrachten();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const opdrachten = opdrachtenData?.results || [];

  // Apply filters
  let filteredOpdrachten = [...opdrachten];
  
  if (filterType && filterType !== 'all') {
    filteredOpdrachten = filteredOpdrachten.filter(o => o.type_opdracht === filterType);
  }
  if (filterVerantwoordelijke && filterVerantwoordelijke !== 'all') {
    filteredOpdrachten = filteredOpdrachten.filter(o => o.verantwoordelijk === filterVerantwoordelijke);
  }
  if (onlyMine && currentUserId) {
    filteredOpdrachten = filteredOpdrachten.filter(o => o.user_ids?.includes(currentUserId));
  }

  const opdrachtenOnDate = filteredOpdrachten.filter((o) => {
    if (!selectedDate || !o.deadline) return false;
    return isSameDay(new Date(o.deadline), selectedDate);
  });

  const datesWithOpdrachten = filteredOpdrachten
    .filter(o => o.deadline)
    .map((o) => new Date(o.deadline));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[350px] w-full" />
        </div>
        <div>
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card rounded-lg shadow-sm p-6">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={locale}
          className="rounded-md border pointer-events-auto"
          modifiers={{
            hasOpdrachten: datesWithOpdrachten,
          }}
          modifiersClassNames={{
            hasOpdrachten: 'bg-ka-green/20 text-ka-green font-bold hover:bg-ka-green/30',
          }}
        />
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-foreground mb-4">
          {selectedDate 
            ? format(selectedDate, 'EEEE, dd MMMM yyyy', { locale }) 
            : t('assignments.selectDate')}
        </h3>

        {opdrachtenOnDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('assignments.noAssignmentsOnDate')}
          </p>
        ) : (
          <TooltipProvider>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {opdrachtenOnDate.map((opdracht) => (
                <Tooltip key={opdracht.id}>
                  <TooltipTrigger asChild>
                    <Link to={`/assignments/${opdracht.id}`}>
                      <div className="border rounded-lg p-3 hover:bg-muted/50 hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <OpdrachtTypeBadge type={opdracht.type_opdracht} className="text-xs" />
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-xs',
                              opdracht.status === 'Afgerond' && 'bg-ka-green/10 text-ka-green border-ka-green/30'
                            )}
                          >
                            {opdracht.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm text-foreground mb-1">
                          {opdracht.opdracht_naam}
                        </h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {opdracht.klant_naam}
                        </p>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-medium">{opdracht.opdracht_naam}</p>
                      <div className="space-y-1 text-xs">
                        <p className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>Deadline: {format(new Date(opdracht.deadline), 'dd-MM-yyyy')}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>{opdracht.klant_naam}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Briefcase className="w-3 h-3" />
                          <span>{opdracht.verantwoordelijk}</span>
                        </p>
                        {opdracht.voortgang_percentage !== undefined && (
                          <p>{t('assignments.progress')}: {opdracht.voortgang_percentage}%</p>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
