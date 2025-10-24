import { useState } from 'react';
import { Mail, Phone, User, Plus, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import ContactPersoonModal from './ContactPersoonModal';
import { ContactPersoon as ContactPersoonType } from '@/types';

interface ContactPersoon {
  id: string;
  naam: string;
  functie: string;
  email: string;
  telefoon: string;
  mobiel?: string;
  primair: boolean;
  laatste_contact?: string;
}

// Mock data - dit zou uit de API moeten komen
const mockContactPersonen: ContactPersoon[] = [
  {
    id: '1',
    naam: 'Peter van Dam',
    functie: 'CFO',
    email: 'p.vandam@example.com',
    telefoon: '+31201234567',
    mobiel: '+31612345678',
    primair: true,
    laatste_contact: '2024-10-20',
  },
  {
    id: '2',
    naam: 'Sarah de Vries',
    functie: 'HR Manager',
    email: 's.devries@example.com',
    telefoon: '+31201234568',
    primair: false,
    laatste_contact: '2024-09-15',
  },
];

export default function ClientContactPersons({ klantId }: { klantId: string }) {
  const [contactPersonen] = useState<ContactPersoon[]>(mockContactPersonen);
  const [selectedContact, setSelectedContact] = useState<ContactPersoon | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (contactPersonen.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-ka-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <User className="w-8 h-8 text-ka-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-ka-navy dark:text-white mb-2">Nog geen contactpersonen</h3>
            <p className="text-sm text-ka-gray-600 dark:text-gray-400 mb-4">
              Voeg contactpersonen toe om communicatie te personaliseren
            </p>
            <Button className="bg-ka-green hover:bg-ka-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Voeg contactpersoon toe
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ka-navy dark:text-white">
          {contactPersonen.length} contactpersonen
        </h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-ka-green hover:bg-ka-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Toevoegen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuwe contactpersoon</DialogTitle>
              <DialogDescription>
                Voeg een nieuwe contactpersoon toe voor deze klant
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="naam">Naam</Label>
                <Input id="naam" placeholder="Volledige naam" />
              </div>
              <div>
                <Label htmlFor="functie">Functie</Label>
                <Input id="functie" placeholder="CFO, Manager, etc." />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div>
                <Label htmlFor="telefoon">Telefoon</Label>
                <Input id="telefoon" placeholder="+31..." />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="primair" />
                <label
                  htmlFor="primair"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Primair contactpersoon
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuleren
                </Button>
                <Button className="bg-ka-green hover:bg-ka-green/90">
                  Opslaan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contactPersonen.map((contact) => (
          <Card
            key={contact.id}
            className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] border-2 border-transparent hover:border-ka-green"
            onClick={() => setSelectedContact(contact)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-ka-navy dark:bg-ka-green text-white flex items-center justify-center text-lg font-bold">
                  {contact.naam.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-ka-navy dark:text-white">{contact.naam}</h4>
                  <p className="text-sm text-ka-gray-600 dark:text-gray-400">{contact.functie}</p>
                </div>
              </div>
              {contact.primair && (
                <Badge className="bg-ka-green text-white">Primair</Badge>
              )}
            </div>

            <div className="space-y-2">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center space-x-2 text-sm text-ka-gray-700 dark:text-gray-300 hover:text-ka-green transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-4 h-4" />
                <span>{contact.email}</span>
              </a>
              
              <a
                href={`tel:${contact.telefoon}`}
                className="flex items-center space-x-2 text-sm text-ka-gray-700 dark:text-gray-300 hover:text-ka-green transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-4 h-4" />
                <span>{contact.telefoon}</span>
              </a>

              {contact.laatste_contact && (
                <div className="flex items-center space-x-2 text-xs text-ka-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-ka-gray-200 dark:border-gray-700">
                  <Calendar className="w-3 h-3" />
                  <span>Laatste contact: {new Date(contact.laatste_contact).toLocaleDateString('nl-NL')}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <ContactPersoonModal
        contactPersoon={selectedContact as ContactPersoonType | null}
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      />
    </div>
  );
}
