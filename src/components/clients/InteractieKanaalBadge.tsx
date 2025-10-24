import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Mail, Phone, Video, MessageCircle, ExternalLink } from 'lucide-react';
import { Interactie } from '@/types';

interface InteractieKanaalBadgeProps {
  interactie: Interactie;
  showIcon?: boolean;
}

export default function InteractieKanaalBadge({ interactie, showIcon = true }: InteractieKanaalBadgeProps) {
  const { kanaal, kanaal_metadata } = interactie;

  // Bepaal welk ID te tonen
  const getChannelId = () => {
    if (!kanaal_metadata) return null;

    switch (kanaal) {
      case 'E-mail':
        return kanaal_metadata.thread_id || kanaal_metadata.message_id;
      case 'WhatsApp':
        return kanaal_metadata.whatsapp_message_id;
      case 'Telefoon':
      case 'Zoom':
        return kanaal_metadata.call_id;
      default:
        return kanaal_metadata.external_id;
    }
  };

  const getIcon = () => {
    switch (kanaal) {
      case 'E-mail':
        return <Mail className="w-3 h-3" />;
      case 'Telefoon':
        return <Phone className="w-3 h-3" />;
      case 'Zoom':
        return <Video className="w-3 h-3" />;
      case 'WhatsApp':
        return <MessageCircle className="w-3 h-3" />;
      default:
        return <ExternalLink className="w-3 h-3" />;
    }
  };

  const channelId = getChannelId();

  if (!channelId) {
    return (
      <Badge variant="outline" className="flex items-center space-x-1">
        {showIcon && getIcon()}
        <span>{kanaal}</span>
      </Badge>
    );
  }

  const getTooltipText = () => {
    switch (kanaal) {
      case 'E-mail':
        if (kanaal_metadata?.thread_id) {
          return `Email thread: ${kanaal_metadata.thread_id}`;
        }
        return `Message ID: ${kanaal_metadata?.message_id}`;
      case 'WhatsApp':
        return `WhatsApp Message ID: ${channelId}`;
      case 'Telefoon':
      case 'Zoom':
        return `Call ID: ${channelId}`;
      default:
        return `External ID: ${channelId}`;
    }
  };

  // Shorten long IDs
  const shortenId = (id: string) => {
    if (id.length > 20) {
      return `${id.substring(0, 17)}...`;
    }
    return id;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className="flex items-center space-x-1 font-mono text-xs cursor-help">
          {showIcon && getIcon()}
          <span>{kanaal}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{shortenId(channelId)}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="space-y-1">
          <p className="font-semibold">{kanaal} Thread ID</p>
          <p className="font-mono text-xs break-all">{channelId}</p>
          <p className="text-xs text-muted-foreground">{getTooltipText()}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
