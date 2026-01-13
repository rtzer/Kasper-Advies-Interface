import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FilterPopover } from "@/components/inbox/FilterPopover";
import { CreateConversationDialog } from "@/components/inbox/CreateConversationDialog";
import { FlowbiteConversationItem } from "@/components/inbox/FlowbiteConversationItem";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";
import { Search, Plus, Inbox, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useConversations, useConversationMessages } from "@/lib/api/conversations";
import { useInboxStats } from "@/lib/api/inboxItems";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { normalizeChannelForIcon } from "@/lib/utils/channelHelpers";
import { useDeviceChecks } from "@/hooks/useBreakpoint";
import { responsiveHeading, responsiveBody } from "@/lib/utils/typography";
import { useUserStore } from "@/store/userStore";

export default function FlowbiteUnifiedInbox() {
  const { channel } = useParams<{ channel?: string }>();
  const { t, i18n } = useTranslation('common');
  const currentLocale = i18n.language === 'en' ? enUS : nl;
  const { isMobile, isTablet } = useDeviceChecks();
  const { currentUser } = useUserStore();
  const { data: conversationsData, isLoading } = useConversations();
  const { data: inboxStats } = useInboxStats();
  const conversations = conversationsData?.results || [];
  
  const [selectedConversationId, setSelectedConversationId] = useState<string>(conversations[0]?.id || "1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    channel: 'all',
    priority: 'all',
    assigned: 'all',
    unreadOnly: false,
    missedCallsOnly: false,
  });

  // Sync channel filter with /app/inbox/channels/:channel
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      channel: channel || 'all',
    }));
  }, [channel]);
  
  // Get messages for selected conversation
  const { data: messagesData } = useConversationMessages(selectedConversationId);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return conversations.filter(c => c.is_unread).length;
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    if (!conversations.length) return [];
    return conversations.filter((conv) => {
      // Search filter
      const matchesSearch = conv.klant_naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.onderwerp?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = filters.status === 'all' || conv.status === filters.status;
      
      // Channel filter
      const matchesChannel =
        filters.channel === 'all' ||
        normalizeChannelForIcon(conv.primary_channel) === filters.channel;
      
      // Priority filter
      const matchesPriority = filters.priority === 'all' || conv.priority === filters.priority;
      
      // Assigned filter
      const matchesAssigned = filters.assigned === 'all' || 
        (filters.assigned === 'me' && conv.toegewezen_aan === currentUser?.naam) ||
        (filters.assigned === 'unassigned' && !conv.toegewezen_aan);
      
      // Unread only filter
      const matchesUnread = !filters.unreadOnly || conv.is_unread;
      
      // Missed calls filter (simulated based on channel and some condition)
      const isMissedCall = normalizeChannelForIcon(conv.primary_channel) === 'phone' && conv.status === 'pending';
      const matchesMissed = !filters.missedCallsOnly || isMissedCall;
      
      return matchesSearch && matchesStatus && matchesChannel && matchesPriority && matchesAssigned && matchesUnread && matchesMissed;
    });
  }, [conversations, searchQuery, filters, currentUser]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  
  // Transform messages to match FlowbiteChatView format
  const transformedMessages = (messagesData?.results || []).map((msg) => ({
    id: msg.id,
    text: msg.content,
    time: new Date(msg.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    isOwn: msg.direction === 'outbound',
    senderName: msg.from.naam,
    hasAttachment: msg.attachments && msg.attachments.length > 0,
    status: msg.delivery_status as 'sent' | 'delivered' | 'read' | undefined,
  }));

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversation List - Always visible, responsive width */}
      <div className={`${
        isMobile ? 'w-full' : isTablet ? 'w-80' : 'w-96'
      } bg-card border-r border-border flex flex-col`}>
        {/* Header - Optimized for 360px */}
        <div className="px-3 xs:px-4 py-3 xs:py-4 border-b border-border">
          <div className="flex items-center justify-between mb-2 xs:mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className={`${responsiveHeading.h4} truncate`}>
                  {t('inbox.conversations')}
                </h2>
                {unreadCount > 0 && (
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <p className={`${responsiveBody.tiny} mt-0.5 truncate`}>
                {t('inbox.allConversations')}
              </p>
            </div>
            <div className="flex gap-1.5 xs:gap-2 flex-shrink-0">
              {/* Link to Inbox Review */}
              {inboxStats && inboxStats.nieuw > 0 && (
                <Link to="/app/inbox/review">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-9 xs:h-10 text-xs gap-1.5 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
                  >
                    <Inbox className="w-4 h-4" />
                    <span className="hidden xs:inline">{inboxStats.nieuw} te reviewen</span>
                    <span className="xs:hidden">{inboxStats.nieuw}</span>
                  </Button>
                </Link>
              )}
              <FilterPopover
                open={filterDialogOpen}
                onOpenChange={setFilterDialogOpen}
                filters={filters}
                onFiltersChange={setFilters}
              />
              <Button 
                size="icon"
                title={t('inbox.newConversation')}
                onClick={() => setCreateDialogOpen(true)}
                className="h-9 w-9 xs:h-10 xs:w-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
              {/* Keyboard shortcuts help */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 xs:h-10 xs:w-10 hidden sm:flex">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="text-xs space-y-1">
                    <p className="font-semibold mb-2">{t('inbox.shortcuts.title', 'Sneltoetsen')}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <span className="text-muted-foreground">Ctrl+K</span>
                      <span>{t('inbox.shortcuts.search', 'Zoeken')}</span>
                      <span className="text-muted-foreground">Ctrl+N</span>
                      <span>{t('inbox.shortcuts.new', 'Nieuw gesprek')}</span>
                      <span className="text-muted-foreground">Ctrl+Enter</span>
                      <span>{t('inbox.shortcuts.send', 'Versturen')}</span>
                      <span className="text-muted-foreground">↑/↓</span>
                      <span>{t('inbox.shortcuts.navigate', 'Navigeren')}</span>
                      <span className="text-muted-foreground">Esc</span>
                      <span>{t('inbox.shortcuts.close', 'Sluiten')}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Search - Compact on mobile */}
          <div className="relative">
            <Search className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 xs:w-4 xs:h-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 xs:pl-10 h-9 xs:h-10 text-xs xs:text-sm bg-[hsl(var(--conversation-hover))] border-primary/20 focus:border-primary focus:ring-primary/30"
              placeholder={isMobile ? "Zoeken..." : t('inbox.searchPlaceholder')}
              title={t('inbox.searchTitle')}
            />
          </div>
        </div>

        {/* Conversations - More compact on mobile */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-2 xs:p-3 sm:p-4 space-y-2 xs:space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 xs:h-20 w-full" />
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const lastMessageTime = conversation.last_message_at 
                ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true, locale: currentLocale })
                : '';
              
              // Check if this is a missed call
              const isMissedCall = conversation.primary_channel === 'Telefoon' && conversation.status === 'pending';
              
              return (
                <Link key={conversation.id} to={`/app/inbox/conversations/${conversation.id}`}>
                  <FlowbiteConversationItem
                    id={conversation.id}
                    name={conversation.klant_naam}
                    lastMessage={conversation.onderwerp || t('inbox.noSubject')}
                    timestamp={lastMessageTime}
                    channel={normalizeChannelForIcon(conversation.primary_channel)}
                    unreadCount={conversation.is_unread ? 1 : 0}
                    isActive={conversation.id === selectedConversationId}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
                    priority={conversation.priority}
                    assignedTo={conversation.toegewezen_aan}
                    tags={conversation.tags}
                    isMissedCall={isMissedCall}
                  />
                </Link>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
              <Search className="w-10 h-10 xs:w-12 xs:h-12 text-muted-foreground mb-2 xs:mb-3" />
              <h3 className={`${responsiveBody.base} font-medium text-foreground mb-1`}>
                {t('inbox.noConversations')}
              </h3>
              <p className={responsiveBody.small}>
                {t('inbox.tryDifferentSearch')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat View - Hidden on mobile (use conversation detail page instead) */}
      {!isMobile && (
        <div className="flex-1 flex flex-col">
          {selectedConversation && (
            <FlowbiteChatView
              conversationName={selectedConversation.klant_naam}
              conversationAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.klant_naam}`}
              channel={normalizeChannelForIcon(selectedConversation.primary_channel)}
              messages={transformedMessages}
              isOnline={selectedConversation.status === 'open'}
              clientId={selectedConversation.klant_id}
            />
          )}
        </div>
      )}

      {/* Customer Info Panel - Only on desktop */}
      {!isMobile && !isTablet && (
        <div className="w-80 bg-card border-l border-border overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Customer Header */}
            <div className="text-center mb-4 sm:mb-6">
              <img
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation?.klant_naam}`}
                alt={selectedConversation?.klant_naam}
              />
              <h3 className={`${responsiveHeading.h4} mb-2`}>
                {selectedConversation?.klant_naam}
              </h3>
              <Badge variant="secondary" className={`text-xs ${
                selectedConversation?.status === 'open' 
                  ? "bg-[hsl(var(--status-online)/0.1)] text-[hsl(var(--status-online))] border-[hsl(var(--status-online)/0.2)]"
                  : "bg-[hsl(var(--status-away)/0.1)] text-[hsl(var(--status-away))] border-[hsl(var(--status-away)/0.2)]"
              }`}>
                <span className={`w-2 h-2 mr-1.5 rounded-full ${
                  selectedConversation?.status === 'open' ? 'bg-[hsl(var(--status-online))]' : 'bg-[hsl(var(--status-away))]'
                }`}></span>
                {selectedConversation?.status === 'open' ? 'Actieve conversatie' : 'Gesloten'}
              </Badge>
            </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Contact Informatie
            </h4>
            <dl className="text-sm text-foreground divide-y divide-border">
              <div className="flex flex-col pb-3">
                <dt className="mb-1 text-muted-foreground">Klant ID</dt>
                <dd className="font-semibold">
                  <Link 
                    to={`/app/clients/${selectedConversation?.klant_id}`}
                    className="hover:text-ka-green transition-colors hover:underline"
                  >
                    {selectedConversation?.klant_id}
                  </Link>
                </dd>
              </div>
              <div className="flex flex-col py-3">
                <dt className="mb-1 text-muted-foreground">Primary Channel</dt>
                <dd className="font-semibold">{selectedConversation?.primary_channel}</dd>
              </div>
              <div className="flex flex-col pt-3">
                <dt className="mb-1 text-muted-foreground">Toegewezen aan</dt>
                <dd className="font-semibold">{selectedConversation?.toegewezen_aan || 'Niet toegewezen'}</dd>
              </div>
            </dl>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Statistieken
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <dt className="mb-1 text-xs text-muted-foreground">Berichten</dt>
                <dd className="text-2xl font-bold text-foreground">{selectedConversation?.message_count || 0}</dd>
              </div>
              <div className="col-span-1">
                <dt className="mb-1 text-xs text-muted-foreground">Prioriteit</dt>
                <dd className="text-2xl font-bold text-foreground capitalize">{selectedConversation?.priority || 'Normal'}</dd>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className={`${responsiveBody.base} font-semibold text-foreground mb-3`}>Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedConversation?.tags && selectedConversation.tags.length > 0 ? (
                selectedConversation.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                ))
              ) : (
                <p className={`${responsiveBody.small} text-muted-foreground`}>Geen tags</p>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Create Conversation Dialog */}
      <CreateConversationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
