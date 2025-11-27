import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Edit, Archive, MoreVertical, TrendingUp, FileText, Send, Video, Linkedin, Globe, Building2, Calendar, ShieldAlert, CreditCard, MessageCircle, MessageSquare, ChevronDown, Plus, ClipboardList, ListTodo } from 'lucide-react';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { spacing } from '@/lib/utils/spacing';
import { useDeviceChecks, useTouchTargetSize } from '@/hooks/useBreakpoint';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useKlant, useKlanten, useUpdateKlant } from '@/lib/api/klanten';
import { useInteractiesByKlant } from '@/lib/api/interacties';
import ClientInteractionsTimeline from '@/components/clients/ClientInteractionsTimeline';
import ClientAssignments from '@/components/clients/ClientAssignments';
import ClientTasks from '@/components/clients/ClientTasks';
import ClientContactPersons from '@/components/clients/ClientContactPersons';
import EditClientDialog from '@/components/clients/EditClientDialog';
import RelatedClientsSection from '@/components/clients/RelatedClientsSection';
import PartnerSection from '@/components/clients/PartnerSection';
import ExternalAccountantCard from '@/components/clients/ExternalAccountantCard';
import FinancialDetailsSection from '@/components/clients/FinancialDetailsSection';
import BusinessDetailsSection from '@/components/clients/BusinessDetailsSection';
import InvoiceAddressSection from '@/components/clients/InvoiceAddressSection';
import { HealthScoreIndicator } from '@/components/clients/HealthScoreIndicator';
import { LifecycleBadge } from '@/components/clients/LifecycleBadge';
import { FocusClientStar } from '@/components/clients/FocusClientStar';
import { ClientAuditSection } from '@/components/clients/ClientAuditSection';
import CreateInteractionDialog from '@/components/clients/CreateInteractionDialog';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['clients', 'common']);
  const { currentUser } = useUserStore();
  const { data: klant, isLoading } = useKlant(id!);
  const { data: interacties } = useInteractiesByKlant(id!);
  const { data: allKlantenData } = useKlanten();
  
  // Responsive helpers
  const { isMobile } = useDeviceChecks();
  const touchSize = useTouchTargetSize();
  
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
  const [isCreateInteractionOpen, setIsCreateInteractionOpen] = useState(false);
  
  // Collapsible states
  const [isBedrijfsOpen, setIsBedrijfsOpen] = useState(false);
  const [isPersoonlijkOpen, setIsPersoonlijkOpen] = useState(false);
  const [isFinancieelOpen, setIsFinancieelOpen] = useState(false);
  const [isNotitiesOpen, setIsNotitiesOpen] = useState(false);
  
  // Update klant mutation for focus toggle
  const updateKlant = useUpdateKlant();
  
  const handleToggleFocus = () => {
    if (klant) {
      updateKlant.mutate({
        id: klant.id,
        data: { focus_client: !klant.focus_client }
      });
    }
  };
  
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
        <p className="text-ka-gray-500 dark:text-gray-400">Klant niet gevonden</p>
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-y-auto bg-ka-gray-50 dark:bg-gray-900">
      {/* Header - Responsive with Health Score, Lifecycle, Focus */}
      <div className="bg-white dark:bg-gray-800 border-b border-ka-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-5 sm:py-6 lg:py-8">
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
                  <Badge className={`text-[10px] xs:text-xs px-1.5 xs:px-2 ${
                    klant.status === 'Actief' 
                      ? 'bg-ka-green text-white' 
                      : klant.status === 'Prospect'
                      ? 'bg-ka-warning text-white'
                      : 'bg-ka-gray-500 text-white'
                  }`}>
                    {klant.status}
                  </Badge>
                </div>
                
                {/* Client metadata - Stack on xs, inline on sm+ */}
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-1.5 sm:gap-3 text-xs xs:text-sm">
                  <span className="flex items-center gap-1 flex-wrap">
                    <span className="font-medium text-ka-navy dark:text-white">{klant.type_klant}</span>
                    <span className="hidden xs:inline text-ka-gray-400">•</span>
                    <span className="text-ka-gray-500 dark:text-gray-400 truncate max-w-[200px] xs:max-w-none">{klant.klant_type_details}</span>
                  </span>
                  <span className="flex items-center gap-1 text-ka-gray-600 dark:text-gray-300">
                    <span className="text-ka-gray-500 dark:text-gray-400">Klant#:</span>
                    <span className="font-mono font-medium">{klant.klant_nummer}</span>
                  </span>
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
                <span className="text-[10px] xs:text-xs text-muted-foreground mt-1">Health</span>
              </div>
            </div>
            
            {/* Actions - Optimized for 360px */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-2.5 sm:gap-2 w-full lg:w-auto">
              {/* Health Score on mobile */}
              <div className="sm:hidden flex items-center gap-3 mb-2">
                <HealthScoreIndicator score={klant.health_score} size="md" />
                <span className="text-xs text-muted-foreground">Health Score</span>
              </div>
              
              {/* Quick Communication Actions - Horizontal scroll, tighter on xs */}
              <div className="flex items-center gap-0.5 xs:gap-1 overflow-x-auto pb-1.5 xs:pb-2 sm:pb-0 sm:border-r sm:border-ka-gray-200 sm:dark:border-gray-700 sm:pr-3 -mx-1 px-1 scrollbar-hide">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => window.location.href = `mailto:${klant.email}`}
                  title="Stuur e-mail"
                  className="hover:bg-ka-green/10 hover:text-ka-green flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                >
                  <Mail className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => window.open(`https://wa.me/${klant.telefoonnummer.replace(/\D/g, '')}`, '_blank')}
                  title="WhatsApp"
                  className="hover:bg-ka-green/10 hover:text-ka-green flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                >
                  <MessageCircle className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => window.location.href = `tel:${klant.telefoonnummer}`}
                  title="Bel klant"
                  className="hover:bg-ka-green/10 hover:text-ka-green flex-shrink-0 h-10 w-10 xs:h-11 xs:w-11"
                >
                  <Phone className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => toast.info('Video call functionaliteit komt binnenkort')}
                  title="Start video call"
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
                  <span className="hidden xs:inline">{t('clients.quickActions.newInteraction')}</span>
                  <span className="xs:hidden">Int.</span>
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('Taak aanmaken komt binnenkort')}
                  className="flex-shrink-0 text-xs h-9"
                >
                  <ListTodo className="w-3.5 h-3.5 mr-1" />
                  <span className="hidden xs:inline">{t('clients.quickActions.newTask')}</span>
                  <span className="xs:hidden">Taak</span>
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info('Opdracht aanmaken komt binnenkort')}
                  className="flex-shrink-0 text-xs h-9"
                >
                  <ClipboardList className="w-3.5 h-3.5 mr-1" />
                  <span className="hidden sm:inline">{t('clients.quickActions.newAssignment')}</span>
                  <span className="sm:hidden">Opdr.</span>
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
                  <span className="xs:inline">Bewerken</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsArchiveDialogOpen(true)}
                  title="Archiveer deze klant"
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
                    <DropdownMenuItem onClick={() => toast.info('Export functionaliteit komt binnenkort')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Exporteer klantgegevens
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 dark:text-red-400"
                      onClick={() => toast.error('Verwijderen is alleen beschikbaar voor beheerders')}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Verwijder klant
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards - Optimized for 360px */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 lg:gap-6 mb-4 xs:mb-5 sm:mb-6">
          {/* Eerste contact */}
          <Card className="border-ka-gray-200 dark:border-gray-700">
            <CardContent className="pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
              <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">Klant sinds</div>
              <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-ka-navy dark:text-white leading-tight">
                {formatDate(klant.sinds_wanneer_klant, currentUser?.language || 'nl')}
              </div>
              <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1">
                {klant.jaren_als_klant} jaar
              </div>
            </CardContent>
          </Card>
          
          {/* Totaal gesprekken */}
          <Card className="border-ka-gray-200 dark:border-gray-700">
            <CardContent className="pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
              <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">Gesprekken</div>
              <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-ka-navy dark:text-white leading-tight">
                {klant.aantal_interacties || 0}
              </div>
              <div className="text-[10px] xs:text-xs text-ka-green dark:text-ka-green-light mt-0.5 xs:mt-1 flex items-center truncate">
                <TrendingUp className="w-2.5 h-2.5 xs:w-3 xs:h-3 mr-0.5 xs:mr-1 flex-shrink-0" />
                <span className="truncate">Laatste: {interacties?.results[0]?.datum || '-'}</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Opdrachten */}
          <Card className="border-ka-gray-200 dark:border-gray-700">
            <CardContent className="pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
              <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">Opdrachten</div>
              <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-ka-navy dark:text-white leading-tight">
                {klant.aantal_actieve_opdrachten || 0}
              </div>
              <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1">
                Totaal: {klant.aantal_opdrachten || 0}
              </div>
            </CardContent>
          </Card>
          
          {/* Lifetime value */}
          <Card className="border-ka-gray-200 dark:border-gray-700">
            <CardContent className="pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6">
              <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">Lifetime Value</div>
              <div className="text-base xs:text-lg sm:text-xl lg:text-2xl font-semibold text-ka-green dark:text-ka-green-light leading-tight">
                €{klant.totale_omzet?.toLocaleString('nl-NL') || '0'}
              </div>
              <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1 truncate">
                Gem: €{klant.totale_omzet && klant.aantal_opdrachten 
                  ? Math.round(klant.totale_omzet / klant.aantal_opdrachten).toLocaleString('nl-NL')
                  : '0'
                }
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Contact Information Cards - Optimized for 360px */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 xs:gap-3 sm:gap-4 lg:gap-6 mb-4 xs:mb-5 sm:mb-6">
          {/* Contactgegevens */}
          <Card className="border-ka-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6 pt-3 xs:pt-4 sm:pt-6">
              <CardTitle className="text-sm xs:text-base sm:text-lg font-semibold flex items-center text-ka-navy dark:text-white">
                <Mail className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 text-ka-green flex-shrink-0" />
                <span>Contactgegevens</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 xs:space-y-3 sm:space-y-4 px-3 xs:px-4 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
              <div className="flex items-start space-x-2 xs:space-x-2.5 sm:space-x-3">
                <Mail className="w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">E-mail</div>
                  <a href={`mailto:${klant.email}`} className="text-xs xs:text-sm text-ka-navy dark:text-white hover:underline break-all">
                    {klant.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 xs:space-x-2.5 sm:space-x-3">
                <Phone className="w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">Telefoon</div>
                  <a href={`tel:${klant.telefoonnummer}`} className="text-xs xs:text-sm text-ka-navy dark:text-white hover:underline">
                    {klant.telefoonnummer}
                  </a>
                  {klant.mobiel && (
                    <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mt-0.5 xs:mt-1">
                      Mobiel: <a href={`tel:${klant.mobiel}`} className="hover:underline">{klant.mobiel}</a>
                    </div>
                  )}
                </div>
              </div>

              {klant.website && (
                <div className="flex items-start space-x-2 xs:space-x-2.5 sm:space-x-3">
                  <Globe className="w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">Website</div>
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
                    <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 font-medium">LinkedIn</div>
                    <a href={klant.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs xs:text-sm text-ka-navy dark:text-white hover:underline break-all">
                      {klant.linkedin_url}
                    </a>
                  </div>
                </div>
              )}

              <div className="pt-2 xs:pt-3 sm:pt-4 border-t border-ka-gray-200 dark:border-gray-700">
                <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">Accountmanager</div>
                <div className="text-xs xs:text-sm font-medium text-ka-navy dark:text-white">
                  {klant.accountmanager}
                </div>
              </div>
              
              {klant.voorkeur_kanaal && (
                <div>
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5 xs:mb-1 font-medium">Voorkeur communicatie</div>
                  <Badge variant="secondary" className="text-[10px] xs:text-xs">{klant.voorkeur_kanaal}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adresgegevens */}
          <Card className="border-ka-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 xs:pb-4 sm:pb-6 px-3 xs:px-4 sm:px-6 pt-3 xs:pt-4 sm:pt-6">
              <CardTitle className="text-sm xs:text-base sm:text-lg font-semibold flex items-center text-ka-navy dark:text-white">
                <MapPin className="w-4 h-4 xs:w-5 xs:h-5 mr-1.5 xs:mr-2 text-ka-green flex-shrink-0" />
                <span>Adresgegevens</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 xs:space-y-3 sm:space-y-4 px-3 xs:px-4 sm:px-6 pb-3 xs:pb-4 sm:pb-6">
              <div>
                <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-1 xs:mb-2 font-medium">Primair adres</div>
                <div className="text-xs xs:text-sm text-ka-gray-900 dark:text-gray-100 leading-relaxed">
                  {klant.adres}<br />
                  {klant.postcode} {klant.plaats}<br />
                  {klant.land}
                </div>
              </div>

              {(klant.factuur_adres || klant.factuur_postcode || klant.factuur_plaats) && (
                <div className="pt-2 xs:pt-3 sm:pt-4 border-t border-ka-gray-200 dark:border-gray-700">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-1 xs:mb-2 font-medium">Factuuradres</div>
                  <div className="text-xs xs:text-sm text-ka-gray-900 dark:text-gray-100 leading-relaxed">
                    {klant.factuur_adres || klant.adres}<br />
                    {klant.factuur_postcode || klant.postcode} {klant.factuur_plaats || klant.plaats}<br />
                    {klant.factuur_land || klant.land}
                  </div>
                </div>
              )}

              {klant.groei_fase && klant.groei_fase !== 'N.V.T.' && (
                <div className="pt-2 xs:pt-3 sm:pt-4 border-t border-ka-gray-200 dark:border-gray-700">
                  <div className="text-[10px] xs:text-xs text-ka-gray-500 dark:text-gray-400 mb-1 xs:mb-2 font-medium">Groei fase</div>
                  <Badge className="bg-ka-green text-[10px] xs:text-xs">{klant.groei_fase}</Badge>
                </div>
              )}
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
          
          {/* Zakelijke details (alleen voor MKB/ZZP) */}
          <BusinessDetailsSection klant={klant} />
          
          {/* Financiële gegevens */}
          <FinancialDetailsSection klant={klant} />
          
          {/* Factuuradres (als afwijkend) */}
          <InvoiceAddressSection klant={klant} />
        </div>

        {/* Bedrijfsgegevens - Collapsible */}
        {(klant.type_klant === 'ZZP' || klant.type_klant === 'MKB') && (klant.kvk_nummer || klant.btw_nummer) && (
          <Collapsible open={isBedrijfsOpen} onOpenChange={setIsBedrijfsOpen}>
            <Card className="border-ka-gray-200 dark:border-gray-700">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-ka-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <CardTitle className={`${responsiveHeading.h4} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-ka-green" />
                      Bedrijfsgegevens
                    </div>
                    <ChevronDown className={`w-5 h-5 text-ka-gray-500 transition-transform ${isBedrijfsOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className={`pt-0 ${spacing.stack.sm}`}>
                  {klant.kvk_nummer && (
                    <div>
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">KvK nummer</div>
                      <div className="text-sm font-mono text-ka-navy dark:text-white">
                        {klant.kvk_nummer}
                      </div>
                    </div>
                  )}
                  
                  {klant.btw_nummer && (
                    <div>
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">BTW nummer</div>
                      <div className="text-sm font-mono text-ka-navy dark:text-white">
                        {klant.btw_nummer}
                      </div>
                    </div>
                  )}

                  {klant.jaren_actief_als_ondernemer && (
                    <div>
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Jaren actief als ondernemer</div>
                      <div className="text-sm text-ka-navy dark:text-white">
                        {klant.jaren_actief_als_ondernemer} jaar
                      </div>
                    </div>
                  )}

                  {klant.omzet_categorie && (
                    <div>
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Omzet categorie</div>
                      <Badge variant="secondary">{klant.omzet_categorie}</Badge>
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
                      Persoonlijke gegevens
                    </div>
                    <ChevronDown className={`w-5 h-5 text-ka-gray-500 transition-transform ${isPersoonlijkOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className={`pt-0 ${spacing.stack.sm}`}>
                  {klant.geboortedatum && (
                    <div>
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Geboortedatum</div>
                      <div className="text-sm text-ka-navy dark:text-white">
                        {formatDate(klant.geboortedatum, currentUser?.language || 'nl')}
                      </div>
                    </div>
                  )}
                  
                  {klant.bsn && (
                    <div>
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1 flex items-center">
                        <ShieldAlert className="w-3 h-3 mr-1 text-amber-500" />
                        BSN (Gevoelig)
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

        {/* Financiële gegevens - Collapsible */}
        {(klant.iban || klant.betalingstermijn) && (
          <Collapsible open={isFinancieelOpen} onOpenChange={setIsFinancieelOpen}>
            <Card className="border-ka-gray-200 dark:border-gray-700">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-ka-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <CardTitle className={`${responsiveHeading.h4} flex items-center justify-between`}>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-ka-green" />
                      Financiële gegevens
                    </div>
                    <ChevronDown className={`w-5 h-5 text-ka-gray-500 transition-transform ${isFinancieelOpen ? 'rotate-180' : ''}`} />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${spacing.grid.md}`}>
                    <div className="space-y-3">
                      {klant.iban && (
                        <div>
                          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">IBAN</div>
                          <div className="text-sm font-mono text-ka-navy dark:text-white">
                            {klant.iban}
                          </div>
                          {klant.bank_naam && (
                            <div className="text-xs text-ka-gray-500 dark:text-gray-400 mt-1">
                              {klant.bank_naam}
                            </div>
                          )}
                        </div>
                      )}

                      {klant.bic && (
                        <div>
                          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">BIC</div>
                          <div className="text-sm font-mono text-ka-navy dark:text-white">
                            {klant.bic}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {klant.alternatief_iban && (
                        <div>
                          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Alternatief IBAN</div>
                          <div className="text-sm font-mono text-ka-navy dark:text-white">
                            {klant.alternatief_iban}
                          </div>
                        </div>
                      )}

                      {klant.betalingstermijn && (
                        <div>
                          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Betalingstermijn</div>
                          <div className="text-sm text-ka-navy dark:text-white">
                            {klant.betalingstermijn} dagen
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                      Notities
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
        
        {/* Tabs - Optimized for 360px with horizontal scroll */}
        <Tabs defaultValue="timeline" className="space-y-2 xs:space-y-3 sm:space-y-4 lg:space-y-6">
          <TabsList className="w-full overflow-x-auto flex-nowrap justify-start scrollbar-hide h-9 xs:h-10 sm:h-11 p-0.5 xs:p-1">
            <TabsTrigger value="timeline" className="flex-shrink-0 text-[11px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4">
              <span className="hidden xs:inline">Tijdlijn</span>
              <span className="xs:hidden">Tijd</span>
              <span className="ml-0.5 xs:ml-1 text-[10px] xs:text-xs">({interacties?.results.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex-shrink-0 text-[11px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4">
              <span className="hidden xs:inline">Opdrachten</span>
              <span className="xs:hidden">Opdr</span>
              <span className="ml-0.5 xs:ml-1 text-[10px] xs:text-xs">({klant.aantal_opdrachten || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-shrink-0 text-[11px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4">
              <span>Taken</span>
              <span className="ml-0.5 xs:ml-1 text-[10px] xs:text-xs">({klant.aantal_openstaande_taken || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex-shrink-0 text-[11px] xs:text-xs sm:text-sm px-2 xs:px-3 sm:px-4">
              <span className="hidden xs:inline">Contactpersonen</span>
              <span className="xs:hidden">Cont</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            <ClientInteractionsTimeline klantId={id!} />
          </TabsContent>
          
          <TabsContent value="assignments">
            <ClientAssignments klantId={id!} />
          </TabsContent>
          
          <TabsContent value="tasks">
            <ClientTasks klantId={id!} />
          </TabsContent>
          
          <TabsContent value="contacts">
            <ClientContactPersons klantId={id!} />
          </TabsContent>
        </Tabs>
        
        {/* Audit Section */}
        <ClientAuditSection klant={klant} />
      </div>

      {/* Edit Dialog */}
      {klant && (
        <EditClientDialog
          klant={klant}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
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
            <AlertDialogTitle>Klant archiveren?</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je <strong>{klant?.naam}</strong> wilt archiveren? 
              De klant blijft zichtbaar in historische weergave maar wordt niet meer actief getoond.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                toast.success(`${klant?.naam} is gearchiveerd`);
                setIsArchiveDialogOpen(false);
              }}
              className="bg-ka-warning hover:bg-ka-warning/90"
            >
              Archiveren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
