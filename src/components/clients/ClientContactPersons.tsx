import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, User, Plus, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import ContactPersoonModal from './ContactPersoonModal';
import { ContactPersoon } from '@/types';
import { useContactPersonenByKlant } from '@/lib/api/contactpersonen';

interface ClientContactPersonsProps {
  klantId: string;
  showHeader?: boolean;
  onAddClick?: () => void;
}

// Hook to get contact count (for parent components)
export function useContactPersonsCount(klantId: string): number {
  const { data } = useContactPersonenByKlant(klantId);
  return data?.count || 0;
}

export default function ClientContactPersons({ klantId, showHeader = false, onAddClick }: ClientContactPersonsProps) {
  const { t } = useTranslation('common');
  const { data, isLoading, error } = useContactPersonenByKlant(klantId);
  const contactPersonen = data?.results || [];
  const [selectedContact, setSelectedContact] = useState<ContactPersoon | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      setIsAddDialogOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-ka-green" />
        <p className="text-xs text-ka-gray-600 dark:text-gray-400 mt-2">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-xs text-red-500">{t('common.error')}</p>
      </div>
    );
  }

  if (contactPersonen.length === 0) {
    return (
      <div className="py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-ka-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
          <User className="w-6 h-6 text-ka-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="font-medium text-sm text-ka-navy dark:text-white mb-1">
          {t('clients.contactPersonsSection.noContactPersons')}
        </h3>
        <p className="text-xs text-ka-gray-600 dark:text-gray-400 mb-3">
          {t('clients.contactPersonsSection.noContactPersonsDescription')}
        </p>
        <Button size="sm" className="bg-ka-green hover:bg-ka-green/90" onClick={handleAddClick}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          {t('clients.contactPersonsSection.addContactPerson')}
        </Button>
      </div>
    );
  }

  // Add dialog component
  const addDialog = (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('clients.contactPersonsSection.newContactPerson')}</DialogTitle>
          <DialogDescription>
            {t('clients.contactPersonsSection.newContactPersonDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="naam">{t('clients.contactPersonsSection.name')}</Label>
            <Input id="naam" placeholder={t('clients.contactPersonsSection.namePlaceholder')} />
          </div>
          <div>
            <Label htmlFor="functie">{t('clients.contactPersonsSection.role')}</Label>
            <Input id="functie" placeholder={t('clients.contactPersonsSection.rolePlaceholder')} />
          </div>
          <div>
            <Label htmlFor="email">{t('clients.contactPersonsSection.email')}</Label>
            <Input id="email" type="email" placeholder={t('clients.contactPersonsSection.emailPlaceholder')} />
          </div>
          <div>
            <Label htmlFor="telefoon">{t('clients.contactPersonsSection.phone')}</Label>
            <Input id="telefoon" placeholder={t('clients.contactPersonsSection.phonePlaceholder')} />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="primair" />
            <label
              htmlFor="primair"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('clients.contactPersonsSection.primaryContact')}
            </label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button className="bg-ka-green hover:bg-ka-green/90">
              {t('clients.contactPersonsSection.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-3">
      {contactPersonen.map((contact) => (
        <Card
          key={contact.id}
          className="p-4 hover:shadow-md transition-all cursor-pointer border border-ka-gray-200 dark:border-gray-700 hover:border-ka-green"
          onClick={() => setSelectedContact(contact)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-ka-navy dark:bg-ka-green text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {contact.naam.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-ka-navy dark:text-white truncate">{contact.naam}</h4>
                  {contact.primair && (
                    <Badge className="bg-ka-green text-white text-[10px] px-1.5 py-0">
                      {t('clients.contactPersonsSection.primary')}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-ka-gray-600 dark:text-gray-400">{contact.functie}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <a
                href={`mailto:${contact.email}`}
                className="p-2 rounded-full hover:bg-ka-gray-100 dark:hover:bg-gray-700 text-ka-gray-500 hover:text-ka-green transition-colors"
                onClick={(e) => e.stopPropagation()}
                title={contact.email}
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${contact.telefoonnummer}`}
                className="p-2 rounded-full hover:bg-ka-gray-100 dark:hover:bg-gray-700 text-ka-gray-500 hover:text-ka-green transition-colors"
                onClick={(e) => e.stopPropagation()}
                title={contact.telefoonnummer}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Card>
      ))}

      {addDialog}

      <ContactPersoonModal
        contactPersoon={selectedContact}
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      />
    </div>
  );
}
