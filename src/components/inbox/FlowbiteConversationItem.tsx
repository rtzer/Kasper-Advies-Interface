import { ChannelIcon } from "./ChannelIcon";

type ChannelType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";

interface FlowbiteConversationItemProps {
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

export const FlowbiteConversationItem = ({
  name,
  lastMessage,
  timestamp,
  channel,
  unreadCount,
  isActive,
  avatarUrl,
  onClick,
}: FlowbiteConversationItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 border-b border-border hover:bg-[hsl(var(--conversation-hover))] transition-colors ${
        isActive ? 'bg-[hsl(var(--conversation-active))] border-l-4 border-l-primary' : ''
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          className="rounded-full w-11 h-11"
          src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
          alt={`${name} avatar`}
        />
        <div className="absolute -bottom-0.5 -right-0.5">
          <ChannelIcon channel={channel} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 ms-4">
        <div className="flex items-center justify-between mb-1">
          <p className={`text-sm font-semibold text-foreground truncate ${
            unreadCount > 0 ? 'font-bold' : ''
          }`}>
            {name}
          </p>
          <span className="text-xs text-muted-foreground">
            {timestamp}
          </span>
        </div>
        <p className={`text-sm truncate ${
          unreadCount > 0 
            ? 'text-foreground font-medium' 
            : 'text-muted-foreground'
        }`}>
          {lastMessage}
        </p>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <span className="inline-flex items-center justify-center w-6 h-6 ms-2 text-xs font-semibold text-primary-foreground bg-primary rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
