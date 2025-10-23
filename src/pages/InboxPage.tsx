import { useTranslation } from 'react-i18next';
import { Inbox } from 'lucide-react';
import ConversationList from '@/components/inbox/ConversationList';
import MessageThread from '@/components/inbox/MessageThread';
import ClientContextPanel from '@/components/inbox/ClientContextPanel';
import { useConversationStore } from '@/store/conversationStore';
import { useConversations } from '@/lib/api';

export default function InboxPage() {
  const { t } = useTranslation(['navigation']);
  const { selectedConversation } = useConversationStore();
  const { data: conversations, isLoading } = useConversations();
  
  return (
    <div className="h-full flex bg-ka-gray-50 dark:bg-gray-900">
      {/* LEFT: Conversation List */}
      <div className="w-80 lg:w-96 border-r border-ka-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
        <ConversationList 
          conversations={conversations?.results || []}
          isLoading={isLoading}
        />
      </div>
      
      {/* CENTER: Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <MessageThread conversation={selectedConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-ka-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Inbox className="w-16 h-16 mx-auto mb-4 text-ka-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">
                {t('navigation:menu.inbox')}
              </p>
              <p className="text-sm mt-2">
                Selecteer een gesprek om te beginnen
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* RIGHT: Client Context Panel */}
      {selectedConversation && (
        <div className="w-96 border-l border-ka-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto hidden xl:block">
          <ClientContextPanel klantId={selectedConversation.klant_id} />
        </div>
      )}
    </div>
  );
}
