import { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChannelIcon } from "./ChannelIcon";
import { Badge } from "@/components/ui/badge";
import { EmojiPicker } from "./EmojiPicker";
import { QuickReplyPicker } from "./QuickReplyPicker";
import { useToast } from "@/hooks/use-toast";

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

interface ChatViewProps {
  conversationName: string;
  conversationAvatar?: string;
  channel: ChannelType;
  messages: Message[];
  isOnline?: boolean;
}

export const ChatView = ({ 
  conversationName, 
  conversationAvatar, 
  channel, 
  messages,
  isOnline = false 
}: ChatViewProps) => {
  const [messageText, setMessageText] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (messageText.trim()) {
      toast({
        title: "Bericht verzonden",
        description: "Uw bericht is succesvol verzonden.",
      });
      setMessageText("");
    }
  };

  const handleFileUpload = () => {
    toast({
      title: "Bestand uploaden",
      description: "Deze functie wordt binnenkort toegevoegd.",
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  const handleQuickReply = (content: string) => {
    setMessageText(content);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversationAvatar} alt={conversationName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {conversationName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-status-online border-2 border-card rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{conversationName}</h3>
            <div className="flex items-center gap-2">
              <ChannelIcon channel={channel} size="sm" />
              <span className="text-xs text-muted-foreground capitalize">{channel}</span>
              {isOnline && (
                <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                  Online
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-1">
        {messages.map((message) => (
          <MessageBubble
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
      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 flex-shrink-0"
            onClick={handleFileUpload}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <QuickReplyPicker onSelect={handleQuickReply} />
          
          <div className="flex-1">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Typ een bericht..."
              className="w-full resize-none min-h-10"
            />
          </div>

          <EmojiPicker onSelect={handleEmojiSelect} />

          <Button 
            size="icon" 
            className="h-10 w-10 flex-shrink-0 bg-inbox-unread hover:bg-inbox-unread/90"
            onClick={handleSend}
            disabled={!messageText.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
