import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Edit, Archive, MoreVertical, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKlant } from '@/lib/api/klanten';
import { useInteractiesByKlant } from '@/lib/api/interacties';
import ClientInteractionsTimeline from '@/components/clients/ClientInteractionsTimeline';
import ClientAssignments from '@/components/clients/ClientAssignments';
import ClientTasks from '@/components/clients/ClientTasks';
import ClientContactPersons from '@/components/clients/ClientContactPersons';
import { formatDate } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['clients', 'common']);
  const { currentUser } = useUserStore();
  const { data: klant, isLoading } = useKlant(id!);
  const { data: interacties } = useInteractiesByKlant(id!);
  
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
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-ka-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-ka-navy dark:bg-ka-green text-white flex items-center justify-center text-2xl font-bold">
                {klant.naam.substring(0, 2).toUpperCase()}
              </div>
              
              {/* Client info */}
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-ka-navy dark:text-white">
                    {klant.naam}
                  </h1>
                  <Badge className={
                    klant.status === 'Actief' 
                      ? 'bg-ka-green' 
                      : klant.status === 'Prospect'
                      ? 'bg-ka-warning'
                      : 'bg-ka-gray-500'
                  }>
                    {klant.status}
                  </Badge>
                  {klant.segment && (
                    <Badge variant="secondary">
                      {klant.segment}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-ka-gray-600 dark:text-gray-300">
                  <span className="flex items-center space-x-1">
                    <span className="font-medium">{klant.type_klant}</span>
                    <span>•</span>
                    <span>{klant.klant_type_details}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>Klant nummer:</span>
                    <span className="font-mono">{klant.klant_nummer}</span>
                  </span>
                </div>
                
                {/* Tags */}
                {klant.tags && klant.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {klant.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Bewerken
              </Button>
              <Button variant="ghost" size="icon">
                <Archive className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Eerste contact */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-ka-gray-500 dark:text-gray-400 mb-1">Klant sinds</div>
              <div className="text-2xl font-bold text-ka-navy dark:text-white">
                {formatDate(klant.sinds_wanneer_klant, currentUser?.language || 'nl')}
              </div>
              <div className="text-xs text-ka-gray-500 dark:text-gray-400 mt-1">
                {klant.jaren_als_klant} jaar
              </div>
            </CardContent>
          </Card>
          
          {/* Totaal gesprekken */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-ka-gray-500 dark:text-gray-400 mb-1">Totaal gesprekken</div>
              <div className="text-2xl font-bold text-ka-navy dark:text-white">
                {klant.aantal_interacties || 0}
              </div>
              <div className="text-xs text-ka-green mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Laatste: {interacties?.results[0]?.datum || '-'}
              </div>
            </CardContent>
          </Card>
          
          {/* Opdrachten */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-ka-gray-500 dark:text-gray-400 mb-1">Opdrachten</div>
              <div className="text-2xl font-bold text-ka-navy dark:text-white">
                {klant.aantal_actieve_opdrachten || 0}
              </div>
              <div className="text-xs text-ka-gray-500 dark:text-gray-400 mt-1">
                Totaal: {klant.aantal_opdrachten || 0}
              </div>
            </CardContent>
          </Card>
          
          {/* Lifetime value */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-ka-gray-500 dark:text-gray-400 mb-1">Lifetime Value</div>
              <div className="text-2xl font-bold text-ka-green">
                €{klant.totale_omzet?.toLocaleString('nl-NL') || '0'}
              </div>
              <div className="text-xs text-ka-gray-500 dark:text-gray-400 mt-1">
                Gemiddeld: €{klant.totale_omzet && klant.aantal_opdrachten 
                  ? Math.round(klant.totale_omzet / klant.aantal_opdrachten).toLocaleString('nl-NL')
                  : '0'
                } per opdracht
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Contact Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contactinformatie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-ka-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400">E-mail</div>
                    <a href={`mailto:${klant.email}`} className="text-sm text-ka-navy dark:text-white hover:underline">
                      {klant.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-ka-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400">Telefoon</div>
                    <a href={`tel:${klant.telefoonnummer}`} className="text-sm text-ka-navy dark:text-white hover:underline">
                      {klant.telefoonnummer}
                    </a>
                    {klant.mobiel && (
                      <div className="text-xs text-ka-gray-500 dark:text-gray-400">
                        Mobiel: {klant.mobiel}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-ka-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400">Adres</div>
                    <div className="text-sm text-ka-gray-900 dark:text-gray-100">
                      {klant.adres}<br />
                      {klant.postcode} {klant.plaats}<br />
                      {klant.land}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Accountmanager</div>
                  <div className="text-sm font-medium text-ka-navy dark:text-white">
                    {klant.accountmanager}
                  </div>
                </div>
                
                {klant.voorkeur_kanaal && (
                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Voorkeur communicatie</div>
                    <div className="text-sm text-ka-gray-900 dark:text-gray-100">
                      {klant.voorkeur_kanaal}
                    </div>
                  </div>
                )}
                
                {klant.groei_fase && klant.groei_fase !== 'N.V.T.' && (
                  <div>
                    <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Groei fase</div>
                    <Badge className="bg-ka-green">
                      {klant.groei_fase}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            {/* Notities */}
            {klant.notities && (
              <div className="mt-6 pt-6 border-t border-ka-gray-200 dark:border-gray-700">
                <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-2">Notities</div>
                <div className="text-sm text-ka-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-ka-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  {klant.notities}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">
              Tijdlijn ({interacties?.results.length || 0})
            </TabsTrigger>
            <TabsTrigger value="assignments">
              Opdrachten ({klant.aantal_opdrachten || 0})
            </TabsTrigger>
            <TabsTrigger value="tasks">
              Taken ({klant.aantal_openstaande_taken || 0})
            </TabsTrigger>
            <TabsTrigger value="contacts">
              Contactpersonen
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
      </div>
    </div>
  );
}
