import { Link } from 'react-router-dom';
import { Building2, User, Briefcase, ArrowRight, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Klant } from '@/types';
import { useTranslation } from 'react-i18next';

interface RelatedClientsSectionProps {
  klant: Klant;
  relatedClients: Klant[];
}

const getClientIcon = (type: string) => {
  switch (type) {
    case 'MKB':
      return <Building2 className="w-5 h-5 text-ka-navy" />;
    case 'ZZP':
      return <Briefcase className="w-5 h-5 text-ka-green" />;
    case 'Particulier':
      return <User className="w-5 h-5 text-ka-blue" />;
    default:
      return <User className="w-5 h-5 text-ka-gray-500" />;
  }
};

const getClientTypeColor = (type: string) => {
  switch (type) {
    case 'MKB':
      return 'bg-ka-navy text-white';
    case 'ZZP':
      return 'bg-ka-green text-white';
    case 'Particulier':
      return 'bg-ka-blue text-white';
    default:
      return 'bg-ka-gray-500 text-white';
  }
};

export default function RelatedClientsSection({ klant, relatedClients }: RelatedClientsSectionProps) {
  const { t } = useTranslation();
  
  if (!relatedClients || relatedClients.length === 0) {
    return null;
  }
  
  // Check for ex-partner relationship
  const hasExPartner = klant.relatie_type?.toLowerCase().includes('ex-partner') || 
                       klant.relatie_type?.toLowerCase().includes('gescheiden');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ka-navy dark:text-white">
          {t('common:labels.relatedClients', 'Gerelateerde klanten')}
        </h3>
        <Badge variant="outline">
          {relatedClients.length} {relatedClients.length === 1 ? 'relatie' : 'relaties'}
        </Badge>
      </div>
      
      {/* Ex-partner warning */}
      {hasExPartner && (
        <Alert variant="destructive" className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-700 dark:text-orange-300 text-sm">
            {t('clients.relatedWarning.exPartner')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {relatedClients.map((related) => (
          <Link key={related.id} to={`/app/clients/${related.id}`}>
            <Card className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-ka-green border-2 border-transparent">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-ka-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {getClientIcon(related.type_klant)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-ka-navy dark:text-white mb-1 truncate">
                    {related.naam}
                  </h4>
                  <div className="text-xs text-muted-foreground mb-2">
                    {related.klant_nummer}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className={getClientTypeColor(related.type_klant)} variant="secondary">
                      {related.type_klant}
                    </Badge>
                    
                    {klant.relatie_type && (
                      <Badge variant="outline" className="text-xs">
                        {klant.relatie_type}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-ka-green mt-2">
                    <span>{t('common:labels.viewClientCard', 'Bekijk klantkaart')}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
