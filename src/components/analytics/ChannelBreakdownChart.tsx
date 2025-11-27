import { ChannelBreakdown } from '@/hooks/useAnalyticsData';
import { useTranslation } from 'react-i18next';

interface ChannelBreakdownChartProps {
  data: ChannelBreakdown[];
  onChannelClick?: (channel: string) => void;
  selectedChannel?: string;
}

export default function ChannelBreakdownChart({
  data,
  onChannelClick,
  selectedChannel,
}: ChannelBreakdownChartProps) {
  const { t } = useTranslation();

  const channelLabels: Record<string, string> = {
    'Telefoon': t('analytics.channels.phone', 'Telefoon'),
    'E-mail': t('analytics.channels.email', 'E-mail'),
    'WhatsApp': 'WhatsApp',
    'Zoom': t('analytics.channels.video', 'Video'),
    'SMS': 'SMS',
  };

  return (
    <div className="bg-card border rounded-lg p-4 xs:p-6 shadow-sm">
      <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-foreground mb-4">
        {t('analytics.channelBreakdown', 'Communicatie per kanaal')}
      </h3>
      
      <div className="space-y-3 xs:space-y-4">
        {data.map((item) => (
          <button
            key={item.channel}
            onClick={() => onChannelClick?.(item.channel)}
            className={`w-full text-left transition-opacity ${
              selectedChannel && selectedChannel !== item.channel ? 'opacity-50' : ''
            } hover:opacity-100`}
          >
            <div className="flex items-center justify-between mb-1.5 xs:mb-2">
              <span className="text-xs xs:text-sm font-medium text-foreground">
                {channelLabels[item.channel] || item.channel}
              </span>
              <span className="text-[10px] xs:text-xs text-muted-foreground">
                {item.percentage}% ({item.count} {t('analytics.interactions', 'interacties')})
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 xs:h-2.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </button>
        ))}
        
        {data.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">
            {t('analytics.noData', 'Geen data beschikbaar')}
          </p>
        )}
      </div>
    </div>
  );
}
