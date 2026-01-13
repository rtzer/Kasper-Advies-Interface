import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ClientHealth } from '@/hooks/useAnalyticsData';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HealthDonutChartProps {
  data: ClientHealth;
}

export default function HealthDonutChart({ data }: HealthDonutChartProps) {
  const { t } = useTranslation();

  const chartData = [
    { name: t('analytics.health.healthy', 'Gezond (>75)'), value: data.healthy, color: '#22c55e' },
    { name: t('analytics.health.attention', 'Aandacht nodig'), value: data.needsAttention, color: '#eab308' },
    { name: t('analytics.health.atRisk', 'At-risk (<50)'), value: data.atRisk, color: '#ef4444' },
  ];

  const total = data.healthy + data.needsAttention + data.atRisk;

  return (
    <div className="bg-card border rounded-lg p-4 xs:p-6 shadow-sm">
      <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-foreground mb-4">
        {t('analytics.clientHealth', 'Klant Health Overzicht')}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut Chart */}
        <div className="h-48 xs:h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} klanten`, '']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-20px' }}>
            <div className="text-center">
              <p className="text-xl xs:text-2xl font-bold text-foreground">{total}</p>
              <p className="text-[10px] xs:text-xs text-muted-foreground">{t('analytics.totalClients', 'klanten')}</p>
            </div>
          </div>
        </div>

        {/* At-risk clients list */}
        <div>
          <h4 className="text-xs xs:text-sm font-medium text-foreground mb-2 xs:mb-3">
            {t('analytics.atRiskClients', 'At-risk klanten')}
          </h4>
          
          {data.atRiskClients.length > 0 ? (
            <div className="space-y-2">
              {data.atRiskClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-2 xs:p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/app/clients/${client.id}`}
                      className="text-xs xs:text-sm font-medium text-foreground hover:underline truncate block"
                    >
                      {client.name}
                    </Link>
                    <p className="text-[10px] xs:text-xs text-muted-foreground">
                      Score: {client.score} • {client.daysSinceContact} {t('analytics.daysAgo', 'dagen geleden')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 xs:h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                  >
                    <Phone className="w-3 h-3 xs:w-4 xs:h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs xs:text-sm text-muted-foreground py-4 text-center">
              {t('analytics.noAtRiskClients', 'Geen at-risk klanten!')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
