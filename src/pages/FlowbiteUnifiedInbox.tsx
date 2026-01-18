import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FilterPopover } from "@/components/inbox/FilterPopover";
import { CreateConversationDialog } from "@/components/inbox/CreateConversationDialog";
import { FlowbiteConversationItem } from "@/components/inbox/FlowbiteConversationItem";
import { FlowbiteChatView } from "@/components/inbox/FlowbiteChatView";
import { Search, Plus, Inbox, HelpCircle, X, MessageSquare, Lock, User, MessageCircle, Hash, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConversations, useConversationMessages } from "@/lib/api/conversations";
import { useInboxStats } from "@/lib/api/inboxItems";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import { normalizeChannelForIcon } from "@/lib/utils/channelHelpers";
import { useDeviceChecks } from "@/hooks/useBreakpoint";
import { responsiveHeading, responsiveBody } from "@/lib/utils/typography";
import { useUserStore } from "@/store/userStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// WhatsApp-style empty state when no conversation is selected
function EmptyInboxState() {
  const { t } = useTranslation(['common', 'translation']);
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[hsl(var(--muted)/0.3)] relative overflow-hidden">
      {/* Subtle pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-md text-center px-6">
        {/* Illustration */}
        <div className="mb-8 relative">
          <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-[hsl(var(--ka-green)/0.15)] to-[hsl(var(--ka-green)/0.05)] flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[hsl(var(--ka-green)/0.3)] to-[hsl(var(--ka-green)/0.1)] flex items-center justify-center">
              <MessageSquare className="w-16 h-16 text-[hsl(var(--ka-green))]" strokeWidth={1.5} />
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-16 w-3 h-3 rounded-full bg-[hsl(var(--ka-green)/0.4)] animate-pulse" />
          <div className="absolute bottom-8 left-20 w-2 h-2 rounded-full bg-[hsl(var(--ka-green)/0.3)] animate-pulse delay-150" />
          <div className="absolute top-12 left-12 w-2.5 h-2.5 rounded-full bg-[hsl(var(--ka-green)/0.25)] animate-pulse delay-300" />
        </div>

        {/* Text content */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('translation:inbox.emptyState.title', 'Kaspers Advies Berichten')}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {t('translation:inbox.emptyState.description', 'Selecteer een gesprek uit de lijst om berichten te bekijken en te reageren op uw klanten.')}
        </p>

        {/* Security note - WhatsApp style */}
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/70 bg-[hsl(var(--muted))] px-4 py-2 rounded-full">
          <Lock className="w-3.5 h-3.5" />
          <span>{t('translation:inbox.emptyState.securityNote', 'Berichten zijn beveiligd en versleuteld')}</span>
        </div>
      </div>
    </div>
  );
}

export default function FlowbiteUnifiedInbox() {
  const { id } = useParams<{ id?: string }>();
  const { t, i18n } = useTranslation(['common', 'translation']);
  const currentLocale = i18n.language === 'en' ? enUS : nl;
  const { isMobile, isTablet } = useDeviceChecks();
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { data: conversationsData, isLoading } = useConversations();
  const { data: inboxStats } = useInboxStats();
  const conversations = conversationsData?.results || [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [contactSheetOpen, setContactSheetOpen] = useState(false);
  const [reviewBannerDismissed, setReviewBannerDismissed] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    channel: 'all',
    priority: 'all',
    assigned: 'all',
    unreadOnly: false,
    missedCallsOnly: false,
  });

  // Only resolve to an ID if the user has explicitly selected a conversation via URL param
  const resolvedConversationId = useMemo(() => {
    if (id && conversations.some((c) => c.id === id)) return id;
    return null; // Don't auto-select first conversation
  }, [conversations, id]);

  const handleSelectConversation = (conversationId: string, options?: { replace?: boolean }) => {
    navigate(`/app/inbox/conversations/${conversationId}`, { replace: options?.replace ?? false });
  };
  
  // Get messages for selected conversation (only if one is selected)
  const { data: messagesData } = useConversationMessages(resolvedConversationId || '');

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

  const selectedConversation = conversations.find((c) => c.id === resolvedConversationId);
  
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
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Conversation List Sidebar */}
      <aside className={cn(
        "flex flex-col bg-card border-r border-border",
        isMobile ? 'w-72' : isTablet ? 'w-80' : 'w-[360px] lg:w-[400px]',
      )}>
        {/* Header */}
        <header className="px-3 sm:px-4 py-3 sm:py-4 border-b border-border/50 bg-card/95 backdrop-blur-sm sticky top-0 z-10">
          {/* Title row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                {t('inbox.conversations')}
              </h1>
              {unreadCount > 0 && (
                <Badge 
                  variant="default" 
                  className="bg-[hsl(var(--ka-green))] text-white h-5 min-w-[20px] px-1.5 text-xs font-semibold"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <FilterPopover
                open={filterDialogOpen}
                onOpenChange={setFilterDialogOpen}
                filters={filters}
                onFiltersChange={setFilters}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon"
                    onClick={() => setCreateDialogOpen(true)}
                    className="h-9 w-9 rounded-full bg-[hsl(var(--ka-green))] hover:bg-[hsl(var(--ka-green-dark))] shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('inbox.newConversation')}</TooltipContent>
              </Tooltip>
              
              {/* Keyboard shortcuts help */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full hidden sm:flex hover:bg-[hsl(var(--muted))]"
                  >
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end" className="max-w-xs p-3">
                  <div className="text-xs space-y-2">
                    <p className="font-semibold text-sm">{t('translation:inbox.shortcuts.title')}</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                      <span className="text-muted-foreground">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">K</kbd>
                      </span>
                      <span>{t('translation:inbox.shortcuts.search')}</span>
                      <span className="text-muted-foreground">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">N</kbd>
                      </span>
                      <span>{t('translation:inbox.shortcuts.new')}</span>
                      <span className="text-muted-foreground">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑</kbd>/<kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↓</kbd>
                      </span>
                      <span>{t('translation:inbox.shortcuts.navigate')}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {/* Inbox review banner */}
          {inboxStats && inboxStats.nieuw > 0 && !reviewBannerDismissed && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-[hsl(var(--priority-high)/0.1)] border border-[hsl(var(--priority-high)/0.2)]">
              <Link to="/app/inbox/review" className="flex-1 flex items-center gap-2 group">
                <div className="p-1.5 rounded-full bg-[hsl(var(--priority-high)/0.15)]">
                  <Inbox className="w-4 h-4 text-[hsl(var(--priority-high))]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[hsl(var(--priority-high))] group-hover:underline">
                    {inboxStats.nieuw} {t('inbox.toReview', 'berichten te beoordelen')}
                  </p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-[hsl(var(--priority-high)/0.15)]"
                onClick={() => setReviewBannerDismissed(true)}
                aria-label={t('actions.close', 'Sluiten')}
              >
                <X className="w-3.5 h-3.5 text-[hsl(var(--priority-high))]" />
              </Button>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 h-10 text-sm",
                "bg-[hsl(var(--muted)/0.5)] border-transparent",
                "placeholder:text-muted-foreground/60",
                "focus:bg-background focus:border-[hsl(var(--ka-green)/0.3)] focus:ring-[hsl(var(--ka-green)/0.2)]",
                "rounded-xl transition-all",
              )}
              placeholder={t('inbox.searchPlaceholder')}
              aria-label={t('inbox.searchTitle')}
            />
          </div>
        </header>

        {/* Conversation list */}
        <nav 
          className="flex-1 overflow-y-auto scrollbar-hide"
          role="listbox"
          aria-label={t('inbox.conversationList', 'Gesprekkenlijst')}
        >
          {isLoading ? (
            <div className="p-3 space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="py-1">
              {filteredConversations.map((conversation) => {
                const lastMessageTime = conversation.last_message_at 
                  ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true, locale: currentLocale })
                  : '';
                
                const isMissedCall = conversation.primary_channel === 'Telefoon' && conversation.status === 'pending';
                
                return (
                  <FlowbiteConversationItem
                    key={conversation.id}
                    id={conversation.id}
                    name={conversation.klant_naam}
                    lastMessage={conversation.onderwerp || t('inbox.noSubject')}
                    timestamp={lastMessageTime}
                    channel={normalizeChannelForIcon(conversation.primary_channel)}
                    unreadCount={conversation.is_unread ? 1 : 0}
                    isActive={conversation.id === resolvedConversationId}
                    onClick={() => handleSelectConversation(conversation.id)}
                    avatarUrl={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.klant_naam}`}
                    priority={conversation.priority}
                    assignedTo={conversation.toegewezen_aan}
                    tags={conversation.tags}
                    isMissedCall={isMissedCall}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-base font-medium text-foreground mb-1">
                {t('inbox.noConversations')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                {t('inbox.tryDifferentSearch')}
              </p>
            </div>
          )}
        </nav>
      </aside>

      {/* Chat View (always visible as 2nd column) */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <FlowbiteChatView
            conversationName={selectedConversation.klant_naam}
            conversationAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.klant_naam}`}
            channel={normalizeChannelForIcon(selectedConversation.primary_channel)}
            messages={transformedMessages}
            isOnline={selectedConversation.status === 'open'}
            clientId={selectedConversation.klant_id}
            onProfileClick={() => setContactSheetOpen(true)}
          />
        ) : (
          <EmptyInboxState />
        )}
      </div>

      {/* Create Conversation Dialog */}
      <CreateConversationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Contact info sheet - Modern WhatsApp-style design */}
      <Sheet open={contactSheetOpen} onOpenChange={setContactSheetOpen}>
        <SheetContent className="w-[340px] sm:w-[380px] p-0 overflow-y-auto">
          <SheetHeader className="sr-only">
            <SheetTitle>{t('inbox.contactInfo', 'Contactinformatie')}</SheetTitle>
          </SheetHeader>
          
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-b from-[hsl(var(--ka-green)/0.15)] to-transparent pt-6 pb-4 px-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 ring-4 ring-white dark:ring-gray-900 shadow-lg mb-4">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation?.klant_naam}`}
                  alt=""
                />
                <AvatarFallback className="text-2xl bg-[hsl(var(--ka-green)/0.2)] text-[hsl(var(--ka-green))]">
                  {selectedConversation?.klant_naam?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {selectedConversation?.klant_naam}
              </h2>
              
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  selectedConversation?.status === 'open'
                    ? "bg-[hsl(var(--status-online)/0.15)] text-[hsl(var(--status-online))] border-0"
                    : "bg-[hsl(var(--muted))] text-muted-foreground border-0"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 mr-1.5 rounded-full",
                    selectedConversation?.status === 'open'
                      ? 'bg-[hsl(var(--status-online))]'
                      : 'bg-muted-foreground'
                  )}
                />
                {selectedConversation?.status === 'open' 
                  ? t('inbox.activeConversation', 'Actieve conversatie') 
                  : t('inbox.closedConversation', 'Gesloten')}
              </Badge>
              
              {/* Quick action */}
              {selectedConversation?.klant_id && (
                <Link
                  to={`/app/clients/${selectedConversation.klant_id}`}
                  onClick={() => setContactSheetOpen(false)}
                  className="mt-4"
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 rounded-full hover:bg-[hsl(var(--ka-green)/0.1)] hover:text-[hsl(var(--ka-green))] hover:border-[hsl(var(--ka-green)/0.3)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('inbox.viewClientProfile', 'Bekijk klantprofiel')}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Content sections */}
          <div className="px-6 pb-6 space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[hsl(var(--muted)/0.5)] text-center">
                <MessageCircle className="w-5 h-5 mx-auto mb-2 text-[hsl(var(--ka-green))]" />
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {selectedConversation?.message_count || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('inbox.messages', 'Berichten')}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[hsl(var(--muted)/0.5)] text-center">
                <Hash className="w-5 h-5 mx-auto mb-2 text-[hsl(var(--ka-green))]" />
                <p className={cn(
                  "text-lg font-bold capitalize",
                  selectedConversation?.priority === 'urgent' && "text-[hsl(var(--priority-urgent))]",
                  selectedConversation?.priority === 'high' && "text-[hsl(var(--priority-high))]",
                  (!selectedConversation?.priority || selectedConversation?.priority === 'normal') && "text-foreground",
                )}>
                  {selectedConversation?.priority || 'Normal'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('inbox.priority', 'Prioriteit')}
                </p>
              </div>
            </div>

            {/* Contact info */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t('inbox.contactInfo', 'Contactinformatie')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                  <div className="p-2 rounded-full bg-[hsl(var(--ka-green)/0.1)]">
                    <User className="w-4 h-4 text-[hsl(var(--ka-green))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{t('inbox.clientId', 'Klant ID')}</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedConversation?.klant_id || '-'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                  <div className="p-2 rounded-full bg-[hsl(var(--ka-green)/0.1)]">
                    <MessageSquare className="w-4 h-4 text-[hsl(var(--ka-green))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{t('inbox.channel', 'Kanaal')}</p>
                    <p className="text-sm font-medium text-foreground capitalize truncate">
                      {selectedConversation?.primary_channel || '-'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--muted)/0.3)] hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                  <div className="p-2 rounded-full bg-[hsl(var(--ka-green)/0.1)]">
                    <User className="w-4 h-4 text-[hsl(var(--ka-green))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{t('inbox.assignedTo', 'Toegewezen aan')}</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedConversation?.toegewezen_aan || t('inbox.notAssigned', 'Niet toegewezen')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t('inbox.tags', 'Tags')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedConversation?.tags && selectedConversation.tags.length > 0 ? (
                  selectedConversation.tags.map((tag, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--muted))] hover:bg-[hsl(var(--ka-green)/0.1)] hover:text-[hsl(var(--ka-green))] transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {t('inbox.noTags', 'Geen tags toegevoegd')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
