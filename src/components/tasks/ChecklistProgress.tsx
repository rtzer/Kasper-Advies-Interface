import { CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistProgressProps {
  completed: number;
  total: number;
  className?: string;
}

export function ChecklistProgress({ completed, total, className }: ChecklistProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckSquare className="w-3 h-3 text-muted-foreground" />
      <div className="flex items-center gap-1">
        <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all',
              percentage === 100 ? 'bg-ka-green' : 'bg-blue-500'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}
