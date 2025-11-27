import { Badge } from '@/components/ui/badge';
import {
  FileSpreadsheet,
  Receipt,
  User,
  Building,
  Users,
  Gift,
  TrendingUp,
  Settings,
  FileText,
  Calculator,
  Briefcase,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OpdrachtType } from '@/types';

const typeConfig: Record<string, { icon: LucideIcon; bgColor: string; textColor: string }> = {
  'Jaarrekening': { icon: FileSpreadsheet, bgColor: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-700 dark:text-purple-300' },
  'BTW-aangifte': { icon: Receipt, bgColor: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-700 dark:text-blue-300' },
  'IB (Inkomstenbelasting)': { icon: User, bgColor: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-700 dark:text-green-300' },
  'Vennootschapsbelasting': { icon: Building, bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', textColor: 'text-indigo-700 dark:text-indigo-300' },
  'Loonadministratie': { icon: Users, bgColor: 'bg-cyan-100 dark:bg-cyan-900/30', textColor: 'text-cyan-700 dark:text-cyan-300' },
  'Toeslag aanvragen': { icon: Gift, bgColor: 'bg-pink-100 dark:bg-pink-900/30', textColor: 'text-pink-700 dark:text-pink-300' },
  'Groeibegeleiding': { icon: TrendingUp, bgColor: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-700 dark:text-orange-300' },
  'Procesoptimalisatie': { icon: Settings, bgColor: 'bg-slate-100 dark:bg-slate-900/30', textColor: 'text-slate-700 dark:text-slate-300' },
  'Bezwaarschrift': { icon: FileText, bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-700 dark:text-red-300' },
  'Schenking/Erfenis': { icon: Calculator, bgColor: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-700 dark:text-amber-300' },
  'Startersbegeleiding': { icon: TrendingUp, bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', textColor: 'text-emerald-700 dark:text-emerald-300' },
  'Workflow analyse': { icon: Settings, bgColor: 'bg-teal-100 dark:bg-teal-900/30', textColor: 'text-teal-700 dark:text-teal-300' },
  'Groeiplan': { icon: TrendingUp, bgColor: 'bg-lime-100 dark:bg-lime-900/30', textColor: 'text-lime-700 dark:text-lime-300' },
  'Financieel advies': { icon: Briefcase, bgColor: 'bg-violet-100 dark:bg-violet-900/30', textColor: 'text-violet-700 dark:text-violet-300' },
};

interface OpdrachtTypeBadgeProps {
  type: OpdrachtType;
  showIcon?: boolean;
  className?: string;
}

export function OpdrachtTypeBadge({ type, showIcon = true, className }: OpdrachtTypeBadgeProps) {
  const config = typeConfig[type] || { icon: Briefcase, bgColor: 'bg-gray-100 dark:bg-gray-800', textColor: 'text-gray-700 dark:text-gray-300' };
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
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {type}
    </Badge>
  );
}
