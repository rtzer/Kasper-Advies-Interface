import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface HealthScoreIndicatorProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number): { ring: string; fill: string; text: string } {
  if (score <= 25) {
    return {
      ring: 'stroke-red-500',
      fill: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
    };
  } else if (score <= 50) {
    return {
      ring: 'stroke-orange-500',
      fill: 'bg-orange-500',
      text: 'text-orange-600 dark:text-orange-400',
    };
  } else if (score <= 75) {
    return {
      ring: 'stroke-yellow-500',
      fill: 'bg-yellow-500',
      text: 'text-yellow-600 dark:text-yellow-400',
    };
  } else {
    return {
      ring: 'stroke-ka-green',
      fill: 'bg-ka-green',
      text: 'text-ka-green dark:text-ka-green-light',
    };
  }
}

function getScoreLabel(score: number, t: (key: string) => string): string {
  if (score <= 25) return t('clients.health.critical');
  if (score <= 50) return t('clients.health.atRisk');
  if (score <= 75) return t('clients.health.good');
  return t('clients.health.excellent');
}

export function HealthScoreIndicator({ score, showLabel = false, size = 'md' }: HealthScoreIndicatorProps) {
  const { t } = useTranslation();
  const colors = getScoreColor(score);
  const label = getScoreLabel(score, t);
  
  const sizeMap = {
    sm: { container: 'w-8 h-8', text: 'text-[9px]', stroke: 3 },
    md: { container: 'w-10 h-10', text: 'text-xs', stroke: 3 },
    lg: { container: 'w-12 h-12', text: 'text-sm', stroke: 4 },
  };
  
  const sizeConfig = sizeMap[size];
  const radius = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`relative ${sizeConfig.container} flex items-center justify-center`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
            {/* Background circle */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth={sizeConfig.stroke}
            />
            {/* Progress circle */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              className={colors.ring}
              strokeWidth={sizeConfig.stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          {/* Percentage text */}
          <span className={`absolute ${sizeConfig.text} font-semibold ${colors.text}`}>
            {score}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div className="font-medium">{t('clients.health.title')}: {score}%</div>
          <div className="text-muted-foreground">{label}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
