import { Sparkles, Phone, CheckCircle, FileText, Trophy, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProspectStatus } from '@/types';

interface ProspectStatusBadgeProps {
  status: ProspectStatus;
  className?: string;
}

const statusConfig: Record<ProspectStatus, { 
  icon: React.ElementType; 
  colorClass: string;
  bgClass: string;
}> = {
  'Nieuw': { 
    icon: Sparkles, 
    colorClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800'
  },
  'Contact gehad': { 
    icon: Phone, 
    colorClass: 'text-cyan-700 dark:text-cyan-300',
    bgClass: 'bg-cyan-100 dark:bg-cyan-900/50 border-cyan-200 dark:border-cyan-800'
  },
  'Gekwalificeerd': { 
    icon: CheckCircle, 
    colorClass: 'text-orange-700 dark:text-orange-300',
    bgClass: 'bg-orange-100 dark:bg-orange-900/50 border-orange-200 dark:border-orange-800'
  },
  'Offerte': { 
    icon: FileText, 
    colorClass: 'text-purple-700 dark:text-purple-300',
    bgClass: 'bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800'
  },
  'Gewonnen': { 
    icon: Trophy, 
    colorClass: 'text-ka-green dark:text-ka-green',
    bgClass: 'bg-ka-green/10 dark:bg-ka-green/20 border-ka-green/30'
  },
  'Verloren': { 
    icon: X, 
    colorClass: 'text-gray-600 dark:text-gray-400',
    bgClass: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  },
};

export function ProspectStatusBadge({ status, className }: ProspectStatusBadgeProps) {
  const config = statusConfig[status];
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
      {status}
    </Badge>
  );
}
