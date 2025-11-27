import { useTranslation } from 'react-i18next';
import { Clock, User, History, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';
import { Klant } from '@/types';

interface ClientAuditSectionProps {
  klant: Klant;
}

export function ClientAuditSection({ klant }: ClientAuditSectionProps) {
  const { t } = useTranslation();
  const { currentUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const lang = currentUser?.language || 'nl';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-ka-gray-200 dark:border-gray-700">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-ka-gray-50 dark:hover:bg-gray-800/50 transition-colors py-3 xs:py-4">
            <CardTitle className="text-sm xs:text-base flex items-center justify-between">
              <div className="flex items-center text-ka-navy dark:text-white">
                <History className="w-4 h-4 xs:w-5 xs:h-5 mr-2 text-ka-green" />
                {t('clients.audit.title')}
              </div>
              <ChevronDown className={`w-4 h-4 xs:w-5 xs:h-5 text-ka-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-3 xs:px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Created */}
              <div className="flex items-start gap-3 p-3 bg-ka-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-ka-green/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-ka-green" />
                </div>
                <div>
                  <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5">
                    {t('clients.audit.createdAt')}
                  </div>
                  <div className="text-sm font-medium text-ka-navy dark:text-white">
                    {klant.created_at 
                      ? formatDateTime(klant.created_at, lang)
                      : formatDateTime(klant.sinds_wanneer_klant, lang)
                    }
                  </div>
                </div>
              </div>
              
              {/* Created by */}
              <div className="flex items-start gap-3 p-3 bg-ka-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-ka-green/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-ka-green" />
                </div>
                <div>
                  <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5">
                    {t('clients.audit.createdBy')}
                  </div>
                  <div className="text-sm font-medium text-ka-navy dark:text-white">
                    {klant.accountmanager || 'Systeem'}
                  </div>
                </div>
              </div>
              
              {/* Last modified */}
              <div className="flex items-start gap-3 p-3 bg-ka-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5">
                    {t('clients.audit.lastModified')}
                  </div>
                  <div className="text-sm font-medium text-ka-navy dark:text-white">
                    {klant.updated_at 
                      ? formatDateTime(klant.updated_at, lang)
                      : t('clients.audit.noChanges')
                    }
                  </div>
                </div>
              </div>
              
              {/* Modified by */}
              <div className="flex items-start gap-3 p-3 bg-ka-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-ka-gray-500 dark:text-gray-400 mb-0.5">
                    {t('clients.audit.modifiedBy')}
                  </div>
                  <div className="text-sm font-medium text-ka-navy dark:text-white">
                    {klant.accountmanager || '-'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Full audit log link */}
            <div className="mt-4 pt-4 border-t border-ka-gray-200 dark:border-gray-700">
              <Button variant="ghost" size="sm" className="text-ka-green hover:text-ka-green/80" disabled>
                <ExternalLink className="w-4 h-4 mr-2" />
                {t('clients.audit.viewFullLog')}
                <span className="ml-2 text-xs text-ka-gray-400">({t('common:comingSoon')})</span>
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
