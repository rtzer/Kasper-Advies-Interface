import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { InboxItem } from '@/types';
import { useMatchInboxItem, useCreateClientFromInbox, useMarkAsSpam, useUpdateInboxItem } from '@/lib/api/inboxItems';
import { mockKlanten } from '@/lib/mockData';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, Mail, MessageSquare, User, Building2, Clock, 
  CheckCircle, UserPlus, Ban, Search, ArrowRight, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InboxDetailPanelProps {
  item: InboxItem | null;
  onProcessed: () => void;
}

const channelConfig = {
  'Telefoon': { icon: Phone, colorClass: 'text-channel-phone', label: 'Telefoon' },
  'E-mail': { icon: Mail, colorClass: 'text-channel-email', label: 'E-mail' },
  'WhatsApp': { icon: MessageSquare, colorClass: 'text-channel-whatsapp', label: 'WhatsApp' },
};

export function InboxDetailPanel({ item, onProcessed }: InboxDetailPanelProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const matchItem = useMatchInboxItem();
  const createClient = useCreateClientFromInbox();
  const markAsSpam = useMarkAsSpam();
  const updateItem = useUpdateInboxItem();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showClientSearch, setShowClientSearch] = useState(false);

  if (!item) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>{t('inboxReview.selectItem')}</p>
        </div>
      </div>
    );
  }

  const channel = channelConfig[item.kanaal];
  const ChannelIcon = channel.icon;
  const isProcessed = item.status !== 'Nieuw' && item.status !== 'In behandeling';

  // Filter clients based on search
  const filteredClients = searchQuery.length >= 2
    ? mockKlanten.filter(k => 
        k.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.telefoonnummer?.includes(searchQuery)
      ).slice(0, 5)
    : [];

  const handleConfirmSuggested = async () => {
    if (!item.suggested_klant_id || !item.suggested_klant_naam) return;
    
    try {
      await matchItem.mutateAsync({
        id: item.id,
        klantId: item.suggested_klant_id,
        klantNaam: item.suggested_klant_naam,
      });
      toast.success(t('inboxReview.matched'));
      onProcessed();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleSelectClient = async (klantId: string, klantNaam: string) => {
    try {
      await matchItem.mutateAsync({
        id: item.id,
        klantId,
        klantNaam,
      });
      toast.success(t('inboxReview.matched'));
      setShowClientSearch(false);
      setSearchQuery('');
      onProcessed();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleCreateNewClient = async () => {
    try {
      await createClient.mutateAsync({ id: item.id });
      toast.success(t('inboxReview.clientCreated'));
      onProcessed();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleMarkAsSpam = async () => {
    try {
      await markAsSpam.mutateAsync({ id: item.id });
      toast.success(t('inboxReview.markedAsSpam'));
      onProcessed();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleStartProcessing = async () => {
    try {
      await updateItem.mutateAsync({
        id: item.id,
        data: { status: 'In behandeling' },
      });
    } catch (error) {
      // Ignore
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn('p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm', channel.colorClass)}>
            <ChannelIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {item.raw_naam || item.raw_afzender}
            </h2>
            <p className="text-sm text-muted-foreground">{item.inbox_id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {format(new Date(item.timestamp), 'PPp', { locale })}
          </div>
          <Badge variant="outline">{channel.label}</Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Message content */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('inboxReview.messageContent')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {item.raw_onderwerp && (
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground">{t('inboxReview.subject')}: </span>
                  <span className="font-medium">{item.raw_onderwerp}</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-lg">
                {item.raw_content}
              </div>
            </CardContent>
          </Card>

          {/* Sender info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('inboxReview.senderInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <ChannelIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{item.raw_afzender}</span>
              </div>
              {item.raw_naam && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{item.raw_naam}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Match suggestion */}
          {item.suggested_klant_id && !isProcessed && (
            <Card className="border-ka-green/50 bg-ka-green/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ka-green" />
                  {t('inboxReview.suggestedMatch')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.suggested_klant_naam}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.match_details} ({item.match_score}% {t('inboxReview.confidence')})
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleConfirmSuggested}
                    disabled={matchItem.isPending}
                    className="bg-ka-green hover:bg-ka-green/90"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t('inboxReview.confirm')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processed info */}
          {isProcessed && (
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-ka-green" />
                  <span>
                    {item.status === 'Gematcht' && (
                      <>{t('inboxReview.matchedTo')}: <strong>{item.matched_klant_naam}</strong></>
                    )}
                    {item.status === 'Nieuwe klant aangemaakt' && (
                      <>{t('inboxReview.newClientCreated')}</>
                    )}
                    {item.status === 'Spam' && (
                      <>{t('inboxReview.markedAsSpamStatus')}</>
                    )}
                  </span>
                </div>
                {item.reviewed_by && item.reviewed_at && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('inboxReview.reviewedBy')} {item.reviewed_by} {t('inboxReview.on')} {format(new Date(item.reviewed_at), 'Pp', { locale })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Actions */}
      {!isProcessed && (
        <div className="p-4 border-t bg-background space-y-3">
          {/* Manual search toggle */}
          {!showClientSearch ? (
            <div className="flex flex-wrap gap-2">
              {item.suggested_klant_id && (
                <Button 
                  onClick={handleConfirmSuggested}
                  disabled={matchItem.isPending}
                  className="bg-ka-green hover:bg-ka-green/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('inboxReview.confirmMatch')}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => { setShowClientSearch(true); handleStartProcessing(); }}
              >
                <Search className="w-4 h-4 mr-2" />
                {t('inboxReview.searchClient')}
              </Button>
              <Button 
                variant="outline"
                onClick={handleCreateNewClient}
                disabled={createClient.isPending}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {t('inboxReview.createClient')}
              </Button>
              <Button 
                variant="ghost" 
                className="text-destructive hover:text-destructive"
                onClick={handleMarkAsSpam}
                disabled={markAsSpam.isPending}
              >
                <Ban className="w-4 h-4 mr-2" />
                {t('inboxReview.markSpam')}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t('inboxReview.searchClientPlaceholder')}
                    className="pl-9"
                    autoFocus
                  />
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowClientSearch(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
              
              {filteredClients.length > 0 && (
                <div className="border rounded-lg divide-y">
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      className="p-2 hover:bg-muted/50 cursor-pointer flex items-center justify-between"
                      onClick={() => handleSelectClient(client.id, client.naam)}
                    >
                      <div>
                        <div className="font-medium text-sm">{client.naam}</div>
                        <div className="text-xs text-muted-foreground">{client.email}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              )}
              
              {searchQuery.length >= 2 && filteredClients.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  {t('inboxReview.noClientsFound')}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
