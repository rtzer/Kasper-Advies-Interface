import { formatDistanceToNow, differenceInMonths, parseISO, format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

interface LastContactIndicatorProps {
  date: string;
  clientType: 'Particulier' | 'MKB' | 'ZZP';
  className?: string;
}

export function LastContactIndicator({ date, clientType, className = '' }: LastContactIndicatorProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const parsedDate = parseISO(date);
  const monthsSinceContact = differenceInMonths(new Date(), parsedDate);
  
  // Business clients (MKB/ZZP): warning after 6 months
  // Particulier: warning after 14 months (typically annual contact)
  const warningThreshold = clientType === 'Particulier' ? 14 : 6;
  const isOverdue = monthsSinceContact >= warningThreshold;
  
  const relativeTime = formatDistanceToNow(parsedDate, { 
    addSuffix: true, 
    locale 
  });
  
  const exactDate = format(parsedDate, 'dd MMMM yyyy', { locale });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`
          inline-flex items-center gap-1 text-xs
          ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-muted-foreground'}
          ${className}
        `}>
          {isOverdue && <AlertTriangle className="w-3 h-3" />}
          {relativeTime}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div>{exactDate}</div>
          {isOverdue && (
            <div className="text-red-500 text-xs mt-1">
              {t('clients.lastContact.overdue', { months: monthsSinceContact })}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
