import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ConversationItem from './ConversationItem';
import ConversationFilters from './ConversationFilters';
import { Conversation } from '@/types';
import { useConversationStore } from '@/store/conversationStore';

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
}

export default function ConversationList({ conversations, isLoading }: ConversationListProps) {
  const { t, i18n } = useTranslation(['common', 'navigation']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { filterChannel, filterStatus } = useConversationStore();
  
  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      conv.klant_naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.onderwerp.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Channel filter
    const matchesChannel = !filterChannel || conv.primary_channel === filterChannel;
    
    // Status filter
    const matchesStatus = !filterStatus || conv.status === filterStatus;
    
    return matchesSearch && matchesChannel && matchesStatus;
  });
  
  // Group by date
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const groupedConversations = filteredConversations.reduce((groups, conv) => {
    const date = conv.created_at.split('T')[0];
    let label = date;
    
    if (date === today) {
      label = t('common:time.today');
    } else if (date === yesterday) {
      label = t('common:time.yesterday');
    } else {
      label = new Date(date).toLocaleDateString(
        i18n.language === 'nl' ? 'nl-NL' : 'en-US',
        { weekday: 'short', month: 'short', day: 'numeric' }
      );
    }
    
    if (!groups[label]) groups[label] = [];
    groups[label].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);
  
  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-ka-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-ka-navy dark:text-white">
            {t('navigation:menu.inbox')}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'text-ka-green' : ''}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ka-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder={t('common:actions.search') + '...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700"
          />
        </div>
        
        {/* Filters */}
        {showFilters && (
          <ConversationFilters />
        )}
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="p-4 text-center text-ka-gray-500 dark:text-gray-400">
            {t('common:loading')}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-ka-gray-500 dark:text-gray-400">
            Geen gesprekken gevonden
          </div>
        ) : (
          Object.entries(groupedConversations).map(([label, convs]) => (
            <div key={label}>
              {/* Date header */}
              <div className="sticky top-0 bg-ka-gray-100 dark:bg-gray-700 px-4 py-2 text-xs font-medium text-ka-gray-600 dark:text-gray-300 uppercase tracking-wider z-10">
                {label}
              </div>
              
              {/* Conversations */}
              {convs.map((conv) => (
                <ConversationItem key={conv.id} conversation={conv} />
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}
