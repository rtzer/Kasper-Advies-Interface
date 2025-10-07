import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  time: string;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
  hasAttachment?: boolean;
  status?: "sent" | "delivered" | "read";
}

export const MessageBubble = ({
  text,
  time,
  isOwn,
  senderName,
  senderAvatar,
  hasAttachment = false,
  status = "read",
}: MessageBubbleProps) => {
  return (
    <div className={cn(
      "flex gap-2 mb-4 animate-fade-in",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {!isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {senderName?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        "flex flex-col max-w-[70%]",
        isOwn && "items-end"
      )}>
        {!isOwn && senderName && (
          <span className="text-xs text-muted-foreground mb-1 px-1">
            {senderName}
          </span>
        )}
        
        <div className={cn(
          "rounded-lg px-4 py-2 shadow-sm",
          isOwn 
            ? "bg-message-sent-bg text-foreground rounded-tr-none" 
            : "bg-message-received-bg text-foreground rounded-tl-none"
        )}>
          {hasAttachment && (
            <div className="flex items-center gap-2 text-sm mb-2 pb-2 border-b border-border/50">
              <Paperclip className="h-4 w-4" />
              <span className="text-muted-foreground">Bijlage.pdf</span>
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        </div>

        <div className={cn(
          "flex items-center gap-1 mt-1 px-1",
          isOwn && "flex-row-reverse"
        )}>
          <span className="text-xs text-muted-foreground">{time}</span>
          {isOwn && (
            <span className="text-muted-foreground">
              {status === "read" ? (
                <CheckCheck className="h-3 w-3 text-channel-email" />
              ) : status === "delivered" ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>

      {isOwn && (
        <div className="w-8 flex-shrink-0" />
      )}
    </div>
  );
};
