import { ChannelIcon } from "./ChannelIcon";
import { Tag, User, Flag } from "lucide-react";
import { useState } from "react";

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
  priority?: 'laag' | 'normaal' | 'hoog' | 'urgent';
  assignedTo?: string;
  tags?: string[];
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
  priority = 'normaal',
  assignedTo,
  tags = [],
}: FlowbiteConversationItemProps) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = () => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400';
      case 'hoog': return 'text-orange-600 dark:text-orange-400';
      case 'normaal': return 'text-blue-600 dark:text-blue-400';
      case 'laag': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="relative group"
    >
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
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <p className={`text-sm font-semibold text-foreground truncate ${
                unreadCount > 0 ? 'font-bold' : ''
              }`}>
                {name}
              </p>
              {priority !== 'normaal' && (
                <Flag className={`h-3 w-3 flex-shrink-0 ${getPriorityColor()}`} />
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
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
          {(assignedTo || tags.length > 0) && (
            <div className="flex items-center gap-2 mt-1">
              {assignedTo && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {assignedTo}
                </span>
              )}
              {tags.length > 0 && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tags.length}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center w-6 h-6 ms-2 text-xs font-semibold text-primary-foreground bg-primary rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Quick Actions */}
      {showActions && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle assign action
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Toewijzen"
          >
            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle tag action
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Tag toevoegen"
          >
            <Tag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle priority action
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Prioriteit aanpassen"
          >
            <Flag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
};
