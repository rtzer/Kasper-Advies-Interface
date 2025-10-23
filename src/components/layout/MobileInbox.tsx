import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConversationItem from '@/components/inbox/ConversationItem';
import MessageThread from '@/components/inbox/MessageThread';
import { useConversationStore } from '@/store/conversationStore';
import { useConversations } from '@/lib/api/conversations';

export default function MobileInbox() {
  const { selectedConversation, setSelectedConversation } = useConversationStore();
  const [view, setView] = useState<'list' | 'thread'>('list');
  const { data: conversations, isLoading } = useConversations();
  
  const handleBack = () => {
    setView('list');
    setSelectedConversation(null);
  };
  
  const handleSelectConversation = (conv: any) => {
    setSelectedConversation(conv);
    setView('thread');
  };
  
  if (view === 'thread' && selectedConversation) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-ka-gray-200 dark:border-gray-700 px-4 py-3 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold text-ka-navy dark:text-white truncate">
              {selectedConversation.klant_naam}
            </h2>
          </div>
        </div>
        <MessageThread conversation={selectedConversation} />
      </div>
    );
  }
  
  return (
    <div className="h-full bg-ka-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-ka-gray-200 dark:border-gray-700 px-4 py-4">
        <h1 className="text-xl font-bold text-ka-navy dark:text-white">Inbox</h1>
      </div>
      
      <div className="overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center text-ka-gray-500 dark:text-gray-400">
            Laden...
          </div>
        ) : !conversations?.results.length ? (
          <div className="p-6 text-center text-ka-gray-500 dark:text-gray-400">
            Geen gesprekken gevonden
          </div>
        ) : (
          <div className="divide-y divide-ka-gray-200 dark:divide-gray-700">
            {conversations.results.map((conv) => (
              <div key={conv.id} onClick={() => handleSelectConversation(conv)}>
                <ConversationItem conversation={conv} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
