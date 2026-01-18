import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FlowbiteMessageBubble } from "./FlowbiteMessageBubble";
import { QuickReplyPicker } from "./QuickReplyPicker";
import { EmojiPicker } from "./EmojiPicker";
import { Send, Paperclip, MoreVertical, Phone, Video, ExternalLink, AtSign, ChevronDown } from "lucide-react";
import { ChannelIcon } from "./ChannelIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  onProfileClick?: () => void;
}

// WhatsApp-style chat background pattern
const ChatBackgroundPattern = () => (
  <div 
    className="absolute inset-0 opacity-[0.04] dark:opacity-[0.025] pointer-events-none"
    aria-hidden="true"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='30' cy='25' r='1'/%3E%3Ccircle cx='50' cy='10' r='1.2'/%3E%3Ccircle cx='70' cy='30' r='0.8'/%3E%3Ccircle cx='90' cy='15' r='1'/%3E%3Ccircle cx='15' cy='45' r='1'/%3E%3Ccircle cx='35' cy='60' r='1.3'/%3E%3Ccircle cx='55' cy='45' r='0.9'/%3E%3Ccircle cx='75' cy='65' r='1.1'/%3E%3Ccircle cx='95' cy='50' r='1'/%3E%3Ccircle cx='5' cy='80' r='1.2'/%3E%3Ccircle cx='25' cy='90' r='0.8'/%3E%3Ccircle cx='45' cy='75' r='1'/%3E%3Ccircle cx='65' cy='95' r='1.4'/%3E%3Ccircle cx='85' cy='80' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />
);

export const FlowbiteChatView = ({ 
  conversationName, 
  conversationAvatar, 
  channel, 
  messages,
  isOnline = false,
  clientId,
  onProfileClick,
}: FlowbiteChatViewProps) => {
  const { t } = useTranslation();
  const [messageText, setMessageText] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle scroll to show/hide scroll-to-bottom button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 200;
    setShowScrollButton(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  // Find index of first unread message
  const unreadDividerIndex = useMemo(() => {
    const nonOwnMessages = messages.filter(m => !m.isOwn);
    if (nonOwnMessages.length >= 2) {
      const targetMessage = nonOwnMessages[nonOwnMessages.length - 2];
      return messages.findIndex(m => m.id === targetMessage.id);
    }
    return -1;
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header - Modern, clean design */}
      <header className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-10">
        {onProfileClick ? (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={onProfileClick}
              className={cn(
                "flex items-center gap-3 min-w-0 text-left",
                "rounded-xl p-2 -m-2",
                "hover:bg-[hsl(var(--muted)/0.5)] active:bg-[hsl(var(--muted))]",
                "transition-colors duration-150",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ka-green))] focus-visible:ring-offset-2",
              )}
              aria-label={t("inbox.openContactInfo", "Open contactinformatie")}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="w-10 h-10 sm:w-11 sm:h-11 ring-2 ring-transparent hover:ring-[hsl(var(--ka-green)/0.2)] transition-all">
                  <AvatarImage 
                    src={conversationAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversationName}`}
                    alt=""
                  />
                  <AvatarFallback className="bg-[hsl(var(--ka-green)/0.1)] text-[hsl(var(--ka-green))] font-medium">
                    {conversationName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span 
                    className="absolute bottom-0 right-0 w-3 h-3 bg-[hsl(var(--status-online))] border-2 border-card rounded-full"
                    aria-label={t('common:online', 'Online')}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">
                  {conversationName}
                </h1>
                <div className="flex items-center gap-2 min-w-0">
                  <ChannelIcon channel={channel} size="sm" />
                  <span className="text-xs text-muted-foreground capitalize truncate">
                    {channel}
                  </span>
                  {isOnline && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 bg-[hsl(var(--status-online)/0.1)] text-[hsl(var(--status-online))] border-0"
                    >
                      Online
                    </Badge>
                  )}
                </div>
              </div>
            </button>

            {clientId && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to={`/app/clients/${clientId}`} 
                    aria-label={t("inbox.openClient", "Open klant")}
                    className="flex-shrink-0"
                  >
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-[hsl(var(--ka-green)/0.1)] hover:text-[hsl(var(--ka-green))]">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>{t("inbox.openClient", "Open klant")}</TooltipContent>
              </Tooltip>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar className="w-10 h-10 sm:w-11 sm:h-11">
                <AvatarImage 
                  src={conversationAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversationName}`}
                  alt=""
                />
                <AvatarFallback className="bg-[hsl(var(--ka-green)/0.1)] text-[hsl(var(--ka-green))]">
                  {conversationName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[hsl(var(--status-online))] border-2 border-card rounded-full" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {clientId ? (
                  <Link 
                    to={`/app/clients/${clientId}`}
                    className="text-sm sm:text-base font-semibold text-foreground hover:text-[hsl(var(--ka-green))] flex items-center gap-1 group transition-colors"
                  >
                    {conversationName}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ) : (
                  <h1 className="text-sm sm:text-base font-semibold text-foreground">
                    {conversationName}
                  </h1>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ChannelIcon channel={channel} size="sm" />
                <span className="text-xs text-muted-foreground capitalize">
                  {channel}
                </span>
                {isOnline && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-[hsl(var(--status-online)/0.1)] text-[hsl(var(--status-online))] border-0">
                    Online
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-[hsl(var(--ka-green)/0.1)] hover:text-[hsl(var(--ka-green))]">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('common:call', 'Bellen')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-[hsl(var(--ka-green)/0.1)] hover:text-[hsl(var(--ka-green))]">
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('common:videoCall', 'Videobellen')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-[hsl(var(--muted))]">
                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('common:more', 'Meer')}</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Messages Area with WhatsApp-like background */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative bg-[hsl(var(--muted)/0.3)]"
        role="log"
        aria-label={t('inbox.messageHistory', 'Berichtgeschiedenis')}
        aria-live="polite"
      >
        <ChatBackgroundPattern />
        
        <div className="relative z-10 p-3 sm:p-4 space-y-3">
          {/* Date separator for first message */}
          {messages.length > 0 && (
            <div className="flex justify-center mb-4">
              <span className="text-xs font-medium text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                {t('common:today', 'Vandaag')}
              </span>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={message.id}>
              {/* Unread divider */}
              {index === unreadDividerIndex && unreadDividerIndex > 0 && (
                <div className="flex items-center gap-3 my-4" role="separator" aria-label={t('inbox.newMessages', 'Nieuwe berichten')}>
                  <div className="flex-1 h-px bg-[hsl(var(--ka-green)/0.4)]" />
                  <span className="text-xs font-medium text-[hsl(var(--ka-green))] px-3 py-1 bg-[hsl(var(--ka-green)/0.1)] rounded-full">
                    {t('inbox.newMessages', 'Nieuwe berichten')}
                  </span>
                  <div className="flex-1 h-px bg-[hsl(var(--ka-green)/0.4)]" />
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
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className={cn(
              "absolute bottom-4 right-4 z-20",
              "w-10 h-10 rounded-full shadow-lg",
              "bg-card border border-border",
              "flex items-center justify-center",
              "hover:bg-[hsl(var(--muted))] transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ka-green))]",
            )}
            aria-label={t('inbox.scrollToBottom', 'Scroll naar beneden')}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Message Input - Modern WhatsApp-style */}
      <footer className="px-2 sm:px-4 py-2 sm:py-3 bg-card border-t border-border">
        {/* Character count indicator */}
        {characterLimit && (
          <div className={cn(
            "text-xs mb-2 text-right tabular-nums transition-colors",
            isOverLimit ? "text-[hsl(var(--destructive))]" : "text-muted-foreground",
          )}>
            {characterCount}/{characterLimit} {t('inbox.characters', 'tekens')}
            {isOverLimit && <span className="ml-1 font-medium">({t('inbox.tooLong', 'te lang')})</span>}
          </div>
        )}
        
        <div className="flex items-end gap-1.5 sm:gap-2">
          {/* Attachment button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleAttachment}
                className="h-10 w-10 rounded-full hover:bg-[hsl(var(--muted))] flex-shrink-0"
              >
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('inbox.attachment', 'Bijlage')}</TooltipContent>
          </Tooltip>

          {/* Input container */}
          <div className={cn(
            "flex-1 flex items-end gap-1",
            "bg-[hsl(var(--muted)/0.5)] rounded-2xl",
            "border border-transparent transition-all",
            "focus-within:border-[hsl(var(--ka-green)/0.3)] focus-within:bg-background",
            isOverLimit && "border-[hsl(var(--destructive)/0.5)]",
          )}>
            {/* Emoji picker */}
            <div className="pl-1 pb-1.5">
              <EmojiPicker onSelect={handleEmojiSelect} />
            </div>
            
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
              className={cn(
                "flex-1 resize-none border-0 bg-transparent",
                "min-h-[40px] max-h-[120px] py-2.5 px-1",
                "placeholder:text-muted-foreground/60",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
              )}
              placeholder={t('inbox.typePlaceholder', 'Typ een bericht...')}
              aria-label={t('inbox.typePlaceholder', 'Typ een bericht...')}
            />

            {/* Quick Reply & Internal Note - inside input */}
            <div className="pr-1 pb-1.5 flex items-center gap-0.5">
              <QuickReplyPicker onSelect={handleQuickReply} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleInternalNote}
                    className="h-8 w-8 rounded-full hover:bg-[hsl(var(--muted))]"
                  >
                    <AtSign className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('inbox.internalNote', 'Interne notitie')}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Send button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleSend}
                disabled={!messageText.trim() || isOverLimit}
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full flex-shrink-0",
                  "bg-[hsl(var(--ka-green))] hover:bg-[hsl(var(--ka-green-dark))]",
                  "disabled:bg-[hsl(var(--muted))] disabled:text-muted-foreground",
                  "transition-all duration-150",
                  messageText.trim() && !isOverLimit && "shadow-md hover:shadow-lg",
                )}
              >
                <Send className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('inbox.send', 'Versturen')} (Ctrl+Enter)
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Keyboard hint - subtle */}
        <div className="text-[10px] text-muted-foreground/50 mt-1.5 text-center sm:text-left">
          <kbd className="px-1 py-0.5 bg-[hsl(var(--muted)/0.5)] rounded text-[9px]">Ctrl</kbd>
          <span className="mx-0.5">+</span>
          <kbd className="px-1 py-0.5 bg-[hsl(var(--muted)/0.5)] rounded text-[9px]">Enter</kbd>
          <span className="ml-1">{t('inbox.toSend', 'om te versturen')}</span>
        </div>
      </footer>
    </div>
  );
};
