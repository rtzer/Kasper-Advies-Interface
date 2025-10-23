import { useTranslation } from 'react-i18next';
import { Plus, Filter } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInteracties } from '@/lib/api/interacties';
import { getChannelIcon } from '@/lib/utils/channelHelpers';
import { formatDateTime } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { Link } from 'react-router-dom';

export default function ChannelWhatsAppPage() {
  const { t } = useTranslation(['common']);
  const { currentUser } = useUserStore();
  const [filterType, setFilterType] = useState<string>('all');
  const { data, isLoading } = useInteracties();
  
  // Filter for WhatsApp only
  const whatsappInteractions = data?.results.filter(int => int.kanaal === 'WhatsApp') || [];
  
  // Apply type filter
  const filteredInteractions = whatsappInteractions.filter(int => {
    if (filterType === 'all') return true;
    return int.type === filterType;
  });
  
  return (
    <div className="p-6 space-y-6 bg-ka-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getChannelIcon('WhatsApp')}</span>
          <div>
            <h1 className="text-2xl font-bold text-ka-navy dark:text-white">WhatsApp Gesprekken</h1>
            <p className="text-sm text-ka-gray-600 dark:text-gray-400 mt-1">
              {filteredInteractions.length} {filteredInteractions.length === 1 ? 'gesprek' : 'gesprekken'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alle types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle types</SelectItem>
              <SelectItem value="Inbound">Inbound</SelectItem>
              <SelectItem value="Outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="bg-ka-green hover:bg-ka-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Nieuw bericht
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-ka-gray-500 dark:text-gray-400 mb-1">Totaal gesprekken</div>
          <div className="text-2xl font-bold text-ka-navy dark:text-white">
            {whatsappInteractions.length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-ka-gray-500 dark:text-gray-400 mb-1">Inbound</div>
          <div className="text-2xl font-bold text-ka-green">
            {whatsappInteractions.filter(int => int.type === 'Inbound').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-ka-gray-500 dark:text-gray-400 mb-1">Outbound</div>
          <div className="text-2xl font-bold text-ka-navy dark:text-white">
            {whatsappInteractions.filter(int => int.type === 'Outbound').length}
          </div>
        </Card>
      </div>
      
      {/* Interactions List */}
      {isLoading ? (
        <div className="text-center py-12 text-ka-gray-500 dark:text-gray-400">
          {t('common:loading')}
        </div>
      ) : filteredInteractions.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">{getChannelIcon('WhatsApp')}</span>
          <p className="text-ka-gray-500 dark:text-gray-400">Geen WhatsApp gesprekken gevonden</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInteractions.map((int) => (
            <Link key={int.id} to={`/clients/${int.klant_id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-ka-navy dark:text-white">{int.klant_naam}</h3>
                      <Badge className={
                        int.type === 'Inbound' ? 'bg-ka-green' : 'bg-ka-navy'
                      }>
                        {int.type}
                      </Badge>
                      {int.sentiment && (
                        <Badge variant={
                          int.sentiment === 'Positief' ? 'default' : 
                          int.sentiment === 'Negatief' ? 'destructive' : 
                          'secondary'
                        } className="text-xs">
                          {int.sentiment === 'Positief' ? '😊' : int.sentiment === 'Negatief' ? '😟' : '😐'}
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="text-sm font-medium text-ka-gray-900 dark:text-gray-100 mb-1">
                      {int.onderwerp}
                    </h4>
                    <p className="text-xs text-ka-gray-500 dark:text-gray-400 mb-2">
                      {formatDateTime(int.datum + 'T' + int.tijd, currentUser?.language || 'nl')} • {int.medewerker}
                    </p>
                    
                    <p className="text-sm text-ka-gray-700 dark:text-gray-300 line-clamp-2">
                      {int.samenvatting}
                    </p>
                    
                    {int.tags && int.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {int.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {int.opvolging_nodig && (
                    <Badge variant="destructive" className="ml-4">
                      Opvolging
                    </Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
