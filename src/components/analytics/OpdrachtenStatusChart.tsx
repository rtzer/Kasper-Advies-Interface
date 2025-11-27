import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { OpdrachtenStatus } from '@/hooks/useAnalyticsData';
import { useTranslation } from 'react-i18next';

interface OpdrachtenStatusChartProps {
  data: OpdrachtenStatus[];
}

const STATUS_COLORS: Record<string, string> = {
  'Intake': '#3b82f6',
  'In behandeling': '#06b6d4',
  'Wacht op klant': '#f97316',
  'Gereed voor controle': '#a855f7',
  'Afgerond': '#22c55e',
  'Ingediend': '#10b981',
};

export default function OpdrachtenStatusChart({ data }: OpdrachtenStatusChartProps) {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  const chartData = data.map(item => ({
    ...item,
    color: STATUS_COLORS[item.status] || '#64748b',
  }));

  return (
    <div className="bg-card border rounded-lg p-4 xs:p-6 shadow-sm">
      <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-foreground mb-4">
        {t('analytics.assignmentStatus', 'Opdrachten Status')}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="h-48 xs:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="count"
                nameKey="status"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} opdrachten`, name]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown with amounts */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs xs:text-sm pb-2 border-b">
            <span className="font-medium">{t('analytics.total', 'Totaal')}</span>
            <div className="text-right">
              <span className="font-bold">{totalCount} {t('analytics.assignments', 'opdrachten')}</span>
              <span className="text-muted-foreground ml-2">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {chartData.map((item) => (
            <div key={item.status} className="flex items-center justify-between text-xs xs:text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-foreground">{item.status}</span>
              </div>
              <div className="text-right">
                <span className="text-foreground font-medium">{item.count}</span>
                <span className="text-muted-foreground text-[10px] xs:text-xs ml-2">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
