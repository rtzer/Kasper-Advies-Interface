import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { InboxFilterDialog } from "@/components/inbox/InboxFilterDialog";
import { FlowbiteConversationItem } from "@/components/inbox/FlowbiteConversationItem";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConversations, useConversationMessages } from "@/lib/api/conversations";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { normalizeChannelForIcon } from "@/lib/utils/channelHelpers";

export default function FlowbiteUnifiedInbox() {
  const { data: conversationsData, isLoading } = useConversations();
  const conversations = conversationsData?.results || [];
  
  const [selectedConversationId, setSelectedConversationId] = useState<string>(conversations[0]?.id || "1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    channel: 'all',
    priority: 'all',
  });
  
  // Get messages for selected conversation
  const { data: messagesData } = useConversationMessages(selectedConversationId);

  const filteredConversations = useMemo(() => {
    if (!conversations.length) return [];
    return conversations.filter((conv) => {
      const matchesSearch = conv.klant_naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.onderwerp?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [conversations, searchQuery]);

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
      {/* Conversation List */}
      <div className="w-96 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Gesprekken
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Alle actieve conversaties met klanten
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setFilterDialogOpen(true)}
                title="Filter gesprekken op status, kanaal en prioriteit"
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button 
                size="icon"
                title="Start nieuwe conversatie"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search - Inbox Specific */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[hsl(var(--conversation-hover))] border-primary/20 focus:border-primary focus:ring-primary/30"
              placeholder="Filter actieve gesprekken..."
              title="Filter gesprekken op naam of onderwerp"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const lastMessageTime = conversation.last_message_at 
                ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true, locale: nl })
                : '';
              
              return (
                <Link key={conversation.id} to={`/unified-inbox/conversation/${conversation.id}`}>
                  <FlowbiteConversationItem
                    id={conversation.id}
                    name={conversation.klant_naam}
                    lastMessage={conversation.onderwerp || 'Geen onderwerp'}
                    timestamp={lastMessageTime}
                    channel={normalizeChannelForIcon(conversation.primary_channel)}
                    unreadCount={conversation.is_unread ? 1 : 0}
                    isActive={conversation.id === selectedConversationId}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
                  />
                </Link>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="mb-1 text-sm font-medium text-foreground">
                Geen gesprekken gevonden
              </h3>
              <p className="text-sm text-muted-foreground">
                Probeer een andere zoekterm
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat View */}
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

      {/* Customer Info Panel */}
      <div className="w-80 bg-card border-l border-border overflow-y-auto">
        <div className="p-6">
          {/* Customer Header */}
          <div className="text-center mb-6">
            <img
              className="w-24 h-24 rounded-full mx-auto mb-4"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation?.klant_naam}`}
              alt={selectedConversation?.klant_naam}
            />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {selectedConversation?.klant_naam}
            </h3>
            <Badge variant="secondary" className={
              selectedConversation?.status === 'open' 
                ? "bg-[hsl(var(--status-online)/0.1)] text-[hsl(var(--status-online))] border-[hsl(var(--status-online)/0.2)]"
                : "bg-[hsl(var(--status-away)/0.1)] text-[hsl(var(--status-away))] border-[hsl(var(--status-away)/0.2)]"
            }>
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
                    to={`/clients/${selectedConversation?.klant_id}`}
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
            <h4 className="text-sm font-semibold text-foreground mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedConversation?.tags && selectedConversation.tags.length > 0 ? (
                selectedConversation.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">{tag}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Geen tags</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
