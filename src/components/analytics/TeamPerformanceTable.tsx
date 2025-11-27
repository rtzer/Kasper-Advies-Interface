import { TeamMemberPerformance } from '@/hooks/useAnalyticsData';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TeamPerformanceTableProps {
  data: TeamMemberPerformance[];
}

type SortKey = 'interactions' | 'clients' | 'avgResponseTime' | 'tasksCompleted';

export default function TeamPerformanceTable({ data }: TeamPerformanceTableProps) {
  const { t } = useTranslation();
  const [sortKey, setSortKey] = useState<SortKey>('interactions');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    
    // Handle string comparison for avgResponseTime
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
    }
    
    const multiplier = sortAsc ? 1 : -1;
    return (Number(aVal) - Number(bVal)) * multiplier;
  });

  const SortableHeader = ({ children, sortKeyName }: { children: React.ReactNode; sortKeyName: SortKey }) => (
    <button
      onClick={() => handleSort(sortKeyName)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className={`w-3 h-3 ${sortKey === sortKeyName ? 'text-foreground' : 'text-muted-foreground/50'}`} />
    </button>
  );

  return (
    <div className="bg-card border rounded-lg p-4 xs:p-6 shadow-sm">
      <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-foreground mb-4">
        {t('analytics.teamPerformance', 'Team Performance')}
      </h3>

      <div className="overflow-x-auto -mx-4 xs:-mx-6 px-4 xs:px-6">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-[10px] xs:text-xs text-muted-foreground border-b">
              <th className="text-left py-2 xs:py-3 font-medium">
                {t('analytics.teamMember', 'Medewerker')}
              </th>
              <th className="text-right py-2 xs:py-3 font-medium">
                <SortableHeader sortKeyName="interactions">
                  {t('analytics.interactions', 'Interacties')}
                </SortableHeader>
              </th>
              <th className="text-right py-2 xs:py-3 font-medium">
                <SortableHeader sortKeyName="clients">
                  {t('analytics.clients', 'Klanten')}
                </SortableHeader>
              </th>
              <th className="text-right py-2 xs:py-3 font-medium">
                <SortableHeader sortKeyName="avgResponseTime">
                  {t('analytics.avgTime', 'Gem. tijd')}
                </SortableHeader>
              </th>
              <th className="text-right py-2 xs:py-3 font-medium">
                <SortableHeader sortKeyName="tasksCompleted">
                  {t('analytics.tasksCompleted', 'Taken afgerond')}
                </SortableHeader>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((member) => (
              <tr key={member.name} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="py-2 xs:py-3">
                  <div className="flex items-center gap-2 xs:gap-3">
                    <Avatar className="w-6 h-6 xs:w-8 xs:h-8">
                      <AvatarFallback className="text-[10px] xs:text-xs bg-ka-navy text-white">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs xs:text-sm font-medium text-foreground">
                      {member.name}
                    </span>
                  </div>
                </td>
                <td className="text-right py-2 xs:py-3 text-xs xs:text-sm text-foreground">
                  {member.interactions}
                </td>
                <td className="text-right py-2 xs:py-3 text-xs xs:text-sm text-foreground">
                  {member.clients}
                </td>
                <td className="text-right py-2 xs:py-3 text-xs xs:text-sm text-foreground">
                  {member.avgResponseTime}
                </td>
                <td className="text-right py-2 xs:py-3 text-xs xs:text-sm text-foreground">
                  {member.tasksCompleted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
