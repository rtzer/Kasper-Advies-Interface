import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Video, Mail, Archive, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types';
import { getChannelIcon, getChannelBadgeClass } from '@/lib/utils/channelHelpers';
import { formatTime } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { useConversationMessages } from '@/lib/api';

interface MessageThreadProps {
  conversation: Conversation;
}

export default function MessageThread({ conversation }: MessageThreadProps) {
  const { t } = useTranslation(['common']);
  const { currentUser } = useUserStore();
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get all messages for this conversation
  const { data: messagesData } = useConversationMessages(conversation.id);
  const messages = messagesData?.results || [];
  
  // Scroll to bottom on load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!replyText.trim()) return;
    console.log('Sending:', replyText);
    setReplyText('');
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-ka-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Client avatar */}
            <div className="w-10 h-10 rounded-full bg-ka-navy dark:bg-ka-green text-white flex items-center justify-center font-medium flex-shrink-0">
              {conversation.klant_naam.substring(0, 2).toUpperCase()}
            </div>
            
            {/* Client info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-ka-gray-900 dark:text-white truncate">
                  {conversation.klant_naam}
                </h2>
                <Badge className={getChannelBadgeClass(conversation.primary_channel)}>
                  <span className="mr-1">{getChannelIcon(conversation.primary_channel)}</span>
                  {conversation.primary_channel}
                </Badge>
              </div>
              <p className="text-sm text-ka-gray-500 dark:text-gray-400 truncate">
                {conversation.onderwerp}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button variant="ghost" size="icon" title="Bellen">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Videogesprek">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Email sturen">
              <Mail className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Archiveren">
              <Archive className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Meer opties">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-ka-gray-50 dark:bg-gray-900">
        {messages.map((msg) => {
          const isOutbound = msg.direction === 'outbound';
          
          return (
            <div key={msg.id} className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${isOutbound ? 'order-2' : 'order-1'}`}>
                {/* Sender name & time */}
                <div className={`flex items-center space-x-2 mb-1 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs font-medium text-ka-gray-600 dark:text-gray-300">
                    {isOutbound ? msg.from.naam : msg.from.naam}
                  </span>
                  <span className="text-xs text-ka-gray-500 dark:text-gray-400">
                    {formatTime(msg.timestamp)}
                  </span>
                  <span className="text-sm">{getChannelIcon(msg.channel)}</span>
                </div>
                
                {/* Message bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                  isOutbound 
                    ? 'bg-ka-green text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-gray-800 border border-ka-gray-200 dark:border-gray-700 text-ka-gray-900 dark:text-white rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  
                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className={`mt-2 pt-2 ${isOutbound ? 'border-t border-white/20' : 'border-t border-ka-gray-200 dark:border-gray-700'}`}>
                      {msg.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm hover:underline"
                        >
                          <Paperclip className="w-4 h-4" />
                          <span>{att.filename}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Delivery status for outbound */}
                {isOutbound && (
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-ka-gray-500 dark:text-gray-400">
                      {msg.delivery_status === 'read' ? '✓✓' : msg.delivery_status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Composer */}
      <div className="bg-white dark:bg-gray-800 border-t border-ka-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Typ een antwoord..."
              className="min-h-[80px] resize-none bg-white dark:bg-gray-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Bijlage
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSend}
            disabled={!replyText.trim()}
            className="bg-ka-green hover:bg-ka-green/90 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Versturen
          </Button>
        </div>
      </div>
    </div>
  );
}
