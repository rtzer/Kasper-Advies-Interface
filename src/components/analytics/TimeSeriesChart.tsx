import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TimeSeriesChartProps {
  data: Array<{
    date: string;
    total: number;
    Telefoon?: number;
    'E-mail'?: number;
    WhatsApp?: number;
    Zoom?: number;
  }>;
}

const CHANNELS = [
  { key: 'total', label: 'Totaal', color: '#64748b' },
  { key: 'Telefoon', label: 'Telefoon', color: '#3b82f6' },
  { key: 'E-mail', label: 'E-mail', color: '#f59e0b' },
  { key: 'WhatsApp', label: 'WhatsApp', color: '#22c55e' },
  { key: 'Zoom', label: 'Video', color: '#a855f7' },
];

export default function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  const { t } = useTranslation();
  const [visibleChannels, setVisibleChannels] = useState<Record<string, boolean>>({
    total: true,
    Telefoon: true,
    'E-mail': true,
    WhatsApp: true,
    Zoom: true,
  });

  const toggleChannel = (channel: string) => {
    setVisibleChannels(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-card border rounded-lg p-4 xs:p-6 shadow-sm">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4 mb-4">
        <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-foreground">
          {t('analytics.interactionsOverTime', 'Interacties over tijd')}
        </h3>
        
        {/* Channel toggles */}
        <div className="flex flex-wrap gap-1 xs:gap-1.5">
          {CHANNELS.map(channel => (
            <Button
              key={channel.key}
              variant={visibleChannels[channel.key] ? 'default' : 'outline'}
              size="sm"
              className="h-6 xs:h-7 text-[10px] xs:text-xs px-2"
              onClick={() => toggleChannel(channel.key)}
              style={{
                backgroundColor: visibleChannels[channel.key] ? channel.color : undefined,
                borderColor: channel.color,
              }}
            >
              {channel.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-56 xs:h-64 sm:h-72">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={(label) => formatDate(label as string)}
              />
              {CHANNELS.map(channel => (
                visibleChannels[channel.key] && (
                  <Line
                    key={channel.key}
                    type="monotone"
                    dataKey={channel.key}
                    name={channel.label}
                    stroke={channel.color}
                    strokeWidth={channel.key === 'total' ? 2 : 1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {t('analytics.noData', 'Geen data beschikbaar')}
          </div>
        )}
      </div>
    </div>
  );
}
