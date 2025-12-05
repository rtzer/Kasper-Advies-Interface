import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LastContactIndicatorProps {
  date: string; // Can be days as string (e.g., "14") or empty
  clientType: 'Particulier' | 'MKB' | 'ZZP';
  className?: string;
}

export function LastContactIndicator({ date, clientType, className = '' }: LastContactIndicatorProps) {
  const { t } = useTranslation('translation');

  // If no date provided, show dash
  if (!date) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  // Parse days from string
  const daysSinceContact = parseInt(date, 10);
  if (isNaN(daysSinceContact)) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  // Business clients (MKB/ZZP): warning after 180 days (6 months)
  // Particulier: warning after 420 days (14 months)
  const warningThresholdDays = clientType === 'Particulier' ? 420 : 180;
  const isOverdue = daysSinceContact >= warningThresholdDays;

  // Format display text - always show in days
  const getDisplayText = () => {
    if (daysSinceContact === 0) return t('clients.lastContact.today');
    if (daysSinceContact === 1) return t('clients.lastContact.oneDay');
    return t('clients.lastContact.days', { count: daysSinceContact });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`
          inline-flex items-center gap-1 text-xs
          ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-muted-foreground'}
          ${className}
        `}>
          {isOverdue && <AlertTriangle className="w-3 h-3" />}
          {getDisplayText()}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div>{t('clients.lastContact.daysSince', { count: daysSinceContact })}</div>
          {isOverdue && (
            <div className="text-red-500 text-xs mt-1">
              {t('clients.lastContact.tooLong')}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
