import { useProjectStats } from '@/lib/api/projects';
import { Folder, Calendar, AlertTriangle, User, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/userStore';
import { mockProjects } from '@/lib/mockData';
import { differenceInDays, startOfMonth, endOfMonth, isWithinInterval, parseISO, startOfQuarter, endOfQuarter } from 'date-fns';

export default function ProjectsStats() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useProjectStats();
  const { currentUser } = useUserStore();

  // Calculate additional stats
  const activeProjects = mockProjects.filter(p => 
    p.status !== 'afgerond' && p.status !== 'niet-gestart'
  ).length;

  const deadlineThisMonth = mockProjects.filter(p => {
    const deadline = parseISO(p.deadline);
    const now = new Date();
    return isWithinInterval(deadline, {
      start: startOfMonth(now),
      end: endOfMonth(now),
    }) && p.status !== 'afgerond';
  }).length;

  const overdueProjects = mockProjects.filter(p => {
    const deadline = parseISO(p.deadline);
    return differenceInDays(deadline, new Date()) < 0 && p.status !== 'afgerond';
  }).length;

  const myProjects = mockProjects.filter(p => 
    p.responsible_team_member === currentUser?.naam && p.status !== 'afgerond'
  ).length;

  const completedThisQuarter = mockProjects.filter(p => {
    if (p.status !== 'afgerond') return false;
    const deadline = parseISO(p.deadline);
    const now = new Date();
    return isWithinInterval(deadline, {
      start: startOfQuarter(now),
      end: endOfQuarter(now),
    });
  }).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 xs:h-24" />
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: t('projects.stats.active', 'Actieve projecten'),
      value: activeProjects,
      icon: Folder,
      iconBg: 'bg-ka-navy/10',
      iconColor: 'text-ka-navy',
    },
    {
      label: t('projects.stats.deadlineMonth', 'Deadline deze maand'),
      value: deadlineThisMonth,
      icon: Calendar,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      label: t('projects.stats.overdue', 'Achterstallig'),
      value: overdueProjects,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      label: t('projects.stats.myProjects', 'Mijn projecten'),
      value: myProjects,
      icon: User,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: t('projects.stats.completedQuarter', 'Afgerond (kwartaal)'),
      value: completedThisQuarter,
      icon: CheckCircle,
      iconBg: 'bg-ka-green/10',
      iconColor: 'text-ka-green',
    },
  ];

  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-card rounded-lg shadow-sm p-3 xs:p-4">
          <div className="flex items-center justify-between mb-1.5 xs:mb-2">
            <span className="text-[10px] xs:text-xs text-muted-foreground truncate pr-2">
              {item.label}
            </span>
            <div className={`w-6 h-6 xs:w-8 xs:h-8 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`w-3 h-3 xs:w-4 xs:h-4 ${item.iconColor}`} />
            </div>
          </div>
          <div className="text-lg xs:text-xl sm:text-2xl font-bold text-foreground">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
