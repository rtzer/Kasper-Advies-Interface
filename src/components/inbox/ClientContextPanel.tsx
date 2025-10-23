import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useKlant } from '@/lib/api';
import { useInteractiesByKlant } from '@/lib/api';
import { formatDate, formatRelativeTime } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { getChannelIcon } from '@/lib/utils/channelHelpers';

interface ClientContextPanelProps {
  klantId: string;
}

export default function ClientContextPanel({ klantId }: ClientContextPanelProps) {
  const { t } = useTranslation(['common']);
  const { currentUser } = useUserStore();
  const { data: klant } = useKlant(klantId);
  const { data: interacties } = useInteractiesByKlant(klantId);
  
  if (!klant) {
    return (
      <div className="p-6 text-center text-ka-gray-500 dark:text-gray-400">
        {t('common:loading')}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Client header */}
      <div className="p-6 border-b border-ka-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-ka-navy dark:text-white mb-1">
              {klant.naam}
            </h2>
            <p className="text-sm text-ka-gray-500 dark:text-gray-400">
              {klant.type_klant} • {klant.klant_type_details}
            </p>
          </div>
          <Badge className={
            klant.status === 'Actief' 
              ? 'bg-ka-green hover:bg-ka-green text-white' 
              : 'bg-ka-gray-500 hover:bg-ka-gray-500 text-white'
          }>
            {klant.status}
          </Badge>
        </div>
        
        {/* Tags */}
        {klant.tags && klant.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {klant.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Contact info */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-ka-gray-500 dark:text-gray-400 flex-shrink-0" />
            <a href={`mailto:${klant.email}`} className="text-ka-navy dark:text-white hover:underline truncate">
              {klant.email}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-ka-gray-500 dark:text-gray-400 flex-shrink-0" />
            <a href={`tel:${klant.telefoonnummer}`} className="text-ka-navy dark:text-white hover:underline">
              {klant.telefoonnummer}
            </a>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-ka-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-ka-gray-600 dark:text-gray-300 truncate">
              {klant.plaats}, {klant.land}
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b border-ka-gray-200 dark:border-gray-700">
        <div>
          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Klant sinds</div>
          <div className="text-sm font-medium text-ka-navy dark:text-white">
            {klant.jaren_als_klant || 0}j
          </div>
        </div>
        <div>
          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Laatste contact</div>
          <div className="text-sm font-medium text-ka-navy dark:text-white truncate">
            {klant.laatste_contact_datum 
              ? formatRelativeTime(klant.laatste_contact_datum, currentUser?.language || 'nl')
              : '-'
            }
          </div>
        </div>
        <div>
          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Gesprekken</div>
          <div className="text-sm font-medium text-ka-navy dark:text-white">
            {klant.aantal_interacties || 0}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-6 border-b border-ka-gray-200 dark:border-gray-700">
        <div>
          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Opdrachten</div>
          <div className="text-sm font-medium text-ka-navy dark:text-white">
            {klant.aantal_opdrachten || 0}
          </div>
        </div>
        <div>
          <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">Omzet</div>
          <div className="text-sm font-medium text-ka-green">
            €{(klant.totale_omzet || 0).toLocaleString('nl-NL')}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="activity" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-6 mt-4">
          <TabsTrigger value="activity">Activiteit</TabsTrigger>
          <TabsTrigger value="notes">Notities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {interacties && interacties.results.length > 0 ? (
              interacties.results.slice(0, 10).map((int) => (
                <div key={int.id} className="flex items-start space-x-3 pb-4 border-b border-ka-gray-100 dark:border-gray-700 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-ka-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm flex-shrink-0">
                    {getChannelIcon(int.kanaal)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ka-navy dark:text-white">
                      {int.onderwerp}
                    </p>
                    <p className="text-xs text-ka-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(int.datum, currentUser?.language || 'nl')} • {int.kanaal}
                    </p>
                    <p className="text-xs text-ka-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {int.samenvatting}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ka-gray-500 dark:text-gray-400">
                Geen eerdere interacties
              </p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="flex-1 overflow-y-auto p-6">
          <div className="bg-ka-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-ka-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {klant.notities || 'Geen notities'}
            </p>
          </div>
          
          {klant.interne_notities && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-ka-gray-500 dark:text-gray-400 uppercase mb-2">
                Interne notities
              </h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-ka-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {klant.interne_notities}
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
