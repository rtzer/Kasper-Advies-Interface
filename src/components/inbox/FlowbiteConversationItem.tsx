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
      className={`flex items-center w-full px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
        isActive ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-l-blue-600' : ''
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
          <p className={`text-sm font-semibold text-gray-900 dark:text-white truncate ${
            unreadCount > 0 ? 'font-bold' : ''
          }`}>
            {name}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timestamp}
          </span>
        </div>
        <p className={`text-sm truncate ${
          unreadCount > 0 
            ? 'text-gray-900 dark:text-white font-medium' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {lastMessage}
        </p>
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <span className="inline-flex items-center justify-center w-6 h-6 ms-2 text-xs font-semibold text-white bg-blue-600 rounded-full">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
