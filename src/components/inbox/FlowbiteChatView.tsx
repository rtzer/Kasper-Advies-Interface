import { useState } from "react";
import { Link } from "react-router-dom";
import { FlowbiteMessageBubble } from "./FlowbiteMessageBubble";
import { Send, Paperclip, MoreVertical, Phone, Video, Smile, Mic, ExternalLink } from "lucide-react";
import { ChannelIcon } from "./ChannelIcon";

type ChannelType = "whatsapp" | "email" | "phone" | "video" | "facebook" | "instagram" | "linkedin" | "sms";

interface Message {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
  senderName?: string;
  hasAttachment?: boolean;
  status?: "sent" | "delivered" | "read";
}

interface FlowbiteChatViewProps {
  conversationName: string;
  conversationAvatar?: string;
  channel: ChannelType;
  messages: Message[];
  isOnline?: boolean;
  clientId?: string;
}

export const FlowbiteChatView = ({ 
  conversationName, 
  conversationAvatar, 
  channel, 
  messages,
  isOnline = false,
  clientId
}: FlowbiteChatViewProps) => {
  const [messageText, setMessageText] = useState("");

  const handleSend = () => {
    if (messageText.trim()) {
      // Handle send logic
      setMessageText("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="w-10 h-10 rounded-full"
              src={conversationAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversationName}`}
              alt={`${conversationName} avatar`}
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {clientId ? (
                <Link 
                  to={`/clients/${clientId}`}
                  className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 group"
                >
                  {conversationName}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ) : (
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {conversationName}
                </h3>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ChannelIcon channel={channel} size="sm" />
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {channel}
              </span>
              {isOnline && (
                <span className="text-xs text-green-600 dark:text-green-400">Online</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <FlowbiteMessageBubble
            key={message.id}
            text={message.text}
            time={message.time}
            isOwn={message.isOwn}
            senderName={message.senderName}
            hasAttachment={message.hasAttachment}
            status={message.status}
          />
        ))}
      </div>

      {/* Message Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
              placeholder="Typ een bericht..."
            />
          </div>

          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <Smile className="w-5 h-5" />
          </button>

          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="inline-flex justify-center p-2 text-white bg-blue-700 rounded-lg cursor-pointer hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
