import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInboxItems, useInboxStats } from '@/lib/api/inboxItems';
import { InboxItem, InboxItemStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { InboxItemCard } from '@/components/inbox-review/InboxItemCard';
import { InboxDetailPanel } from '@/components/inbox-review/InboxDetailPanel';
import { Inbox, Phone, Mail, MessageSquare, AlertCircle } from 'lucide-react';

type TabValue = 'nieuw' | 'behandeling' | 'afgehandeld' | 'spam';
type SortValue = 'newest' | 'oldest' | 'match_score';

export default function InboxReviewPage() {
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState<TabValue>('nieuw');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortValue>('newest');
  const [selectedItem, setSelectedItem] = useState<InboxItem | null>(null);

  const { data: stats } = useInboxStats();
  
  const statusMap: Record<TabValue, InboxItemStatus | undefined> = {
    'nieuw': 'Nieuw',
    'behandeling': 'In behandeling',
    'afgehandeld': 'Gematcht',
    'spam': 'Spam',
  };

  const { data: items = [], isLoading } = useInboxItems({
    status: statusMap[activeTab],
    kanaal: channelFilter !== 'all' ? channelFilter as InboxItem['kanaal'] : undefined,
    sortBy,
  });

  const handleItemProcessed = () => {
    // Clear selection and refresh will happen via query invalidation
    setSelectedItem(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{t('inboxReview.title')}</h1>
          {stats && stats.nieuw > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {stats.nieuw}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{t('inboxReview.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Tabs value={activeTab} onValueChange={v => { setActiveTab(v as TabValue); setSelectedItem(null); }}>
          <TabsList>
            <TabsTrigger value="nieuw" className="gap-2">
              {t('inboxReview.tabs.new')}
              {stats && stats.nieuw > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5">{stats.nieuw}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="behandeling" className="gap-2">
              {t('inboxReview.tabs.inProgress')}
              {stats && stats.inBehandeling > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5">{stats.inBehandeling}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="afgehandeld">
              {t('inboxReview.tabs.processed')}
            </TabsTrigger>
            <TabsTrigger value="spam">
              {t('inboxReview.tabs.spam')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="ml-auto flex items-center gap-2">
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('inboxReview.channel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('inboxReview.allChannels')}</SelectItem>
              <SelectItem value="Telefoon">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('inboxReview.phone')}
                </div>
              </SelectItem>
              <SelectItem value="E-mail">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('inboxReview.email')}
                </div>
              </SelectItem>
              <SelectItem value="WhatsApp">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={v => setSortBy(v as SortValue)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('inboxReview.sort.newest')}</SelectItem>
              <SelectItem value="oldest">{t('inboxReview.sort.oldest')}</SelectItem>
              <SelectItem value="match_score">{t('inboxReview.sort.matchScore')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Split view */}
      <div className="flex border rounded-lg bg-card h-[calc(100%-120px)] overflow-hidden">
        {/* Left panel - List */}
        <div className="w-96 border-r flex flex-col">
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <Inbox className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-center">{t('inboxReview.noItems')}</p>
              </div>
            ) : (
              items.map(item => (
                <InboxItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItem?.id === item.id}
                  onClick={() => setSelectedItem(item)}
                />
              ))
            )}
          </ScrollArea>
        </div>

        {/* Right panel - Detail */}
        <InboxDetailPanel item={selectedItem} onProcessed={handleItemProcessed} />
      </div>
    </div>
  );
}
