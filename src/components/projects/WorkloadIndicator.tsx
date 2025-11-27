import { Gauge, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface WorkloadIndicatorProps {
  projectCount: number;
  taskCount: number;
  variant?: 'badge' | 'meter' | 'compact';
}

export default function WorkloadIndicator({
  projectCount,
  taskCount,
  variant = 'badge',
}: WorkloadIndicatorProps) {
  const { t } = useTranslation();
  
  // Determine workload level
  const getWorkloadLevel = (projects: number, tasks: number) => {
    if (projects > 10 || tasks > 15) {
      return {
        level: 'overloaded',
        label: t('projects.workload.overloaded', 'Overbelast'),
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
        meterColor: 'bg-red-500',
        percentage: 100,
      };
    }
    if (projects > 7 || tasks > 12) {
      return {
        level: 'high',
        label: t('projects.workload.high', 'Hoog'),
        color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
        meterColor: 'bg-orange-500',
        percentage: 75,
      };
    }
    if (projects > 4 || tasks > 8) {
      return {
        level: 'normal',
        label: t('projects.workload.normal', 'Normaal'),
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
        meterColor: 'bg-yellow-500',
        percentage: 50,
      };
    }
    return {
      level: 'low',
      label: t('projects.workload.low', 'Laag'),
      color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
      meterColor: 'bg-green-500',
      percentage: 25,
    };
  };

  const workload = getWorkloadLevel(projectCount, taskCount);

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`w-2.5 h-2.5 rounded-full ${workload.meterColor}`} />
          </TooltipTrigger>
          <TooltipContent>
            <p>{workload.label}</p>
            <p className="text-xs text-muted-foreground">
              {projectCount} {t('projects.projects', 'projecten')}, {taskCount} {t('projects.tasks', 'taken')}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'meter') {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t('projects.workload.label', 'Belasting')}</span>
          <span className={workload.level === 'overloaded' ? 'text-red-600 font-medium' : ''}>
            {workload.label}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${workload.meterColor}`}
            style={{ width: `${workload.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{projectCount} {t('projects.projects', 'projecten')}</span>
          <span>{taskCount} {t('projects.tasks', 'taken')}</span>
        </div>
      </div>
    );
  }

  return (
    <Badge variant="outline" className={`${workload.color} text-xs`}>
      {workload.level === 'overloaded' && <AlertTriangle className="w-3 h-3 mr-1" />}
      {workload.level !== 'overloaded' && <Gauge className="w-3 h-3 mr-1" />}
      {workload.label}
    </Badge>
  );
}
