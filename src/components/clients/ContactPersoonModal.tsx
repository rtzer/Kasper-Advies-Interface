import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContactPersoon } from '@/types';
import { Mail, Phone, Smartphone, Linkedin, Calendar, MessageSquare, User } from 'lucide-react';

interface ContactPersoonModalProps {
  contactPersoon: ContactPersoon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getVoorkeurIcon = (voorkeur?: string) => {
  switch (voorkeur) {
    case 'E-mail':
      return <Mail className="w-4 h-4" />;
    case 'Telefoon':
      return <Phone className="w-4 h-4" />;
    case 'WhatsApp':
      return <MessageSquare className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function ContactPersoonModal({ contactPersoon, open, onOpenChange }: ContactPersoonModalProps) {
  if (!contactPersoon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-ka-navy text-white flex items-center justify-center text-lg font-medium">
              {contactPersoon.naam.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            {contactPersoon.naam}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Functie en bedrijf */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Functie</p>
            <p className="text-foreground">{contactPersoon.functie}</p>
            {contactPersoon.bedrijfsnaam && (
              <>
                <p className="text-sm font-medium text-muted-foreground mt-2 mb-1">Bedrijf</p>
                <p className="text-foreground">{contactPersoon.bedrijfsnaam}</p>
              </>
            )}
            {contactPersoon.primair && (
              <Badge variant="secondary" className="mt-2">Primair contactpersoon</Badge>
            )}
          </div>

          {/* Contactgegevens */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm text-foreground">Contactgegevens</h4>
            
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <a href={`mailto:${contactPersoon.email}`} className="text-ka-blue hover:underline">
                {contactPersoon.email}
              </a>
            </div>

            {contactPersoon.telefoonnummer && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a href={`tel:${contactPersoon.telefoonnummer}`} className="text-ka-blue hover:underline">
                  {contactPersoon.telefoonnummer}
                </a>
              </div>
            )}

            {contactPersoon.mobiel && (
              <div className="flex items-center gap-3 text-sm">
                <Smartphone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a href={`tel:${contactPersoon.mobiel}`} className="text-ka-blue hover:underline">
                  {contactPersoon.mobiel}
                </a>
              </div>
            )}

            {contactPersoon.linkedin && (
              <div className="flex items-center gap-3 text-sm">
                <Linkedin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a 
                  href={contactPersoon.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-ka-blue hover:underline"
                >
                  LinkedIn Profiel
                </a>
              </div>
            )}
          </div>

          {/* Voorkeuren */}
          {contactPersoon.voorkeur_communicatie && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-sm text-foreground mb-2">Voorkeuren</h4>
              <div className="flex items-center gap-2 text-sm">
                {getVoorkeurIcon(contactPersoon.voorkeur_communicatie)}
                <span className="text-muted-foreground">
                  Voorkeur: {contactPersoon.voorkeur_communicatie}
                </span>
              </div>
            </div>
          )}

          {/* Statistieken */}
          {(contactPersoon.aantal_interacties || contactPersoon.laatste_contact) && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-sm text-foreground mb-3">Statistieken</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {contactPersoon.aantal_interacties && (
                  <div>
                    <p className="text-muted-foreground mb-1">Interacties</p>
                    <p className="text-lg font-semibold text-foreground">{contactPersoon.aantal_interacties}</p>
                  </div>
                )}
                {contactPersoon.laatste_contact && (
                  <div>
                    <p className="text-muted-foreground mb-1">Laatste contact</p>
                    <p className="text-sm text-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {contactPersoon.laatste_contact}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notities */}
          {contactPersoon.notities && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-sm text-foreground mb-2">Notities</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {contactPersoon.notities}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={`mailto:${contactPersoon.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </a>
            </Button>
            {contactPersoon.mobiel && (
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={`tel:${contactPersoon.mobiel}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Bellen
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
