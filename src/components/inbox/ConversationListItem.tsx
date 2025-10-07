import { cn } from "@/lib/utils";
import { ChannelIcon } from "./ChannelIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type ChannelType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";

interface ConversationListItemProps {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  channel: ChannelType;
  unreadCount: number;
  isActive: boolean;
  avatarUrl?: string;
  onClick: () => void;
}

export const ConversationListItem = ({
  name,
  lastMessage,
  timestamp,
  channel,
  unreadCount,
  isActive,
  avatarUrl,
  onClick,
}: ConversationListItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 cursor-pointer transition-all duration-200 border-b border-border",
        "hover:bg-conversation-hover hover:scale-[1.01]",
        isActive && "bg-conversation-active border-l-4 border-l-inbox-unread animate-fade-in"
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1">
          <ChannelIcon channel={channel} size="sm" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn(
            "font-semibold text-sm truncate",
            unreadCount > 0 && "text-foreground"
          )}>
            {name}
          </h4>
          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
            {timestamp}
          </span>
        </div>
        
        <p className={cn(
          "text-sm truncate",
          unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
        )}>
          {lastMessage}
        </p>
      </div>

      {unreadCount > 0 && (
        <Badge 
          className="flex-shrink-0 bg-inbox-unread hover:bg-inbox-unread"
        >
          {unreadCount}
        </Badge>
      )}
    </div>
  );
};
