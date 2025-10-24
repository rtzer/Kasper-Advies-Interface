import { Globe, Briefcase, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Klant } from '@/types';

interface BusinessDetailsSectionProps {
  klant: Klant;
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

export default function BusinessDetailsSection({ klant }: BusinessDetailsSectionProps) {
  // Only show for MKB/ZZP
  if (klant.type_klant === 'Particulier') {
    return null;
  }

  const hasBusinessInfo = 
    klant.website || 
    klant.branche || 
    klant.jaren_actief_als_ondernemer || 
    klant.groei_fase || 
    klant.omzet_categorie;

  if (!hasBusinessInfo) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ka-navy dark:text-white flex items-center">
        <Briefcase className="w-5 h-5 mr-2" />
        Zakelijke details
      </h3>

      <Card className="p-5">
        <div className="space-y-4">
          {/* Website & Branche */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {klant.website && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-ka-gray-500" />
                  <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                    Website
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
                    Branche
                  </p>
                </div>
                <p className="text-sm font-medium text-ka-navy dark:text-white">
                  {klant.branche}
                </p>
              </div>
            )}
          </div>

          {/* Groei indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-ka-gray-200 dark:border-gray-700">
            {klant.jaren_actief_als_ondernemer && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-ka-gray-500" />
                  <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                    Jaren actief
                  </p>
                </div>
                <p className="text-lg font-bold text-ka-navy dark:text-white">
                  {klant.jaren_actief_als_ondernemer} {klant.jaren_actief_als_ondernemer === 1 ? 'jaar' : 'jaar'}
                </p>
              </div>
            )}

            {klant.groei_fase && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-ka-gray-500" />
                  <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                    Groeifase
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
                    Omzet categorie
                  </p>
                </div>
                <Badge variant="outline" className="font-mono">
                  {klant.omzet_categorie}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
