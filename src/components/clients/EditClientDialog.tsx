import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Klant } from '@/types';
import { useUpdateKlant } from '@/lib/api/klanten';
import { toast } from 'sonner';

interface EditClientDialogProps {
  klant: Klant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditClientDialog({ klant, open, onOpenChange }: EditClientDialogProps) {
  const { t } = useTranslation();
  const updateKlant = useUpdateKlant();
  const [formData, setFormData] = useState<Partial<Klant>>({
    naam: klant.naam,
    email: klant.email,
    telefoonnummer: klant.telefoonnummer,
    mobiel: klant.mobiel || '',
    adres: klant.adres,
    postcode: klant.postcode,
    plaats: klant.plaats,
    status: klant.status,
    voorkeur_kanaal: klant.voorkeur_kanaal,
    notities: klant.notities || '',
    interne_notities: klant.interne_notities || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateKlant.mutate(
      { id: klant.id, data: formData },
      {
        onSuccess: () => {
          toast.success('Klantgegevens succesvol bijgewerkt');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Er ging iets mis bij het opslaan');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bewerk klantgegevens</DialogTitle>
          <DialogDescription>
            Wijzig de gegevens van {klant.naam}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basisinformatie */}
          <div className="space-y-4">
            <h3 className="font-semibold text-ka-navy dark:text-white">Basisinformatie</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="naam">Naam *</Label>
                <Input
                  id="naam"
                  value={formData.naam}
                  onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Klant['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actief">Actief</SelectItem>
                    <SelectItem value="Inactief">Inactief</SelectItem>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contactgegevens */}
          <div className="space-y-4">
            <h3 className="font-semibold text-ka-navy dark:text-white">Contactgegevens</h3>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefoonnummer">Telefoon *</Label>
                <Input
                  id="telefoonnummer"
                  value={formData.telefoonnummer}
                  onChange={(e) => setFormData({ ...formData, telefoonnummer: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="mobiel">Mobiel</Label>
                <Input
                  id="mobiel"
                  value={formData.mobiel}
                  onChange={(e) => setFormData({ ...formData, mobiel: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="voorkeur_kanaal">Voorkeur communicatie</Label>
              <Select value={formData.voorkeur_kanaal || ''} onValueChange={(value) => setFormData({ ...formData, voorkeur_kanaal: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer kanaal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="E-mail">E-mail</SelectItem>
                  <SelectItem value="Telefoon">Telefoon</SelectItem>
                  <SelectItem value="Zoom">Zoom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Adresgegevens */}
          <div className="space-y-4">
            <h3 className="font-semibold text-ka-navy dark:text-white">Adresgegevens</h3>
            
            <div>
              <Label htmlFor="adres">Adres</Label>
              <Input
                id="adres"
                value={formData.adres}
                onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="plaats">Plaats</Label>
                <Input
                  id="plaats"
                  value={formData.plaats}
                  onChange={(e) => setFormData({ ...formData, plaats: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-ka-navy dark:text-white">Notities</h3>
            
            <div>
              <Label htmlFor="notities">Algemene notities</Label>
              <Textarea
                id="notities"
                value={formData.notities}
                onChange={(e) => setFormData({ ...formData, notities: e.target.value })}
                rows={3}
                placeholder="Algemene opmerkingen over deze klant..."
              />
            </div>
            
            <div>
              <Label htmlFor="interne_notities">Interne notities</Label>
              <Textarea
                id="interne_notities"
                value={formData.interne_notities}
                onChange={(e) => setFormData({ ...formData, interne_notities: e.target.value })}
                rows={3}
                placeholder="Alleen zichtbaar voor het team..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" className="bg-ka-green hover:bg-ka-green/90" disabled={updateKlant.isPending}>
              {updateKlant.isPending ? 'Opslaan...' : 'Opslaan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
