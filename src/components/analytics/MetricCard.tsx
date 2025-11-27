import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'up' | 'down' | 'neutral';
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  changeLabel,
  icon: Icon,
  iconColor = 'text-blue-600',
  subtitle,
}: MetricCardProps) {
  const getChangeIcon = () => {
    if (changeType === 'up') return <TrendingUp className="w-3.5 h-3.5 xs:w-4 xs:h-4" />;
    if (changeType === 'down') return <TrendingDown className="w-3.5 h-3.5 xs:w-4 xs:h-4" />;
    return <Minus className="w-3.5 h-3.5 xs:w-4 xs:h-4" />;
  };

  const getChangeColor = () => {
    if (changeType === 'up') return 'text-green-600';
    if (changeType === 'down') return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border rounded-lg p-3 xs:p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] xs:text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">
          {title}
        </h3>
        <div className={cn('w-7 h-7 xs:w-8 xs:h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0', iconColor)}>
          <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
        </div>
      </div>
      
      <p className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground">
        {value}
      </p>
      
      {subtitle && (
        <p className="text-[10px] xs:text-xs text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}

      {change !== undefined && (
        <div className={cn('flex items-center gap-1 text-xs xs:text-sm mt-2', getChangeColor())}>
          {getChangeIcon()}
          <span className="font-medium">
            {change > 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-muted-foreground text-[10px] xs:text-xs">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
