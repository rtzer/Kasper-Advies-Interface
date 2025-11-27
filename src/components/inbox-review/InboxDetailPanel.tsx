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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Phone, Mail, MessageSquare, User, Clock, 
  CheckCircle, UserPlus, Ban, Search, Sparkles, X, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InboxDetailPanelProps {
  item: InboxItem | null;
  onProcessed: () => void;
}

const channelConfig = {
  'Telefoon': { icon: Phone, colorClass: 'text-channel-phone', bgClass: 'bg-blue-50 dark:bg-blue-950/30', label: 'Telefoon' },
  'E-mail': { icon: Mail, colorClass: 'text-channel-email', bgClass: 'bg-red-50 dark:bg-red-950/30', label: 'E-mail' },
  'WhatsApp': { icon: MessageSquare, colorClass: 'text-channel-whatsapp', bgClass: 'bg-green-50 dark:bg-green-950/30', label: 'WhatsApp' },
};

export function InboxDetailPanel({ item, onProcessed }: InboxDetailPanelProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const matchItem = useMatchInboxItem();
  const createClient = useCreateClientFromInbox();
  const markAsSpam = useMarkAsSpam();
  const updateItem = useUpdateInboxItem();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientNaam, setSelectedClientNaam] = useState<string | null>(null);
  const [showSpamConfirm, setShowSpamConfirm] = useState(false);
  const [suggestionRejected, setSuggestionRejected] = useState(false);

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
        k.telefoonnummer?.includes(searchQuery) ||
        k.klant_nummer?.toLowerCase().includes(searchQuery.toLowerCase())
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
      toast.success(
        t('inboxReview.matchedToast', { name: item.suggested_klant_naam }),
        {
          action: {
            label: t('inboxReview.viewInteraction'),
            onClick: () => console.log('Navigate to interaction'),
          },
        }
      );
      onProcessed();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleRejectSuggestion = () => {
    setSuggestionRejected(true);
  };

  const handleSelectClient = (klantId: string, klantNaam: string) => {
    setSelectedClientId(klantId);
    setSelectedClientNaam(klantNaam);
  };

  const handleMatchToSelected = async () => {
    if (!selectedClientId || !selectedClientNaam) return;
    
    try {
      await matchItem.mutateAsync({
        id: item.id,
        klantId: selectedClientId,
        klantNaam: selectedClientNaam,
      });
      toast.success(
        t('inboxReview.matchedToast', { name: selectedClientNaam }),
        {
          action: {
            label: t('inboxReview.viewInteraction'),
            onClick: () => console.log('Navigate to interaction'),
          },
        }
      );
      setSelectedClientId(null);
      setSelectedClientNaam(null);
      setSearchQuery('');
      onProcessed();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleCreateNewClient = async () => {
    try {
      const result = await createClient.mutateAsync({ id: item.id });
      toast.success(
        t('inboxReview.clientCreatedToast', { name: item.raw_naam || item.raw_afzender })
      );
      onProcessed();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const handleMarkAsSpam = async () => {
    try {
      await markAsSpam.mutateAsync({ id: item.id });
      toast.success(t('inboxReview.markedAsSpam'));
      setShowSpamConfirm(false);
      onProcessed();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const getMatchScoreBorderClass = (score: number) => {
    if (score >= 80) return 'border-ka-green bg-ka-green/5';
    if (score >= 50) return 'border-orange-400 bg-orange-50 dark:bg-orange-950/20';
    return 'border-muted';
  };

  const showSuggestion = item.suggested_klant_id && !isProcessed && !suggestionRejected;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn('p-2 rounded-lg shadow-sm', channel.bgClass, channel.colorClass)}>
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

          {/* Match suggestion - enhanced card */}
          {showSuggestion && (
            <Card className={cn('border-2', getMatchScoreBorderClass(item.match_score))}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ka-green" />
                  {t('inboxReview.suggestionFound')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-ka-green/10 text-ka-green font-medium">
                      {item.suggested_klant_naam?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{item.suggested_klant_naam}</div>
                    <div className="text-sm text-muted-foreground">{item.suggested_klant_id}</div>
                    <div className="text-sm text-muted-foreground">
                      {t('inboxReview.match')}: {item.match_score}% ({item.match_type})
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleConfirmSuggested}
                    disabled={matchItem.isPending}
                    className="bg-ka-green hover:bg-ka-green/90 flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t('inboxReview.confirmMatch')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleRejectSuggestion}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    {t('inboxReview.notThis')}
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

          {/* Client search - always visible when not processed */}
          {!isProcessed && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('inboxReview.searchClientPlaceholder')}
                  className="pl-9"
                />
              </div>
              
              {filteredClients.length > 0 && (
                <div className="border rounded-lg divide-y">
                  {filteredClients.map(client => (
                    <div
                      key={client.id}
                      className={cn(
                        'p-3 cursor-pointer transition-colors',
                        selectedClientId === client.id 
                          ? 'bg-ka-green/10 border-l-4 border-l-ka-green' 
                          : 'hover:bg-muted/50 border-l-4 border-l-transparent'
                      )}
                      onClick={() => handleSelectClient(client.id, client.naam)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {client.naam.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{client.naam}</span>
                            <span className="text-xs text-muted-foreground">{client.klant_nummer}</span>
                            <Badge variant="outline" className="text-xs">
                              {client.type_klant}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            {client.telefoonnummer && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {client.telefoonnummer}
                              </span>
                            )}
                            {client.email && (
                              <span className="flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3" />
                                {client.email}
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedClientId === client.id && (
                          <CheckCircle className="w-5 h-5 text-ka-green flex-shrink-0" />
                        )}
                      </div>
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
      </ScrollArea>

      {/* Sticky action buttons */}
      {!isProcessed && (
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Button 
              onClick={handleMatchToSelected}
              disabled={!selectedClientId || matchItem.isPending}
              className="bg-ka-green hover:bg-ka-green/90 flex-1"
            >
              <Building2 className="w-4 h-4 mr-2" />
              {t('inboxReview.matchToClient')}
            </Button>
            <Button 
              variant="secondary"
              onClick={handleCreateNewClient}
              disabled={createClient.isPending}
              className="flex-1"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {t('inboxReview.newClient')}
            </Button>
            <Button 
              variant="ghost" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowSpamConfirm(true)}
            >
              <Ban className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Spam confirmation dialog */}
      <AlertDialog open={showSpamConfirm} onOpenChange={setShowSpamConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('inboxReview.spamConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('inboxReview.spamConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMarkAsSpam}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('inboxReview.confirmSpam')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
