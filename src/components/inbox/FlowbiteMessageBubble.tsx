import { Paperclip, Check, CheckCheck, File, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowbiteMessageBubbleProps {
  text: string;
  time: string;
  isOwn: boolean;
  senderName?: string;
  hasAttachment?: boolean;
  attachmentType?: "image" | "file";
  attachmentName?: string;
  status?: "sent" | "delivered" | "read";
}

export const FlowbiteMessageBubble = ({
  text,
  time,
  isOwn,
  senderName,
  hasAttachment,
  attachmentType = "file",
  attachmentName,
  status,
}: FlowbiteMessageBubbleProps) => {
  return (
    <div 
      className={cn(
        "flex gap-2 sm:gap-2.5 px-2 sm:px-0",
        isOwn ? "justify-end" : "justify-start",
      )}
      role="listitem"
    >
      {/* Avatar for received messages */}
      {!isOwn && (
        <img
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm"
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName || 'user'}`}
          alt=""
          aria-hidden="true"
        />
      )}
      
      <div className={cn(
        "flex flex-col gap-0.5",
        "max-w-[85%] sm:max-w-[75%] md:max-w-[400px]",
      )}>
        {/* Sender name for received messages */}
        {!isOwn && senderName && (
          <span className="text-xs font-medium text-[hsl(var(--ka-green))] ml-1 mb-0.5">
            {senderName}
          </span>
        )}
        
        {/* Message bubble with WhatsApp-style tail */}
        <div className="relative">
          {/* Tail SVG */}
          {isOwn ? (
            <svg 
              className="absolute -right-2 top-0 w-3 h-4 text-[hsl(var(--ka-green)/0.15)] dark:text-[hsl(var(--ka-green)/0.25)]" 
              viewBox="0 0 12 16" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M0 0 L12 0 L12 4 Q6 4 3 10 Q1 14 0 16 Z" />
            </svg>
          ) : (
            <svg 
              className="absolute -left-2 top-0 w-3 h-4 text-white dark:text-[hsl(217,32.6%,17.5%)]" 
              viewBox="0 0 12 16" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0 L0 0 L0 4 Q6 4 9 10 Q11 14 12 16 Z" />
            </svg>
          )}
          
          {/* Bubble content */}
          <div
            className={cn(
              "relative px-3 py-2 shadow-sm",
              isOwn ? [
                // Sent message - using brand green tint
                "bg-[hsl(var(--ka-green)/0.15)] dark:bg-[hsl(var(--ka-green)/0.25)]",
                "text-foreground",
                "rounded-2xl rounded-tr-sm",
              ] : [
                // Received message
                "bg-white dark:bg-[hsl(217,32.6%,17.5%)]",
                "text-foreground",
                "rounded-2xl rounded-tl-sm",
              ]
            )}
          >
            {/* Attachment */}
            {hasAttachment && (
              <div className={cn(
                "flex items-center gap-2 mb-2 p-2 rounded-lg",
                isOwn 
                  ? "bg-[hsl(var(--ka-green)/0.1)] dark:bg-[hsl(var(--ka-green)/0.15)]"
                  : "bg-[hsl(var(--muted))]",
              )}>
                {attachmentType === "image" ? (
                  <ImageIcon className="w-5 h-5 text-[hsl(var(--ka-green))]" aria-hidden="true" />
                ) : (
                  <File className="w-5 h-5 text-[hsl(var(--ka-green))]" aria-hidden="true" />
                )}
                <span className="text-sm font-medium truncate">
                  {attachmentName || "Attachment"}
                </span>
              </div>
            )}
            
            {/* Message text */}
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {text}
            </p>
            
            {/* Time & status - inside bubble, bottom right */}
            <div className={cn(
              "flex items-center justify-end gap-1 mt-1",
              "-mb-0.5 -mr-0.5",
            )}>
              <span className="text-[10px] text-muted-foreground/70 tabular-nums">
                {time}
              </span>
              {isOwn && status && (
                <span className="flex-shrink-0" aria-label={status}>
                  {status === 'read' && (
                    <CheckCheck className="w-4 h-4 text-[hsl(var(--ka-green))]" aria-hidden="true" />
                  )}
                  {status === 'delivered' && (
                    <CheckCheck className="w-4 h-4 text-muted-foreground/60" aria-hidden="true" />
                  )}
                  {status === 'sent' && (
                    <Check className="w-4 h-4 text-muted-foreground/60" aria-hidden="true" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Avatar for sent messages (smaller, more subtle) */}
      {isOwn && (
        <img
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex-shrink-0 opacity-80"
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=me"
          alt=""
          aria-hidden="true"
        />
      )}
    </div>
  );
};
