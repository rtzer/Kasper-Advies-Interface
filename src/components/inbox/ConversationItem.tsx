import { Badge } from '@/components/ui/badge';
import { Conversation } from '@/types';
import { useConversationStore } from '@/store/conversationStore';
import { getChannelIcon } from '@/lib/utils/channelHelpers';
import { formatRelativeTime } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';

interface ConversationItemProps {
  conversation: Conversation;
}

export default function ConversationItem({ conversation }: ConversationItemProps) {
  const { selectedConversation, setSelectedConversation } = useConversationStore();
  const { currentUser } = useUserStore();
  const isSelected = selectedConversation?.id === conversation.id;
  
  return (
    <button
      onClick={() => setSelectedConversation(conversation)}
      className={`w-full p-4 border-b border-ka-gray-200 dark:border-gray-700 hover:bg-ka-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
        isSelected ? 'bg-ka-green/10 dark:bg-ka-green/20 border-l-4 border-l-ka-green' : ''
      } ${conversation.is_unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          {/* Client name */}
          <div className="flex items-center space-x-2 mb-1">
            <h3 className={`text-sm font-medium text-ka-gray-900 dark:text-white truncate ${
              conversation.is_unread ? 'font-semibold' : ''
            }`}>
              {conversation.klant_naam}
            </h3>
            {conversation.is_unread && (
              <span className="w-2 h-2 bg-ka-green rounded-full flex-shrink-0"></span>
            )}
          </div>
          
          {/* Subject */}
          <p className="text-sm text-ka-gray-600 dark:text-gray-300 truncate">
            {conversation.onderwerp}
          </p>
        </div>
        
        {/* Time & channel */}
        <div className="flex flex-col items-end ml-2 space-y-1 flex-shrink-0">
          <span className="text-xs text-ka-gray-500 dark:text-gray-400">
            {formatRelativeTime(conversation.last_message_at, currentUser?.language || 'nl')}
          </span>
          <span 
            className="text-lg"
            title={conversation.primary_channel}
          >
            {getChannelIcon(conversation.primary_channel)}
          </span>
        </div>
      </div>
      
      {/* Message count & badges */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-ka-gray-500 dark:text-gray-400">
          {conversation.message_count} {conversation.message_count === 1 ? 'bericht' : 'berichten'}
        </p>
        
        {conversation.opvolging_nodig && (
          <Badge variant="destructive" className="ml-2 text-xs">
            Opvolging
          </Badge>
        )}
        
        {conversation.priority === 'urgent' && (
          <Badge className="ml-2 text-xs bg-red-600">
            Urgent
          </Badge>
        )}
      </div>
      
      {/* Tags */}
      {conversation.tags && conversation.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {conversation.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {conversation.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{conversation.tags.length - 2}
            </Badge>
          )}
        </div>
      )}
    </button>
  );
}
