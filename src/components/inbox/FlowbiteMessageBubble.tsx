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
    <div className={`flex items-start gap-2.5 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar for received messages */}
      {!isOwn && (
        <img
          className="w-8 h-8 rounded-full"
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName}`}
          alt={`${senderName} avatar`}
        />
      )}

      <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'w-full max-w-[320px]'}`}>
        {/* Sender name for received messages */}
        {!isOwn && senderName && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {senderName}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`flex flex-col leading-1.5 p-4 border-gray-200 rounded-e-xl rounded-es-xl ${
            isOwn
              ? 'bg-blue-600 text-white rounded-e-xl rounded-es-xl'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-s-xl rounded-ee-xl'
          }`}
        >
          {/* Attachment indicator */}
          {hasAttachment && (
            <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${
              isOwn ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Paperclip className="w-4 h-4" />
              <span className="text-sm">Bijlage</span>
            </div>
          )}

          {/* Message text */}
          <p className="text-sm font-normal">{text}</p>
        </div>

        {/* Time and status */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
            {time}
          </span>
          {isOwn && status && (
            <span className="text-gray-500 dark:text-gray-400">
              {status === "read" ? (
                <CheckCheck className="w-4 h-4 text-blue-600" />
              ) : status === "delivered" ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
