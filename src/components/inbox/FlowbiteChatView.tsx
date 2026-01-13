import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FlowbiteMessageBubble } from "./FlowbiteMessageBubble";
import { QuickReplyPicker } from "./QuickReplyPicker";
import { EmojiPicker } from "./EmojiPicker";
import { Send, Paperclip, MoreVertical, Phone, Video, ExternalLink, AtSign } from "lucide-react";
import { ChannelIcon } from "./ChannelIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

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
  const { t } = useTranslation();
  const [messageText, setMessageText] = useState("");

  // Character limits for different channels
  const getCharacterLimit = () => {
    if (channel === 'sms') return 160;
    if (channel === 'whatsapp') return 1600;
    return null;
  };

  const characterLimit = getCharacterLimit();
  const characterCount = messageText.length;
  const isOverLimit = characterLimit && characterCount > characterLimit;

  const handleSend = () => {
    if (messageText.trim() && !isOverLimit) {
      // Handle send logic
      toast.success(t('inbox.messageSent', 'Bericht verzonden'));
      setMessageText("");
    }
  };

  const handleQuickReply = (content: string) => {
    setMessageText(content);
  };

  const handleAttachment = () => {
    toast.info(t('inbox.attachmentComingSoon', 'Bijlage functionaliteit komt binnenkort'));
  };

  const handleInternalNote = () => {
    setMessageText(prev => prev + '@');
    toast.info(t('inbox.internalNoteHint', 'Typ @ gevolgd door een naam voor een interne notitie'));
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
  };

  // Find index of first unread message (for demo, assume last 2 messages are unread for own=false)
  const unreadDividerIndex = useMemo(() => {
    // Find the first message that is not own and could be unread
    const nonOwnMessages = messages.filter(m => !m.isOwn);
    if (nonOwnMessages.length >= 2) {
      const targetMessage = nonOwnMessages[nonOwnMessages.length - 2];
      return messages.findIndex(m => m.id === targetMessage.id);
    }
    return -1;
  }, [messages]);

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
                  to={`/app/clients/${clientId}`}
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
        {messages.map((message, index) => (
          <div key={message.id}>
            {/* Unread divider */}
            {index === unreadDividerIndex && unreadDividerIndex > 0 && (
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-primary/50" />
                <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded-full">
                  {t('inbox.newMessages', 'Nieuwe berichten')}
                </span>
                <div className="flex-1 h-px bg-primary/50" />
              </div>
            )}
            <FlowbiteMessageBubble
              text={message.text}
              time={message.time}
              isOwn={message.isOwn}
              senderName={message.senderName}
              hasAttachment={message.hasAttachment}
              status={message.status}
            />
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-4 py-3 bg-card border-t border-border">
        {/* Character count indicator for SMS/WhatsApp */}
        {characterLimit && (
          <div className={`text-xs mb-2 text-right ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
            {characterCount}/{characterLimit} {t('inbox.characters', 'tekens')}
            {isOverLimit && <span className="ml-1">({t('inbox.tooLong', 'te lang')})</span>}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleAttachment}>
                <Paperclip className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('inbox.attachment', 'Bijlage')}</TooltipContent>
          </Tooltip>

          <div className="flex-1 relative">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              className={`resize-none min-h-[40px] ${isOverLimit ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder={t('inbox.typePlaceholder', 'Typ een bericht...')}
            />
          </div>

          {/* Quick Reply Picker */}
          <QuickReplyPicker onSelect={handleQuickReply} />

          {/* Emoji Picker */}
          <EmojiPicker onSelect={handleEmojiSelect} />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleInternalNote}>
                <AtSign className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('inbox.internalNote', 'Interne notitie')}</TooltipContent>
          </Tooltip>

          <Button 
            onClick={handleSend}
            disabled={!messageText.trim() || isOverLimit}
            size="icon"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Send hint */}
        <div className="text-xs text-muted-foreground mt-2">
          Ctrl+Enter {t('inbox.toSend', 'om te versturen')}
        </div>
      </div>
    </div>
  );
};
