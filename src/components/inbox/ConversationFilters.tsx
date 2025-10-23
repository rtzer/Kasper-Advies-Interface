import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useConversationStore } from '@/store/conversationStore';

export default function ConversationFilters() {
  const { t } = useTranslation(['navigation']);
  const { filterChannel, setFilterChannel, filterStatus, setFilterStatus } = useConversationStore();
  
  return (
    <div className="mt-3 space-y-2">
      {/* Channel filter */}
      <Select value={filterChannel || 'all'} onValueChange={(v) => setFilterChannel(v === 'all' ? null : v)}>
        <SelectTrigger className="w-full bg-white dark:bg-gray-700">
          <SelectValue placeholder={t('navigation:channels.all')} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 z-50">
          <SelectItem value="all">{t('navigation:channels.all')}</SelectItem>
          <SelectItem value="WhatsApp">{t('navigation:channels.whatsapp')}</SelectItem>
          <SelectItem value="E-mail">{t('navigation:channels.email')}</SelectItem>
          <SelectItem value="Telefoon">{t('navigation:channels.phone')}</SelectItem>
          <SelectItem value="Zoom">{t('navigation:channels.video')}</SelectItem>
          <SelectItem value="SMS">{t('navigation:channels.sms')}</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Status filter */}
      <Select value={filterStatus || 'all'} onValueChange={(v) => setFilterStatus(v === 'all' ? null : v)}>
        <SelectTrigger className="w-full bg-white dark:bg-gray-700">
          <SelectValue placeholder="Alle statussen" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 z-50">
          <SelectItem value="all">Alle statussen</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="pending">In behandeling</SelectItem>
          <SelectItem value="resolved">Afgerond</SelectItem>
          <SelectItem value="archived">Gearchiveerd</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
