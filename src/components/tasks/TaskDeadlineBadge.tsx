import { differenceInDays, format, isPast, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface TaskDeadlineBadgeProps {
  deadline: string;
  className?: string;
}

export function TaskDeadlineBadge({ deadline, className }: TaskDeadlineBadgeProps) {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const daysUntil = differenceInDays(deadlineDate, today);
  const isOverdue = isPast(deadlineDate) && daysUntil < 0;

  const getConfig = () => {
    if (isOverdue) {
      return {
        label: t('tasks.daysLate', { count: Math.abs(daysUntil) }),
        className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300',
      };
    }
    if (isToday(deadlineDate)) {
      return {
        label: t('tasks.deadlineToday'),
        className: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
      };
    }
    if (isTomorrow(deadlineDate)) {
      return {
        label: t('tasks.deadlineTomorrow'),
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
      };
    }
    if (isThisWeek(deadlineDate, { weekStartsOn: 1 })) {
      return {
        label: format(deadlineDate, 'EEEE', { locale }),
        className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
      };
    }
    return {
      label: format(deadlineDate, 'dd MMM', { locale }),
      className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300',
    };
  };

  const config = getConfig();

  return (
    <Badge variant="outline" className={cn('text-xs font-normal', config.className, className)}>
      {config.label}
    </Badge>
  );
}
