import { Badge } from '@/components/ui/badge';
import { LifecycleStage } from '@/types';
import { Rocket, CheckCircle, AlertTriangle, UserX, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LifecycleBadgeProps {
  stage: LifecycleStage;
  showIcon?: boolean;
  className?: string;
}

const stageConfig: Record<LifecycleStage, {
  colorClass: string;
  bgClass: string;
  icon: typeof Rocket;
  labelKey: string;
}> = {
  'Onboarding': {
    colorClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800',
    icon: Rocket,
    labelKey: 'clients.lifecycle.onboarding',
  },
  'Actief': {
    colorClass: 'text-ka-green dark:text-ka-green-light',
    bgClass: 'bg-ka-green/10 border-ka-green/30',
    icon: CheckCircle,
    labelKey: 'clients.lifecycle.active',
  },
  'At-risk': {
    colorClass: 'text-orange-700 dark:text-orange-300',
    bgClass: 'bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800',
    icon: AlertTriangle,
    labelKey: 'clients.lifecycle.atRisk',
  },
  'Churned': {
    colorClass: 'text-gray-600 dark:text-gray-400',
    bgClass: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    icon: UserX,
    labelKey: 'clients.lifecycle.churned',
  },
  'Reactivated': {
    colorClass: 'text-purple-700 dark:text-purple-300',
    bgClass: 'bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800',
    icon: RefreshCw,
    labelKey: 'clients.lifecycle.reactivated',
  },
};

export function LifecycleBadge({ stage, showIcon = true, className = '' }: LifecycleBadgeProps) {
  const { t } = useTranslation('translation');
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.bgClass} ${config.colorClass} text-[10px] xs:text-xs px-1.5 py-0.5 ${className}`}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {t(config.labelKey)}
    </Badge>
  );
}
