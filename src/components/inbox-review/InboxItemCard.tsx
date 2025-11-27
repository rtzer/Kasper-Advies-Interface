import { format, formatDistanceToNow } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { InboxItem } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MessageSquare, User, Building2, AlertCircle } from 'lucide-react';

interface InboxItemCardProps {
  item: InboxItem;
  isSelected: boolean;
  onClick: () => void;
}

const channelConfig = {
  'Telefoon': { icon: Phone, colorClass: 'text-channel-phone bg-channel-phone/10' },
  'E-mail': { icon: Mail, colorClass: 'text-channel-email bg-channel-email/10' },
  'WhatsApp': { icon: MessageSquare, colorClass: 'text-channel-whatsapp bg-channel-whatsapp/10' },
};

const statusConfig: Record<InboxItem['status'], { colorClass: string }> = {
  'Nieuw': { colorClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  'In behandeling': { colorClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  'Gematcht': { colorClass: 'bg-ka-green/20 text-ka-green' },
  'Nieuwe klant aangemaakt': { colorClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' },
  'Spam': { colorClass: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
};

export function InboxItemCard({ item, isSelected, onClick }: InboxItemCardProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const channel = channelConfig[item.kanaal];
  const ChannelIcon = channel.icon;
  const status = statusConfig[item.status];

  const displayName = item.raw_naam || item.raw_afzender;
  const timeAgo = formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale });

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 border-b cursor-pointer transition-colors',
        isSelected 
          ? 'bg-ka-green/10 border-l-4 border-l-ka-green' 
          : 'hover:bg-muted/50 border-l-4 border-l-transparent',
        item.status === 'Nieuw' && !isSelected && 'bg-blue-50/50 dark:bg-blue-950/20'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Channel icon */}
        <div className={cn('p-2 rounded-lg', channel.colorClass)}>
          <ChannelIcon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium truncate">{displayName}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
          </div>

          {/* Subject or afzender */}
          <div className="text-sm text-muted-foreground truncate">
            {item.raw_onderwerp || item.raw_afzender}
          </div>

          {/* Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {item.raw_content}
          </p>

          {/* Footer row */}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={cn('text-xs', status.colorClass)}>
              {item.status}
            </Badge>

            {item.match_score > 0 && item.status === 'Nieuw' && (
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                {item.match_score}% match
              </Badge>
            )}

            {item.suggested_klant_naam && item.status === 'Nieuw' && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="w-3 h-3" />
                <span className="truncate max-w-24">{item.suggested_klant_naam}</span>
              </div>
            )}

            {item.match_type === 'Geen match' && item.status === 'Nieuw' && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                <AlertCircle className="w-3 h-3" />
                <span>Geen match</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
