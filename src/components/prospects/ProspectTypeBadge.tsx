import { Building2, User, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProspectType } from '@/types';

interface ProspectTypeBadgeProps {
  type: ProspectType;
  className?: string;
}

const typeConfig: Record<ProspectType, { 
  icon: React.ElementType; 
  colorClass: string;
  bgClass: string;
}> = {
  'MKB': { 
    icon: Building2, 
    colorClass: 'text-ka-navy dark:text-blue-300',
    bgClass: 'bg-ka-navy/10 dark:bg-blue-900/30 border-ka-navy/20 dark:border-blue-800'
  },
  'ZZP': { 
    icon: Briefcase, 
    colorClass: 'text-amber-700 dark:text-amber-300',
    bgClass: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
  },
  'Particulier': { 
    icon: User, 
    colorClass: 'text-gray-700 dark:text-gray-300',
    bgClass: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  },
};

export function ProspectTypeBadge({ type, className }: ProspectTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'font-medium',
        config.colorClass,
        config.bgClass,
        className
      )}
    >
      <Icon className="w-3 h-3 mr-1" />
      {type}
    </Badge>
  );
}
