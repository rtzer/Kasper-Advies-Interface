import { differenceInDays, format, isPast } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DeadlineIndicatorProps {
  deadline: string;
  showIcon?: boolean;
  className?: string;
}

export function DeadlineIndicator({ deadline, showIcon = true, className }: DeadlineIndicatorProps) {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const daysUntil = differenceInDays(deadlineDate, today);
  const isOverdue = isPast(deadlineDate) && daysUntil !== 0;

  const getLabel = () => {
    if (isOverdue || daysUntil < 0) {
      const daysLate = Math.abs(daysUntil);
      return t('assignments.daysLate', { count: daysLate });
    }
    if (daysUntil === 0) {
      return t('assignments.today');
    }
    if (daysUntil === 1) {
      return t('assignments.tomorrow');
    }
    if (daysUntil <= 7) {
      return t('assignments.daysLeft', { count: daysUntil });
    }
    return format(deadlineDate, 'dd MMM yyyy', { locale });
  };

  const getColorClass = () => {
    if (isOverdue || daysUntil < 0) {
      return 'text-red-600 dark:text-red-400';
    }
    if (daysUntil <= 3) {
      return 'text-orange-600 dark:text-orange-400';
    }
    if (daysUntil <= 7) {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    return 'text-muted-foreground';
  };

  const Icon = isOverdue ? AlertTriangle : Calendar;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('flex items-center gap-1 text-sm', getColorClass(), className)}>
            {showIcon && <Icon className="w-4 h-4" />}
            <span>{getLabel()}</span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{format(new Date(deadline), 'EEEE, dd MMMM yyyy', { locale })}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
