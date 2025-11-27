import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  Owner: {
    label: 'Owner',
    className: 'bg-ka-green/20 text-ka-green border-ka-green/30',
  },
  Admin: {
    label: 'Admin',
    className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  },
  Employee: {
    label: 'Medewerker',
    className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role];
  
  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
