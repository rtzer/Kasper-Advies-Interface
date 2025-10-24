import { Paperclip, Check, CheckCheck } from "lucide-react";

interface FlowbiteMessageBubbleProps {
  text: string;
  time: string;
  isOwn: boolean;
  senderName?: string;
  hasAttachment?: boolean;
  status?: "sent" | "delivered" | "read";
}

export const FlowbiteMessageBubble = ({
  text,
  time,
  isOwn,
  senderName,
  hasAttachment,
  status,
}: FlowbiteMessageBubbleProps) => {
  return (
    <div className={`flex gap-2.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <img
          className="w-8 h-8 rounded-full"
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName || 'user'}`}
          alt={`${senderName || 'user'} avatar`}
        />
      )}
      <div className={`flex flex-col gap-1 ${isOwn ? 'max-w-[320px]' : 'max-w-[320px]'}`}>
        {!isOwn && senderName && (
          <span className="text-sm font-semibold text-foreground">
            {senderName}
          </span>
        )}
        <div
          className={`flex flex-col leading-1.5 p-4 ${
            isOwn
              ? 'bg-[hsl(var(--message-sent-bg))] text-[hsl(var(--message-sent))] rounded-s-xl rounded-ee-xl'
              : 'bg-[hsl(var(--message-received-bg))] text-foreground rounded-e-xl rounded-es-xl'
          }`}
        >
          {hasAttachment && (
            <div className="flex items-start gap-2.5 mb-2">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Attachment
              </span>
            </div>
          )}
          <p className="text-sm font-normal">
            {text}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-normal text-muted-foreground">
            {time}
          </span>
          {isOwn && status && (
            <>
              {status === 'read' && (
                <CheckCheck className="w-4 h-4 text-primary" />
              )}
              {status === 'delivered' && (
                <CheckCheck className="w-4 h-4 text-muted-foreground" />
              )}
              {status === 'sent' && (
                <Check className="w-4 h-4 text-muted-foreground" />
              )}
            </>
          )}
        </div>
      </div>
      {isOwn && (
        <img
          className="w-8 h-8 rounded-full"
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=me"
          alt="My avatar"
        />
      )}
    </div>
  );
};
