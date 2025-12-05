import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('common');
  const hasBusiness = klant.type_klant === 'MKB' || klant.type_klant === 'ZZP';
  const hasPersonal = klant.type_klant === 'Particulier';

  const hasFinancialInfo =
    klant.kvk_nummer ||
    klant.btw_nummer ||
    klant.bsn ||
    klant.iban ||
    klant.bic ||
    klant.bank_naam ||
    klant.alternatief_iban ||
    klant.betalingstermijn ||
    klant.facturatie_frequentie;

  if (!hasFinancialInfo) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ka-navy dark:text-white flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        {t('clients.financialSection.title')}
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
                      {t('clients.financialSection.kvkNumber')}
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
                      {t('clients.financialSection.vatNumber')}
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
          {hasPersonal && klant.bsn && klant.bsn !== 'None' && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Lock className="w-4 h-4 text-red-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  {t('clients.financialSection.bsn')}
                </p>
                <Badge variant="destructive" className="text-xs">
                  {t('clients.financialSection.sensitive')}
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
                  {t('clients.financialSection.iban')}
                </p>
              </div>
              <p className="font-mono text-sm font-medium text-ka-navy dark:text-white">
                {maskIBAN(klant.iban)}
              </p>
            </div>
          )}

          {klant.bank_naam && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Landmark className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  {t('clients.financialSection.bankName')}
                </p>
              </div>
              <p className="text-sm font-medium text-ka-navy dark:text-white">
                {klant.bank_naam}
              </p>
            </div>
          )}

          {klant.bic && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Landmark className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  {t('clients.financialSection.bic')}
                </p>
              </div>
              <p className="font-mono text-sm font-medium text-ka-navy dark:text-white">
                {klant.bic}
              </p>
            </div>
          )}

          {klant.alternatief_iban && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Landmark className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  {t('clients.financialSection.secondaryIban')}
                </p>
              </div>
              <p className="font-mono text-sm font-medium text-ka-navy dark:text-white">
                {maskIBAN(klant.alternatief_iban)}
              </p>
            </div>
          )}

          {klant.betalingstermijn && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  {t('clients.financialSection.paymentTerm')}
                </p>
              </div>
              <p className="text-sm font-medium text-ka-navy dark:text-white">
                {klant.betalingstermijn} {t('clients.days')}
              </p>
            </div>
          )}

          {klant.facturatie_frequentie && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="w-4 h-4 text-ka-gray-500" />
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  {t('clients.financialSection.invoiceFrequency')}
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
