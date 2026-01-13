import { Link } from 'react-router-dom';
import { Users, ArrowRight, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Klant } from '@/types';

interface PartnerSectionProps {
  klant: Klant;
  partner?: Klant;
}

export default function PartnerSection({ klant, partner }: PartnerSectionProps) {
  // Only show for Particulier clients
  if (klant.type_klant !== 'Particulier') {
    return null;
  }

  // No partner linked
  if (!partner && !klant.partner_naam) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Heart className="w-5 h-5 text-rose-500" />
        <h3 className="text-lg font-semibold text-ka-navy dark:text-white">
          Partner
        </h3>
        {klant.is_gezamenlijk && (
          <Badge className="bg-rose-500 text-white">
            Gezamenlijk
          </Badge>
        )}
      </div>

      {partner ? (
        <Link to={`/app/clients/${partner.id}`}>
          <Card className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-rose-500 border-2 border-transparent">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-rose-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-ka-navy dark:text-white mb-1">
                  {partner.naam}
                </h4>
                
                <p className="text-sm text-ka-gray-600 dark:text-gray-400 mb-2">
                  {partner.email}
                </p>
                
                {klant.is_gezamenlijk && (
                  <Badge variant="outline" className="text-xs mb-2">
                    Gezamenlijke IB-aangifte
                  </Badge>
                )}
                
                <div className="flex items-center text-xs text-rose-500 mt-2">
                  <span>Bekijk klantkaart partner</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ) : (
        <Card className="p-4 bg-rose-50 dark:bg-rose-900/10">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-rose-500" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-ka-navy dark:text-white mb-1">
                {klant.partner_naam}
              </h4>
              
              {klant.is_gezamenlijk && (
                <Badge variant="outline" className="text-xs">
                  Gezamenlijke IB-aangifte
                </Badge>
              )}
              
              <p className="text-xs text-ka-gray-600 dark:text-gray-400 mt-2">
                ⚠️ Partner niet gekoppeld als klant
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
