import { ChannelIcon } from "./ChannelIcon";
import { Tag, Flame, PhoneMissed } from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { QuickActionsMenu } from "./QuickActionsMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const { t } = useTranslation(['common']);
  const [showActions, setShowActions] = useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  const getPriorityStyles = () => {
    switch (priority) {
      case 'urgent': return {
        indicator: 'bg-[hsl(var(--priority-urgent))]',
        bg: 'bg-[hsl(var(--priority-urgent)/0.05)]',
      };
      case 'high': return {
        indicator: 'bg-[hsl(var(--priority-high))]',
        bg: '',
      };
      default: return {
        indicator: '',
        bg: '',
      };
    }
  };

  const priorityStyles = getPriorityStyles();
  const hasUnread = unreadCount > 0;

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="relative group"
    >
      <button
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-selected={isActive}
        aria-label={`${t('common:conversation')} ${name}${hasUnread ? `, ${unreadCount} ${t('common:unread')}` : ''}`}
        role="option"
        className={cn(
          // Base styles
          "flex items-center w-full text-left",
          "px-3 py-3 sm:px-4",
          "transition-all duration-150 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ka-green))] focus-visible:ring-inset",
          // Border & separator
          "border-b border-[hsl(var(--border)/0.5)]",
          // Hover state
          "hover:bg-[hsl(var(--conversation-hover))]",
          // Active/selected state
          isActive && [
            "bg-[hsl(var(--conversation-active))]",
            "border-l-[3px] border-l-[hsl(var(--ka-green))]",
          ],
          // Priority backgrounds
          priority === 'urgent' && priorityStyles.bg,
          // Missed call background
          isMissedCall && "bg-[hsl(var(--priority-urgent)/0.04)]",
        )}
      >
        {/* Priority indicator bar */}
        {(priority === 'urgent' || priority === 'high') && !isActive && (
          <div className={cn(
            "absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full",
            priorityStyles.indicator,
          )} />
        )}

        {/* Avatar with channel indicator */}
        <div className="relative flex-shrink-0">
          <Avatar className={cn(
            "w-12 h-12 ring-2 ring-transparent transition-all",
            isActive && "ring-[hsl(var(--ka-green)/0.3)]",
          )}>
            <AvatarImage 
              src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
              alt=""
            />
            <AvatarFallback className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-sm font-medium">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Channel badge */}
          <div className="absolute -bottom-0.5 -right-0.5 bg-card rounded-full p-0.5 shadow-sm">
            <ChannelIcon channel={channel} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 ml-3">
          {/* Top row: Name + Timestamp */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className={cn(
                "text-[15px] truncate transition-colors",
                hasUnread ? "font-semibold text-foreground" : "font-medium text-foreground/90",
              )}>
                {name}
              </span>
              {/* Priority indicator */}
              {priority === 'urgent' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex-shrink-0">
                      <Flame className="h-4 w-4 text-[hsl(var(--priority-urgent))] animate-pulse" aria-hidden="true" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{t('common:priority.urgent', 'Urgent')}</TooltipContent>
                </Tooltip>
              )}
              {/* Missed call indicator */}
              {isMissedCall && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex-shrink-0">
                      <PhoneMissed className="h-3.5 w-3.5 text-[hsl(var(--priority-urgent))]" aria-hidden="true" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{t('common:missedCall', 'Gemiste oproep')}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <span className={cn(
              "text-xs flex-shrink-0 tabular-nums",
              isMissedCall 
                ? "text-[hsl(var(--priority-urgent))] font-medium" 
                : hasUnread 
                  ? "text-[hsl(var(--ka-green))] font-medium"
                  : "text-muted-foreground",
            )}>
              {timestamp}
            </span>
          </div>

          {/* Message preview */}
          <div className="flex items-center justify-between gap-2">
            <p className={cn(
              "text-sm truncate flex-1",
              hasUnread ? "text-foreground/80" : "text-muted-foreground",
              isMissedCall && "text-[hsl(var(--priority-urgent)/0.9)]",
            )}>
              {isMissedCall ? (
                <span className="inline-flex items-center gap-1">
                  <PhoneMissed className="w-3 h-3" aria-hidden="true" />
                  {t('common:missedCall', 'Gemiste oproep')}
                </span>
              ) : lastMessage}
            </p>
            
            {/* Unread badge */}
            {hasUnread && (
              <span 
                className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-[hsl(var(--ka-green))] rounded-full shadow-sm"
                aria-label={`${unreadCount} ${t('common:unread')}`}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>

          {/* Bottom row: Assigned + Tags */}
          {(assignedTo || tags.length > 0) && (
            <div className="flex items-center gap-2 mt-1.5">
              {assignedTo && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={assignedToAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignedTo}`} />
                        <AvatarFallback className="text-[8px] bg-[hsl(var(--muted))]">
                          {assignedTo.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground max-w-[60px] truncate hidden sm:inline">
                        {assignedTo.split(' ')[0]}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{assignedTo}</TooltipContent>
                </Tooltip>
              )}
              {tags.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                      <Tag className="h-3 w-3" aria-hidden="true" />
                      <span>{tags.length}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {tags.map((tag, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[hsl(var(--muted))] rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Quick Actions Menu */}
      {showActions && (
        <div 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" 
          onClick={(e) => e.stopPropagation()}
        >
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
