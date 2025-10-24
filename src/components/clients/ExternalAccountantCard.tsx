import { Building2, Mail, Phone, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Klant } from '@/types';

interface ExternalAccountantCardProps {
  klant: Klant;
}

export default function ExternalAccountantCard({ klant }: ExternalAccountantCardProps) {
  // Only show for MKB clients
  if (klant.type_klant !== 'MKB') {
    return null;
  }

  // No accountant linked
  if (!klant.externe_accountant) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Building2 className="w-5 h-5 text-ka-navy" />
        <h3 className="text-lg font-semibold text-ka-navy dark:text-white">
          Externe accountant
        </h3>
        <Badge className="bg-ka-navy text-white">
          Samenwerking
        </Badge>
      </div>

      <Card className="p-5 bg-gradient-to-br from-ka-navy/5 to-ka-blue/5 dark:from-ka-navy/10 dark:to-ka-blue/10">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-full bg-ka-navy flex items-center justify-center flex-shrink-0">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          
          <div className="flex-1 space-y-3">
            {klant.accountant_kantoor && (
              <div>
                <p className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">
                  Accountantskantoor
                </p>
                <h4 className="font-semibold text-ka-navy dark:text-white">
                  {klant.accountant_kantoor}
                </h4>
              </div>
            )}
            
            <div>
              <p className="text-xs text-ka-gray-500 dark:text-gray-400 mb-1">
                Contactpersoon
              </p>
              <p className="font-medium text-ka-navy dark:text-white">
                {klant.externe_accountant}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {klant.accountant_email && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${klant.accountant_email}`}>
                    <Mail className="w-3 h-3 mr-2" />
                    {klant.accountant_email}
                  </a>
                </Button>
              )}
              
              {klant.accountant_telefoonnummer && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${klant.accountant_telefoonnummer}`}>
                    <Phone className="w-3 h-3 mr-2" />
                    {klant.accountant_telefoonnummer}
                  </a>
                </Button>
              )}
            </div>
            
            {klant.samenwerking_sinds && (
              <div className="flex items-center text-xs text-ka-gray-600 dark:text-gray-400 pt-2 border-t border-ka-gray-200 dark:border-gray-700">
                <Calendar className="w-3 h-3 mr-2" />
                Samenwerking sinds {new Date(klant.samenwerking_sinds).toLocaleDateString('nl-NL', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
