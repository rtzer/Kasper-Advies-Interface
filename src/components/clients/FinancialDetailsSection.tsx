import { CreditCard, Building, Lock, Landmark, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Klant } from '@/types';

interface FinancialDetailsSectionProps {
  klant: Klant;
}

const maskIBAN = (iban: string) => {
  if (!iban) return '';
  // NL91 ABNA 0417 1643 00 → NL91 ABNA **** **43 00
  const parts = iban.split(' ');
  if (parts.length >= 4) {
    return `${parts[0]} ${parts[1]} **** **${parts[parts.length - 1].slice(-2)} ${parts[parts.length - 1].slice(0, 2)}`;
  }
  return iban;
};

const maskBSN = (bsn: string) => {
  if (!bsn) return '';
  // 123456789 → ***-**-6789
  return `***-**-${bsn.slice(-4)}`;
};

export default function FinancialDetailsSection({ klant }: FinancialDetailsSectionProps) {
  const hasBusiness = klant.type_klant === 'MKB' || klant.type_klant === 'ZZP';
  const hasPersonal = klant.type_klant === 'Particulier';
  
  const hasFinancialInfo = 
    klant.kvk_nummer || 
    klant.btw_nummer || 
    klant.bsn || 
    klant.iban || 
    klant.betalingstermijn;

  if (!hasFinancialInfo) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ka-navy dark:text-white flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Financiële gegevens
      </h3>

      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bedrijfsgegevens */}
          {hasBusiness && (
            <>
              {klant.kvk_nummer && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Building className="w-4 h-4 text-ka-gray-500" />
                    <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                      KvK nummer
                    </p>
                  </div>
                  <p className="font-mono text-sm font-medium text-ka-navy dark:text-white">
                    {klant.kvk_nummer}
                  </p>
                </div>
              )}

              {klant.btw_nummer && (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Building className="w-4 h-4 text-ka-gray-500" />
                    <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                      BTW nummer
                    </p>
                  </div>
                  <p className="font-mono text-sm font-medium text-ka-navy dark:text-white">
                    {klant.btw_nummer}
                  </p>
                </div>
              )}
            </>
          )}

          {/* BSN (alleen particulier) */}
          {hasPersonal && klant.bsn && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Lock className="w-4 h-4 text-red-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  BSN
                </p>
                <Badge variant="destructive" className="text-xs">
                  Gevoelig
                </Badge>
              </div>
              <p className="font-mono text-sm font-medium text-ka-navy dark:text-white">
                {maskBSN(klant.bsn)}
              </p>
            </div>
          )}

          {/* Bankgegevens */}
          {klant.iban && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Landmark className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  IBAN
                </p>
              </div>
              <p className="font-mono text-sm font-medium text-ka-navy dark:text-white">
                {maskIBAN(klant.iban)}
              </p>
              {klant.bank_naam && (
                <p className="text-xs text-ka-gray-600 dark:text-gray-400 mt-1">
                  {klant.bank_naam}
                </p>
              )}
            </div>
          )}

          {klant.bic && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Landmark className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  BIC
                </p>
              </div>
              <p className="font-mono text-sm font-medium text-ka-navy dark:text-white">
                {klant.bic}
              </p>
            </div>
          )}

          {klant.betalingstermijn && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  Betalingstermijn
                </p>
              </div>
              <p className="text-sm font-medium text-ka-navy dark:text-white">
                {klant.betalingstermijn} dagen
              </p>
            </div>
          )}

          {klant.facturatie_frequentie && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  Facturatiefrequentie
                </p>
              </div>
              <p className="text-sm font-medium text-ka-navy dark:text-white">
                {klant.facturatie_frequentie}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
