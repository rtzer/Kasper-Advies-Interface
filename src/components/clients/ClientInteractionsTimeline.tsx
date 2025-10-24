import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInteractiesByKlant } from '@/lib/api/interacties';
import { Channel, Interactie } from '@/types';
import { getChannelIcon, getChannelColor } from '@/lib/utils/channelHelpers';
import { formatDateTime } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import InteractieDetailModal from './InteractieDetailModal';

interface ClientInteractionsTimelineProps {
  klantId: string;
}

export default function ClientInteractionsTimeline({ klantId }: ClientInteractionsTimelineProps) {
  const { currentUser } = useUserStore();
  const { data: interacties, isLoading } = useInteractiesByKlant(klantId);
  const [filterChannel, setFilterChannel] = useState<Channel | 'all'>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [selectedInteractie, setSelectedInteractie] = useState<Interactie | null>(null);
  
  const filteredInteracties = interacties?.results.filter((int) => {
    const matchesChannel = filterChannel === 'all' || int.kanaal === filterChannel;
    const matchesSentiment = filterSentiment === 'all' || int.sentiment === filterSentiment;
    return matchesChannel && matchesSentiment;
  });
  
  // Group by month
  const groupedByMonth = filteredInteracties?.reduce((groups, int) => {
    const month = new Date(int.datum).toLocaleDateString('nl-NL', { 
      year: 'numeric', 
      month: 'long' 
    });
    if (!groups[month]) groups[month] = [];
    groups[month].push(int);
    return groups;
  }, {} as Record<string, typeof interacties.results>);
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-ka-gray-500 dark:text-gray-400" />
          
          <Select value={filterChannel} onValueChange={(v) => setFilterChannel(v as Channel | 'all')}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Alle kanalen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle kanalen</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="E-mail">E-mail</SelectItem>
              <SelectItem value="Telefoon">Telefoon</SelectItem>
              <SelectItem value="Zoom">Zoom</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterSentiment} onValueChange={setFilterSentiment}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Alle sentimenten" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle sentimenten</SelectItem>
              <SelectItem value="Positief">Positief</SelectItem>
              <SelectItem value="Neutraal">Neutraal</SelectItem>
              <SelectItem value="Negatief">Negatief</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      
      {/* Timeline */}
      {isLoading ? (
        <div className="text-center py-12 text-ka-gray-500 dark:text-gray-400">Laden...</div>
      ) : !groupedByMonth || Object.keys(groupedByMonth).length === 0 ? (
        <div className="text-center py-12 text-ka-gray-500 dark:text-gray-400">
          Geen interacties gevonden
        </div>
      ) : (
        Object.entries(groupedByMonth).map(([month, interactions]) => (
          <div key={month}>
            {/* Month header */}
            <div className="flex items-center mb-4">
              <div className="bg-ka-navy dark:bg-ka-green text-white px-4 py-2 rounded-full text-sm font-medium">
                {month}
              </div>
              <div className="flex-1 h-px bg-ka-gray-200 dark:bg-gray-700 ml-4"></div>
            </div>
            
            {/* Interactions */}
            <div className="space-y-4 ml-4 border-l-2 border-ka-gray-200 dark:border-gray-700 pl-6">
              {interactions.map((int) => (
                <Card 
                  key={int.id} 
                  className="p-4 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] border-2 border-transparent hover:border-ka-green relative group"
                  onClick={() => setSelectedInteractie(int)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: getChannelColor(int.kanaal) + '20' }}
                      >
                        {getChannelIcon(int.kanaal)}
                      </div>
                      <div>
                        <h4 className="font-medium text-ka-navy dark:text-white">{int.onderwerp}</h4>
                        <div className="flex items-center space-x-2 text-sm text-ka-gray-500 dark:text-gray-400">
                          <span>{formatDateTime(int.datum + 'T' + int.tijd, currentUser?.language || 'nl')}</span>
                          <span>•</span>
                          <span>{int.medewerker}</span>
                          <span>•</span>
                          <Badge variant={int.type === 'Inbound' ? 'default' : 'secondary'} className="text-xs">
                            {int.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={
                          int.sentiment === 'Positief' ? 'bg-ka-green' :
                          int.sentiment === 'Negatief' ? 'bg-ka-danger' :
                          'bg-ka-gray-500'
                        }
                      >
                        {int.sentiment === 'Positief' ? '😊' : int.sentiment === 'Negatief' ? '😟' : '😐'} {int.sentiment}
                      </Badge>
                      
                      {int.opvolging_nodig && (
                        <Badge variant="destructive">
                          Opvolging vereist
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-ka-gray-700 dark:text-gray-300 whitespace-pre-wrap">
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

                  {/* Hover indicator */}
                  <div className="absolute bottom-3 right-3 text-xs text-ka-green opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <span>Bekijk gesprek</span>
                    <span>→</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
      
      <InteractieDetailModal
        interactie={selectedInteractie}
        open={!!selectedInteractie}
        onOpenChange={(open) => !open && setSelectedInteractie(null)}
      />
    </div>
  );
}
