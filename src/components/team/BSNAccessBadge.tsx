import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BSNAccessBadgeProps {
  className?: string;
}

export function BSNAccessBadge({ className }: BSNAccessBadgeProps) {
  const { t } = useTranslation();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              'bg-amber-50 text-amber-800 border-amber-200',
              'dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
              'gap-1',
              className
            )}
          >
            <Shield className="w-3 h-3" />
            {t('team.bsnAccess')}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('team.bsnAccessTooltip')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
