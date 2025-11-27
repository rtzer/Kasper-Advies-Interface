import { ChannelIcon } from "./ChannelIcon";
import { Tag, User, Flame, PhoneMissed, Clock } from "lucide-react";
import { useState } from "react";
import { QuickActionsMenu } from "./QuickActionsMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  assignedTo?: string;
  assignedToAvatar?: string;
  tags?: string[];
  isMissedCall?: boolean;
}

export const FlowbiteConversationItem = ({
  id,
  name,
  lastMessage,
  timestamp,
  channel,
  unreadCount,
  isActive,
  avatarUrl,
  onClick,
  priority = 'normal',
  assignedTo,
  assignedToAvatar,
  tags = [],
  isMissedCall = false,
}: FlowbiteConversationItemProps) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityStyles = () => {
    switch (priority) {
      case 'urgent': return {
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-l-red-500'
      };
      case 'high': return {
        color: 'text-orange-600 dark:text-orange-400',
        bg: '',
        border: 'border-l-orange-500'
      };
      default: return {
        color: 'text-muted-foreground',
        bg: '',
        border: ''
      };
    }
  };

  const priorityStyles = getPriorityStyles();

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
        } ${priority === 'urgent' ? `${priorityStyles.bg} border-l-4 ${priorityStyles.border}` : ''} ${
          isMissedCall ? 'bg-red-50/50 dark:bg-red-900/10' : ''
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
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <p className={`text-sm font-semibold text-foreground truncate ${
                unreadCount > 0 ? 'font-bold' : ''
              }`}>
                {name}
              </p>
              {/* Urgent/Priority indicator */}
              {priority === 'urgent' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Flame className="h-4 w-4 flex-shrink-0 text-red-500 animate-pulse" />
                  </TooltipTrigger>
                  <TooltipContent>Urgent</TooltipContent>
                </Tooltip>
              )}
              {/* Missed call indicator */}
              {isMissedCall && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PhoneMissed className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
                  </TooltipTrigger>
                  <TooltipContent>Gemiste oproep</TooltipContent>
                </Tooltip>
              )}
            </div>
            <span className={`text-xs flex-shrink-0 ${
              isMissedCall ? 'text-red-500 font-medium' : 'text-muted-foreground'
            }`}>
              {timestamp}
            </span>
          </div>
          <p className={`text-sm truncate ${
            unreadCount > 0 
              ? 'text-foreground font-medium' 
              : 'text-muted-foreground'
          } ${isMissedCall ? 'text-red-600 dark:text-red-400' : ''}`}>
            {isMissedCall ? '📞 Gemiste oproep' : lastMessage}
          </p>
          {(assignedTo || tags.length > 0) && (
            <div className="flex items-center gap-2 mt-1.5">
              {assignedTo && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={assignedToAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignedTo}`} />
                        <AvatarFallback className="text-[8px]">{assignedTo.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{assignedTo}</TooltipContent>
                </Tooltip>
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
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Quick Actions */}
      {showActions && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10" onClick={(e) => e.stopPropagation()}>
          <QuickActionsMenu
            conversationId={id}
            conversationName={name}
            currentAssignee={assignedTo}
            currentTags={tags}
            currentPriority={priority}
          />
        </div>
      )}
    </div>
  );
};
