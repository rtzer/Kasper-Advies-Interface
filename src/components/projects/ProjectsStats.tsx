import { useBaserowProjects } from '@/lib/api/projects';
import { Folder, Calendar, AlertTriangle, User, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/userStore';
import { differenceInDays, startOfMonth, endOfMonth, isWithinInterval, parseISO, startOfQuarter, endOfQuarter } from 'date-fns';

export default function ProjectsStats() {
  const { t } = useTranslation();
  const { data: projects, isLoading } = useBaserowProjects();
  const { currentUser } = useUserStore();

  if (isLoading || !projects) {
    return (
      <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-20 xs:h-24" />
        ))}
      </div>
    );
  }

  // Calculate stats from Baserow data
  const activeProjects = projects.filter(p =>
    p.status?.value === 'Actief'
  ).length;

  const deadlineThisMonth = projects.filter(p => {
    if (!p.planned_end_date || p.status?.value === 'Afgerond') return false;
    const deadline = parseISO(p.planned_end_date);
    const now = new Date();
    return isWithinInterval(deadline, {
      start: startOfMonth(now),
      end: endOfMonth(now),
    });
  }).length;

  const overdueProjects = projects.filter(p => {
    if (!p.planned_end_date || p.status?.value === 'Afgerond') return false;
    const deadline = parseISO(p.planned_end_date);
    return differenceInDays(deadline, new Date()) < 0;
  }).length;

  const myProjects = projects.filter(p => {
    const projectLead = p.link_to_user_project_lead?.[0]?.value;
    return projectLead && projectLead.includes(currentUser?.user_id || '') && p.status?.value !== 'Afgerond';
  }).length;

  const completedThisQuarter = projects.filter(p => {
    if (p.status?.value !== 'Afgerond' || !p.actual_end_date) return false;
    const completedDate = parseISO(p.actual_end_date);
    const now = new Date();
    return isWithinInterval(completedDate, {
      start: startOfQuarter(now),
      end: endOfQuarter(now),
    });
  }).length;

  const statItems = [
    {
      label: t('projects.stats.active'),
      value: activeProjects,
      icon: Folder,
      iconBg: 'bg-ka-navy/10',
      iconColor: 'text-ka-navy',
    },
    {
      label: t('projects.stats.deadlineMonth'),
      value: deadlineThisMonth,
      icon: Calendar,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      label: t('projects.stats.overdue'),
      value: overdueProjects,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      label: t('projects.stats.myProjects'),
      value: myProjects,
      icon: User,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: t('projects.stats.completedQuarter'),
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
