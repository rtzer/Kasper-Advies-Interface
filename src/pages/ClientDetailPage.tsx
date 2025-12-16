import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Edit, Archive, MoreVertical, TrendingUp, FileText, Video, Linkedin, Globe, Calendar, ShieldAlert, CreditCard, MessageCircle, ChevronDown, Plus, ClipboardList, ListTodo, User, Building, Landmark, Clock, Receipt, Briefcase, DollarSign, Euro, AlertCircle, Trash2 } from 'lucide-react';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { spacing } from '@/lib/utils/spacing';
import { useDeviceChecks } from '@/hooks/useBreakpoint';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useKlant, useKlanten, useUpdateKlant } from '@/lib/api/klanten';
import { useQueryClient } from '@tanstack/react-query';
import { useInteractiesByKlant } from '@/lib/api/interacties';
import ClientInteractionsTimeline from '@/components/clients/ClientInteractionsTimeline';
import ClientAssignments from '@/components/clients/ClientAssignments';
import ClientTasks from '@/components/clients/ClientTasks';
import ClientContactPersons, { useContactPersonsCount } from '@/components/clients/ClientContactPersons';
import { CreateClientDialog } from '@/components/clients/CreateClientDialog';
import RelatedClientsSection from '@/components/clients/RelatedClientsSection';
import PartnerSection from '@/components/clients/PartnerSection';
import ExternalAccountantCard from '@/components/clients/ExternalAccountantCard';
import { HealthScoreIndicator } from '@/components/clients/HealthScoreIndicator';
import { LifecycleBadge } from '@/components/clients/LifecycleBadge';
import { FocusClientStar } from '@/components/clients/FocusClientStar';
import { ClientAuditSection } from '@/components/clients/ClientAuditSection';
import CreateInteractionDialog from '@/components/clients/CreateInteractionDialog';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';

// Helper function to send client action webhooks via secure proxy
async function sendClientActionWebhook(action: 'focus' | 'archive' | 'delete', clientId: number, value: boolean) {
  try {
    await fetch('/api/n8n/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        webhookType: 'client-action',
        action,
        client_id: clientId,
        value,
      }),
    });
  } catch (error) {
    console.error('Failed to send client action webhook:', error);
  }
}

const getGroeiFaseColor = (fase?: string) => {
  switch (fase) {
    case 'Starter':
      return 'bg-blue-500 text-white';
    case 'Groei':
      return 'bg-green-500 text-white';
    case 'Schaal-op':
      return 'bg-purple-500 text-white';
    case 'Professionalisering':
      return 'bg-orange-500 text-white';
    case 'Digitalisering':
      return 'bg-cyan-500 text-white';
    case 'Stabiel':
      return 'bg-gray-500 text-white';
    case 'Exit':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('common');
  const { currentUser } = useUserStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: klant, isLoading } = useKlant(id!);
  const { data: interacties } = useInteractiesByKlant(id!);
  const { data: allKlantenData } = useKlanten();
  
  // Responsive helpers
  const { isMobile } = useDeviceChecks();

  // Contact persons count
  const contactPersonsCount = useContactPersonsCount(id!);
  
  // Get related clients
  const relatedClients = klant?.gerelateerde_klanten
    ? allKlantenData?.results.filter(k => klant.gerelateerde_klanten.includes(k.id)) || []
    : [];
  
  // Get partner
  const partner = klant?.partner_id 
    ? allKlantenData?.results.find(k => k.id === klant.partner_id)
    : undefined;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateInteractionOpen, setIsCreateInteractionOpen] = useState(false);

  // Check if current user has admin role (can archive/delete)
  const isAdmin = currentUser?.role === 'admin';
  
  // Collapsible states
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isPersoonlijkOpen, setIsPersoonlijkOpen] = useState(false);
  const [isFinancieelOpen, setIsFinancieelOpen] = useState(false);
  const [isNotitiesOpen, setIsNotitiesOpen] = useState(false);
  
  // Update klant mutation for focus toggle
  const updateKlant = useUpdateKlant();

  const handleToggleFocus = useCallback(() => {
    if (klant) {
      const newValue = !klant.focus_client;
      updateKlant.mutate({
        id: klant.id,
        data: { focus_client: newValue }
      });
      // Send webhook for focus action
      sendClientActionWebhook('focus', klant.id, newValue);
    }
  }, [klant, updateKlant]);

  const handleArchiveClick = useCallback(() => {
    if (!isAdmin) {
      toast.error(t('clients.messages.archiveAdminOnly'));
      return;
    }
    setIsArchiveDialogOpen(true);
  }, [isAdmin, t]);

  const handleArchiveConfirm = useCallback(() => {
    if (!klant) return;

    // Send webhook for archive action
    sendClientActionWebhook('archive', klant.id, true);
    toast.success(t('clients.messages.archived', { name: klant.naam }));
    setIsArchiveDialogOpen(false);
    // Redirect to clients list
    navigate('/clients');
  }, [klant, t, navigate]);

  const handleDeleteClick = useCallback(() => {
    if (!isAdmin) {
      toast.error(t('clients.messages.deleteAdminOnly'));
      return;
    }
    setIsDeleteDialogOpen(true);
  }, [isAdmin, t]);

  const handleDeleteConfirm = useCallback(() => {
    if (!klant) return;

    // Send webhook for delete action
    sendClientActionWebhook('delete', klant.id, true);
    toast.success(t('clients.messages.deleted', { name: klant.naam }));
    setIsDeleteDialogOpen(false);
    // Redirect to clients list
    navigate('/clients');
  }, [klant, t, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-ka-gray-500 dark:text-gray-400">{t('common:loading')}</p>
      </div>
    );
  }
  
  if (!klant) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-ka-gray-500 dark:text-gray-400">{t('clients.notFound')}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-full overflow-y-auto bg-ka-gray-50 dark:bg-gray-900 -m-6 -mb-16 lg:-mb-6 w-[calc(100%+3rem)]">
      {/* Header - Responsive with Health Score, Lifecycle, Focus */}
      <div className="w-full bg-white dark:bg-gray-800 border-b border-ka-gray-200 dark:border-gray-700">
        <div className="w-full px-6 sm:px-8 lg:px-10 py-4 xs:py-5 sm:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 xs:space-y-4 lg:space-y-0">
            {/* Avatar + Client info - Stacked on mobile, side-by-side on desktop */}
            <div className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4">
              {/* Avatar - Optimized for 360px */}
              <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded-full bg-ka-navy dark:bg-ka-green text-white flex items-center justify-center text-base xs:text-lg sm:text-2xl font-bold flex-shrink-0">
                {klant.naam.substring(0, 2).toUpperCase()}
              </div>
              
              {/* Client info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2">
                  <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-ka-navy dark:text-white truncate max-w-[180px] xs:max-w-[220px] sm:max-w-none">
                    {klant.naam}
                  </h1>
                  {/* Focus Star */}
                  <FocusClientStar 
                    isFocus={klant.focus_client} 
                    onToggle={handleToggleFocus}
                    size="sm"
                  />
                  {/* Lifecycle Badge */}
                  <LifecycleBadge stage={klant.lifecycle_stage} showIcon={true} />
                </div>
                
                {/* Client metadata - Stack on xs, inline on sm+ */}
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-1.5 sm:gap-3 text-xs xs:text-sm">
                  <span className="flex items-center gap-1 flex-wrap">
                    <span className="font-medium text-ka-navy dark:text-white">{klant.type_klant}</span>
                    {klant.klant_type_details && klant.klant_type_details !== klant.type_klant && (
                      <>
                        <span className="hidden xs:inline text-ka-gray-400">•</span>
                        <span className="text-ka-gray-500 dark:text-gray-400 truncate max-w-[200px] xs:max-w-none">{klant.klant_type_details}</span>
                      </>
                    )}
                  </span>
                  <span className="text-ka-gray-400">|</span>
                  <span className="font-mono font-medium text-ka-gray-600 dark:text-gray-300">{klant.klant_nummer}</span>
                </div>
                
                {/* Tags - More compact on mobile */}
                {klant.tags && klant.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2 mt-2 xs:mt-3">
                    {klant.tags.slice(0, isMobile ? 3 : klant.tags.length).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] xs:text-xs px-1.5 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                    {isMobile && klant.tags.length > 3 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                        +{klant.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              {/* Health Score - Prominent on right of avatar section */}
              <div className="flex-shrink-0 hidden sm:flex flex-col items-center">
                <HealthScoreIndicator score={klant.health_score} size="lg" showLabel={false} />
                <span className="text-[10px] xs:text-xs text-muted-foreground mt-1">{t('clients.health.title')}</span>
              </div>
            </div>
            
            {/* Actions - Optimized for 360px */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-2.5 sm:gap-2 w-full lg:w-auto">
              {/* Health Score on mobile */}
              <div className="sm:hidden flex items-center gap-3 mb-2">
                <HealthScoreIndicator score={klant.health_score} size="md" />
                <span className="text-xs text-muted-foreground">{t('clients.healthScore')}</span>
              </div>
              
              {/* Quick Communication Actions - Horizontal scroll, tighter on xs */}
              <div className="flex items-center gap-0.5 xs:gap-1 overflow-x-auto pb-1.5 xs:pb-2 sm:pb-0 sm:border-r sm:border-ka-gray-200 sm:dark:border-gray-700 sm:pr-3 -mx-1 px-1 scrollbar-hide">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = `mailto:${klant.email}`}
                  title={t('clients.actions.sendEmail')}
                  className="hover:bg-ka-green/10 hover:text-ka-green flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                >
                  <Mail className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://wa.me/${klant.telefoonnummer.replace(/\D/g, '')}`, '_blank')}
                  title={t('clients.actions.whatsapp')}
                  className="hover:bg-ka-green/10 hover:text-ka-green flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                >
                  <MessageCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = `tel:${klant.telefoonnummer}`}
                  title={t('clients.actions.call')}
                  className="hover:bg-ka-green/10 hover:text-ka-green flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                >
                  <Phone className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toast.info(t('clients.messages.videoCallComingSoon'))}
                  title={t('clients.actions.videoCall')}
                  className="hover:bg-ka-green/10 hover:text-ka-green flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                >
                  <Video className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
              </div>
              
              {/* Quick Action Buttons - New Interaction, Task, Assignment */}
              <div className="flex items-center gap-1.5 xs:gap-2 overflow-x-auto pb-1.5 xs:pb-2 sm:pb-0 sm:border-r sm:border-ka-gray-200 sm:dark:border-gray-700 sm:pr-3 -mx-1 px-1 scrollbar-hide">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateInteractionOpen(true)}
                  className="flex-shrink-0 text-xs h-9"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t('clients.quickActions.newInteraction')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info(t('clients.messages.taskComingSoon'))}
                  className="flex-shrink-0 text-xs h-9"
                >
                  <ListTodo className="w-3.5 h-3.5 mr-1" />
                  {t('clients.quickActions.newTask')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info(t('clients.messages.assignmentComingSoon'))}
                  className="flex-shrink-0 text-xs h-9"
                >
                  <ClipboardList className="w-3.5 h-3.5 mr-1" />
                  {t('clients.quickActions.newAssignment')}
                </Button>
              </div>
              
              {/* Primary actions - Optimized for 360px */}
              <div className="flex items-center gap-1.5 xs:gap-2 w-full xs:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                  size="default"
                  className="flex-1 xs:flex-initial h-10 xs:h-11 text-xs xs:text-sm"
                >
                  <Edit className="w-3.5 h-3.5 xs:w-4 xs:h-4 xs:mr-2" />
                  <span className="xs:inline">{t('clients.actions.edit')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleArchiveClick}
                  title={t('clients.actions.archive')}
                  className="flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                >
                  <Archive className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                    >
                      <MoreVertical className="w-4 h-4 xs:w-5 xs:h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 z-50">
                    <DropdownMenuItem onClick={() => toast.info(t('clients.messages.exportComingSoon'))}>
                      <FileText className="w-4 h-4 mr-2" />
                      {t('clients.actions.exportData')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('clients.actions.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs - Navigation between Information, Timeline, Assignments, Tasks */}
      <div className="w-full px-6 sm:px-8 lg:px-10 py-4 xs:py-5 sm:py-6">
        <Tabs defaultValue="information" className="space-y-2 xs:space-y-3 sm:space-y-4 lg:space-y-6">
          <TabsList className="w-full overflow-x-auto flex-nowrap justify-start scrollbar-hide h-9 xs:h-10 sm:h-11 p-0.5 xs:p-1">
            <TabsTrigger value="information" className="flex-shrink-0 text-[11px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4">
              {t('clients.tabs.information')}
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex-shrink-0 text-[11px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4">
              {t('clients.tabs.timeline')}
              <span className="ml-0.5 xs:ml-1 text-[10px] xs:text-xs">({interacties?.results.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex-shrink-0 text-[11px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4">
              {t('clients.tabs.assignments')}
              <span className="ml-0.5 xs:ml-1 text-[10px] xs:text-xs">({klant.aantal_opdrachten || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-shrink-0 text-[11px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4">
              {t('clients.tabs.tasks')}
              <span className="ml-0.5 xs:ml-1 text-[10px] xs:text-xs">({klant.aantal_openstaande_taken || 0})</span>
            </TabsTrigger>
          </TabsList>

          {/* Information Tab Content */}
          <TabsContent value="information" className="space-y-4">
            {/* Stats Cards - Optimized for 360px */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
              {/* Eerste contact */}
              <Card className="border-ka-gray-200 dark:border-gray-700">
                <CardContent className="pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">{t('clients.stats.clientSince')}</div>
                  <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-ka-navy dark:text-white leading-tight">
                    {formatDate(klant.sinds_wanneer_klant, currentUser?.language || 'nl')}
                  </div>
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1">
                    {klant.jaren_als_klant} {t('clients.years')}
                  </div>
                </CardContent>
              </Card>

              {/* Totaal gesprekken */}
              <Card className="border-ka-gray-200 dark:border-gray-700">
                <CardContent className="pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">{t('clients.stats.conversations')}</div>
                  <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-ka-navy dark:text-white leading-tight">
                    {klant.aantal_interacties || 0}
                  </div>
                  <div className="text-[10px] xs:text-xs text-ka-green dark:text-ka-green-light mt-0.5 xs:mt-1 flex items-center truncate">
                    <TrendingUp className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-0.5 xs:mr-1 flex-shrink-0" />
                    <span className="truncate">{t('clients.stats.lastContact')}: {interacties?.results[0]?.datum || '-'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Opdrachten */}
              <Card className="border-ka-gray-200 dark:border-gray-700">
                <CardContent className="pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">{t('clients.stats.assignments')}</div>
                  <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-ka-navy dark:text-white leading-tight">
                    {klant.aantal_actieve_opdrachten || 0}
                  </div>
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1">
                    {t('clients.stats.total')}: {klant.aantal_opdrachten || 0}
                  </div>
                </CardContent>
              </Card>

              {/* Lifetime value */}
              <Card className="border-ka-gray-200 dark:border-gray-700">
                <CardContent className="pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">{t('clients.stats.lifetimeValue')}</div>
                  <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-ka-green dark:text-ka-green-light leading-tight">
                    €{klant.totale_omzet?.toLocaleString('nl-NL') || '0'}
                  </div>
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1 truncate">
                    {t('clients.stats.average')}: €{klant.totale_omzet && klant.aantal_opdrachten
                      ? Math.round(klant.totale_omzet / klant.aantal_opdrachten).toLocaleString('nl-NL')
                      : '0'
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

        {/* Contact Information Cards - Optimized for 360px */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
          {/* Contactgegevens + Adres */}
          <Card className="border-ka-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6 pt-3 xs:pt-4 sm:pt-6">
              <CardTitle className="text-sm xs:text-base sm:text-lg font-semibold flex items-center text-ka-navy dark:text-white">
                <Mail className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 text-ka-green flex-shrink-0" />
                <span>{t('clients.contactInfo')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 xs:space-y-3 sm:space-y-4 px-3 xs:px-4 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
              <div className="flex items-start space-x-2 xs:space-x-2.5 sm:space-x-3">
                <Mail className="w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">{t('clients.email')}</div>
                  <a href={`mailto:${klant.email}`} className="text-xs xs:text-sm text-ka-navy dark:text-white hover:underline break-all">
                    {klant.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-2 xs:space-x-2.5 sm:space-x-3">
                <Phone className="w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">{t('clients.phone')}</div>
                  <a href={`tel:${klant.telefoonnummer}`} className="text-xs xs:text-sm text-ka-navy dark:text-white hover:underline">
                    {klant.telefoonnummer}
                  </a>
                </div>
              </div>

              {/* Primary Address - after phone */}
              <div className="flex items-start space-x-2 xs:space-x-2.5 sm:space-x-3">
                <MapPin className="w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">{t('clients.primaryAddress')}</div>
                  <div className="text-xs xs:text-sm text-ka-navy dark:text-white leading-relaxed">
                    {klant.adres}<br />
                    {klant.postcode} {klant.plaats}<br />
                    {klant.land}
                  </div>
                </div>
              </div>

              {klant.website && (
                <div className="flex items-start space-x-2 xs:space-x-2.5 sm:space-x-3">
                  <Globe className="w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">{t('clients.website')}</div>
                    <a href={klant.website} target="_blank" rel="noopener noreferrer" className="text-xs xs:text-sm text-ka-navy dark:text-white hover:underline break-all">
                      {klant.website}
                    </a>
                  </div>
                </div>
              )}

              {klant.linkedin_url && (
                <div className="flex items-start space-x-2 xs:space-x-2.5 sm:space-x-3">
                  <Linkedin className="w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">{t('clients.linkedin')}</div>
                    <a href={klant.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs xs:text-sm text-ka-navy dark:text-white hover:underline break-all">
                      {klant.linkedin_url}
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-2 xs:pt-3 sm:pt-4 border-t border-ka-gray-200 dark:border-gray-700">
                <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">{t('clients.accountManager')}</div>
                <div className="text-xs xs:text-sm font-medium text-ka-navy dark:text-white">
                  {klant.accountmanager}
                </div>
              </div>

              {klant.voorkeur_kanaal && (
                <div>
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">{t('clients.preferredCommunication')}</div>
                  <Badge variant="secondary" className="text-[10px] xs:text-xs">{klant.voorkeur_kanaal}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contactpersonen */}
          <Card className="border-ka-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6 pt-3 xs:pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm xs:text-base sm:text-lg font-semibold flex items-center text-ka-navy dark:text-white">
                  <User className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 text-ka-green flex-shrink-0" />
                  <span>{t('clients.contactPersons')}</span>
                  <span className="ml-1.5 text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-normal">({contactPersonsCount})</span>
                </CardTitle>
                <Button size="sm" className="bg-ka-green hover:bg-ka-green/90 h-7 xs:h-8 text-xs">
                  <Plus className="w-3 h-3 xs:w-3.5 xs:h-3.5 mr-1" />
                  {t('clients.contactPersonsSection.add')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
              <ClientContactPersons klantId={id!} />
            </CardContent>
          </Card>
        </div>

        {/* NEW SECTIONS - Optimized spacing for all breakpoints */}
        <div className="space-y-2 xs:space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Gerelateerde klanten */}
          <RelatedClientsSection klant={klant} relatedClients={relatedClients} />
          
          {/* Partner (alleen voor Particulier) */}
          <PartnerSection klant={klant} partner={partner} />
          
          {/* Externe accountant (alleen voor MKB) */}
          <ExternalAccountantCard klant={klant} />
          
        </div>

        {/* Business Details - Collapsible (alleen voor MKB/ZZP) */}
        {klant.type_klant !== 'Particulier' && (klant.website || klant.branche || klant.jaren_actief_als_ondernemer || klant.groei_fase || klant.omzet_categorie || klant.totale_omzet || klant.openstaand_bedrag) && (
          <Collapsible open={isBusinessOpen} onOpenChange={setIsBusinessOpen}>
            <Card className="border-ka-gray-200 dark:border-gray-700">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-ka-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <CardTitle className={`${responsiveHeading.h4} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-ka-green" />
                      {t('clients.businessSection.title')}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-ka-gray-500 transition-transform ${isBusinessOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Website & Branche */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {klant.website && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Globe className="w-4 h-4 text-ka-gray-500" />
                          <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                            {t('clients.website')}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a href={`https://${klant.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-3 h-3 mr-2" />
                            {klant.website}
                          </a>
                        </Button>
                      </div>
                    )}

                    {klant.branche && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Briefcase className="w-4 h-4 text-ka-gray-500" />
                          <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                            {t('clients.businessSection.industry')}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-ka-navy dark:text-white">
                          {klant.branche}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Groei indicators */}
                  {(klant.jaren_actief_als_ondernemer || klant.groei_fase || klant.omzet_categorie) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-ka-gray-200 dark:border-gray-700">
                      {klant.jaren_actief_als_ondernemer && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-ka-gray-500" />
                            <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                              {t('clients.businessSection.yearsActive')}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-ka-navy dark:text-white">
                            {klant.jaren_actief_als_ondernemer} {t('clients.businessSection.year')}
                          </p>
                        </div>
                      )}

                      {klant.groei_fase && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-ka-gray-500" />
                            <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                              {t('clients.businessSection.growthPhase')}
                            </p>
                          </div>
                          <Badge className={getGroeiFaseColor(klant.groei_fase)}>
                            {klant.groei_fase}
                          </Badge>
                        </div>
                      )}

                      {klant.omzet_categorie && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="w-4 h-4 text-ka-gray-500" />
                            <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                              {t('clients.businessSection.revenueCategory')}
                            </p>
                          </div>
                          <Badge variant="outline" className="font-mono">
                            {klant.omzet_categorie}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Financial Rollups */}
                  {(klant.totale_omzet !== undefined || klant.openstaand_bedrag !== undefined) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-ka-gray-200 dark:border-gray-700">
                      {klant.totale_omzet !== undefined && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Euro className="w-4 h-4 text-ka-green" />
                            <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                              {t('clients.businessSection.totalRevenue')}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-ka-green">
                            €{klant.totale_omzet.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}

                      {klant.openstaand_bedrag !== undefined && klant.openstaand_bedrag > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                            <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                              {t('clients.businessSection.outstandingBalance')}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-orange-500">
                            €{klant.openstaand_bedrag.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Financiële gegevens - Collapsible */}
        {(klant.kvk_nummer || klant.btw_nummer || klant.iban || klant.betalingstermijn || klant.bic || klant.bank_naam || klant.alternatief_iban || klant.facturatie_frequentie || klant.factuur_adres) && (
          <Collapsible open={isFinancieelOpen} onOpenChange={setIsFinancieelOpen}>
            <Card className="border-ka-gray-200 dark:border-gray-700">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-ka-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <CardTitle className={`${responsiveHeading.h4} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-ka-green" />
                      {t('clients.financialDetails')}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-ka-gray-500 transition-transform ${isFinancieelOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-6">
                  {/* Business Registration */}
                  {(klant.kvk_nummer || klant.btw_nummer) && (
                    <div>
                      <div className="text-xs font-medium text-ka-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        {t('clients.businessDetails')}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {klant.kvk_nummer && (
                          <div className="flex items-start space-x-3">
                            <Building className="w-4 h-4 text-ka-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-ka-gray-500 dark:text-gray-400">{t('clients.chamberOfCommerce')}</div>
                              <div className="text-sm font-mono font-medium text-ka-navy dark:text-white">
                                {klant.kvk_nummer}
                              </div>
                            </div>
                          </div>
                        )}
                        {klant.btw_nummer && (
                          <div className="flex items-start space-x-3">
                            <Receipt className="w-4 h-4 text-ka-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-ka-gray-500 dark:text-gray-400">{t('clients.vatNumber')}</div>
                              <div className="text-sm font-mono font-medium text-ka-navy dark:text-white">
                                {klant.btw_nummer}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bank Details */}
                  {(klant.iban || klant.bic || klant.bank_naam || klant.alternatief_iban) && (
                    <div>
                      <div className="text-xs font-medium text-ka-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        {t('clients.financialSection.bankName')}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {klant.iban && (
                          <div className="flex items-start space-x-3">
                            <Landmark className="w-4 h-4 text-ka-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-ka-gray-500 dark:text-gray-400">{t('clients.iban')}</div>
                              <div className="text-sm font-mono font-medium text-ka-navy dark:text-white">
                                {klant.iban}
                              </div>
                              {klant.bank_naam && (
                                <div className="text-xs text-ka-gray-500 dark:text-gray-400 mt-0.5">
                                  {klant.bank_naam}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {klant.bic && (
                          <div className="flex items-start space-x-3">
                            <Landmark className="w-4 h-4 text-ka-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-ka-gray-500 dark:text-gray-400">{t('clients.bic')}</div>
                              <div className="text-sm font-mono font-medium text-ka-navy dark:text-white">
                                {klant.bic}
                              </div>
                            </div>
                          </div>
                        )}
                        {klant.alternatief_iban && (
                          <div className="flex items-start space-x-3 sm:col-span-2">
                            <Landmark className="w-4 h-4 text-ka-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-ka-gray-500 dark:text-gray-400">{t('clients.alternativeIban')}</div>
                              <div className="text-sm font-mono font-medium text-ka-navy dark:text-white">
                                {klant.alternatief_iban}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Terms */}
                  {(klant.betalingstermijn || klant.facturatie_frequentie) && (
                    <div>
                      <div className="text-xs font-medium text-ka-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        {t('clients.paymentTerm')}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {klant.betalingstermijn && (
                          <div className="flex items-start space-x-3">
                            <Clock className="w-4 h-4 text-ka-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-ka-gray-500 dark:text-gray-400">{t('clients.paymentTerm')}</div>
                              <div className="text-sm font-medium text-ka-navy dark:text-white">
                                {klant.betalingstermijn} {t('clients.days')}
                              </div>
                            </div>
                          </div>
                        )}
                        {klant.facturatie_frequentie && (
                          <div className="flex items-start space-x-3">
                            <Calendar className="w-4 h-4 text-ka-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-xs text-ka-gray-500 dark:text-gray-400">{t('clients.financialSection.invoiceFrequency')}</div>
                              <div className="text-sm font-medium text-ka-navy dark:text-white">
                                {klant.facturatie_frequentie}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Invoice Address */}
                  {klant.factuur_adres && (
                    <div>
                      <div className="text-xs font-medium text-ka-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        {t('clients.invoiceAddressSection.title')}
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-4 h-4 text-ka-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-ka-navy dark:text-white">
                            {klant.factuur_adres}
                          </div>
                          <div className="text-sm text-ka-gray-600 dark:text-gray-400">
                            {klant.factuur_postcode} {klant.factuur_plaats}
                          </div>
                          {klant.factuur_land && (
                            <div className="text-sm text-ka-gray-600 dark:text-gray-400">
                              {klant.factuur_land}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Persoonlijke gegevens - Collapsible */}
        {(klant.geboortedatum || klant.bsn) && (
          <Collapsible open={isPersoonlijkOpen} onOpenChange={setIsPersoonlijkOpen}>
            <Card className="border-ka-gray-200 dark:border-gray-700">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-ka-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <CardTitle className={`${responsiveHeading.h4} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-ka-green" />
                      {t('clients.personalDetails')}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-ka-gray-500 transition-transform ${isPersoonlijkOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className={`pt-0 ${spacing.stack.sm}`}>
                  {klant.geboortedatum && (
                    <div>
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">{t('clients.dateOfBirth')}</div>
                      <div className="text-sm text-ka-navy dark:text-white">
                        {formatDate(klant.geboortedatum, currentUser?.language || 'nl')}
                      </div>
                    </div>
                  )}

                  {klant.bsn && (
                    <div>
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1 flex items-center">
                        <ShieldAlert className="w-3 h-3 mr-1 text-amber-500" />
                        {t('clients.bsnSensitive')}
                      </div>
                      <div className="text-sm font-mono text-ka-navy dark:text-white bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded border border-amber-200 dark:border-amber-800">
                        {klant.bsn}
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Notities - Collapsible */}
        {klant.notities && (
          <Collapsible open={isNotitiesOpen} onOpenChange={setIsNotitiesOpen}>
            <Card className="border-ka-gray-200 dark:border-gray-700">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-ka-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <CardTitle className={`${responsiveHeading.h4} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-ka-green" />
                      {t('clients.notes')}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-ka-gray-500 transition-transform ${isNotitiesOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className={`${responsiveBody.small} text-ka-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-ka-gray-50 dark:bg-gray-800 p-4 rounded-lg`}>
                    {klant.notities}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Audit Section */}
        <ClientAuditSection klant={klant} />

          </TabsContent>

          {/* Timeline Tab Content */}
          <TabsContent value="timeline">
            <ClientInteractionsTimeline klantId={id!} />
          </TabsContent>

          {/* Assignments Tab Content */}
          <TabsContent value="assignments">
            <ClientAssignments klantId={id!} />
          </TabsContent>

          {/* Tasks Tab Content */}
          <TabsContent value="tasks">
            <ClientTasks klantId={id!} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      {klant && (
        <CreateClientDialog
          klant={klant}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['klanten', id] });
            queryClient.invalidateQueries({ queryKey: ['klanten'] });
          }}
        />
      )}
      
      {/* Create Interaction Dialog */}
      {klant && (
        <CreateInteractionDialog
          klantId={klant.id}
          klantNaam={klant.naam}
          open={isCreateInteractionOpen}
          onOpenChange={setIsCreateInteractionOpen}
        />
      )}

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('clients.dialogs.archiveTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('clients.dialogs.archiveDescription', { name: klant?.naam })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('clients.dialogs.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveConfirm}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {t('clients.dialogs.archiveConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('clients.dialogs.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('clients.dialogs.deleteDescription', { name: klant?.naam })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('clients.dialogs.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('clients.dialogs.deleteConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
