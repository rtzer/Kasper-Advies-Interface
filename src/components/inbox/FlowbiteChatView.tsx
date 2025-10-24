import { useState } from "react";
import { Link } from "react-router-dom";
import { FlowbiteMessageBubble } from "./FlowbiteMessageBubble";
import { Send, Paperclip, MoreVertical, Phone, Video, Smile, Mic, ExternalLink } from "lucide-react";
import { ChannelIcon } from "./ChannelIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="w-10 h-10 rounded-full"
              src={conversationAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversationName}`}
              alt={`${conversationName} avatar`}
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[hsl(var(--status-online))] border-2 border-card rounded-full"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {clientId ? (
                <Link 
                  to={`/clients/${clientId}`}
                  className="text-sm font-semibold text-foreground hover:text-primary flex items-center gap-1 group"
                >
                  {conversationName}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ) : (
                <h3 className="text-sm font-semibold text-foreground">
                  {conversationName}
                </h3>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ChannelIcon channel={channel} size="sm" />
              <span className="text-xs text-muted-foreground capitalize">
                {channel}
              </span>
              {isOnline && (
                <Badge variant="secondary" className="text-xs bg-[hsl(var(--status-online)/0.1)] text-[hsl(var(--status-online))] border-[hsl(var(--status-online)/0.2)]">
                  Online
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
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
      <div className="px-4 py-3 bg-card border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              className="resize-none min-h-[40px]"
              placeholder="Typ een bericht..."
            />
          </div>

          <Button variant="ghost" size="icon">
            <Smile className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <Mic className="w-5 h-5" />
          </Button>

          <Button 
            onClick={handleSend}
            disabled={!messageText.trim()}
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
