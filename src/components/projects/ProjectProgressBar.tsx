import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

interface ProjectProgressBarProps {
  tasksTotal?: number;
  tasksCompleted?: number;
  percentage?: number;
  showLabel?: boolean;
  size?: 'sm' | 'default';
}

export default function ProjectProgressBar({
  tasksTotal,
  tasksCompleted,
  percentage,
  showLabel = true,
  size = 'default',
}: ProjectProgressBarProps) {
  const { t } = useTranslation();
  
  // Calculate percentage from tasks if available
  const calculatedPercentage = tasksTotal && tasksTotal > 0
    ? Math.round((tasksCompleted || 0) / tasksTotal * 100)
    : percentage || 0;

  const getProgressColor = (pct: number) => {
    if (pct < 25) return 'bg-red-500';
    if (pct < 50) return 'bg-orange-500';
    if (pct < 75) return 'bg-yellow-500';
    return 'bg-ka-green';
  };

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>{t('projects.progress', 'Voortgang')}</span>
          <span>
            {tasksTotal && tasksTotal > 0 ? (
              `${tasksCompleted || 0}/${tasksTotal} ${t('projects.tasks', 'taken')}`
            ) : (
              `${calculatedPercentage}%`
            )}
          </span>
        </div>
      )}
      <div className={`w-full bg-muted rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-300 ${getProgressColor(calculatedPercentage)}`}
          style={{ width: `${calculatedPercentage}%` }}
        />
      </div>
    </div>
  );
}
