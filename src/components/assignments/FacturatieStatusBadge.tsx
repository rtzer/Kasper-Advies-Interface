import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Receipt, Check, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type FacturatieStatus = 'niet_gefactureerd' | 'gefactureerd' | 'betaald';

interface FacturatieStatusBadgeProps {
  status: FacturatieStatus;
  className?: string;
}

const statusConfig: Record<FacturatieStatus, { icon: typeof Receipt; bgColor: string; textColor: string; labelKey: string }> = {
  'niet_gefactureerd': { 
    icon: Clock, 
    bgColor: 'bg-gray-100 dark:bg-gray-800', 
    textColor: 'text-gray-600 dark:text-gray-400',
    labelKey: 'assignments.notInvoiced',
  },
  'gefactureerd': { 
    icon: Receipt, 
    bgColor: 'bg-orange-100 dark:bg-orange-900/30', 
    textColor: 'text-orange-600 dark:text-orange-400',
    labelKey: 'assignments.invoiced',
  },
  'betaald': { 
    icon: Check, 
    bgColor: 'bg-green-100 dark:bg-green-900/30', 
    textColor: 'text-green-600 dark:text-green-400',
    labelKey: 'assignments.paid',
  },
};

export function FacturatieStatusBadge({ status, className }: FacturatieStatusBadgeProps) {
  const { t } = useTranslation(['common']);
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'border-0 font-medium',
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <Icon className="w-3 h-3 mr-1" />
      {t(config.labelKey)}
    </Badge>
  );
}
