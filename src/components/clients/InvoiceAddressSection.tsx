import { useTranslation } from 'react-i18next';
import { MapPin, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Klant } from '@/types';

interface InvoiceAddressSectionProps {
  klant: Klant;
}

export default function InvoiceAddressSection({ klant }: InvoiceAddressSectionProps) {
  const { t } = useTranslation('common');

  // Check if invoice address differs from main address
  const hasInvoiceAddress =
    klant.factuur_adres &&
    (klant.factuur_adres !== klant.adres ||
     klant.factuur_postcode !== klant.postcode ||
     klant.factuur_plaats !== klant.plaats);

  if (!hasInvoiceAddress) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-ka-navy" />
        <h3 className="text-lg font-semibold text-ka-navy dark:text-white">
          {t('clients.invoiceAddressSection.title')}
        </h3>
        <Badge className="bg-orange-500 text-white">
          {t('clients.invoiceAddressSection.different')}
        </Badge>
      </div>

      <Card className="p-5 bg-orange-50 dark:bg-orange-900/10">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>

          <div>
            <p className="text-sm font-medium text-ka-navy dark:text-white">
              {klant.factuur_adres}
            </p>
            <p className="text-sm text-ka-gray-600 dark:text-gray-400">
              {klant.factuur_postcode} {klant.factuur_plaats}
            </p>
            {klant.factuur_land && klant.factuur_land !== 'Nederland' && klant.factuur_land !== 'Netherlands' && (
              <p className="text-sm text-ka-gray-600 dark:text-gray-400">
                {klant.factuur_land}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
