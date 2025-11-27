import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface AssignmentProgressBarProps {
  percentage: number;
  className?: string;
  showLabel?: boolean;
}

export function AssignmentProgressBar({ percentage, className, showLabel = false }: AssignmentProgressBarProps) {
  const { t } = useTranslation(['common']);
  
  const getColorClass = () => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 75) return 'bg-orange-500';
    return 'bg-ka-green';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-2', className)}>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', getColorClass())}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            {showLabel && (
              <span className="text-xs text-muted-foreground min-w-[32px]">
                {percentage}%
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('assignments.progress')}: {percentage}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
