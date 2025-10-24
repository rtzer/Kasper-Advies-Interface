import { useState } from 'react';
import { useCreateKlant } from '@/lib/api/klanten';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateClientDialog({ open, onOpenChange }: CreateClientDialogProps) {
  const { toast } = useToast();
  const createKlant = useCreateKlant();
  
  const [formData, setFormData] = useState({
    naam: '',
    type_klant: 'ZZP' as 'ZZP' | 'MKB',
    email: '',
    telefoonnummer: '',
    status: 'Prospect' as 'Actief' | 'Inactief' | 'Prospect',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createKlant.mutateAsync(formData);
      toast({
        title: 'Klant aangemaakt',
        description: `${formData.naam} is succesvol toegevoegd.`,
      });
      onOpenChange(false);
      setFormData({
        naam: '',
        type_klant: 'ZZP',
        email: '',
        telefoonnummer: '',
        status: 'Prospect',
      });
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het aanmaken van de klant.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Klant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="naam">Naam *</Label>
            <Input
              id="naam"
              value={formData.naam}
              onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
              placeholder="Bedrijfsnaam of contactpersoon"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type_klant">Type *</Label>
            <Select 
              value={formData.type_klant} 
              onValueChange={(value: 'ZZP' | 'MKB') => setFormData({ ...formData, type_klant: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ZZP">ZZP</SelectItem>
                <SelectItem value="MKB">MKB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@voorbeeld.nl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefoonnummer">Telefoonnummer</Label>
            <Input
              id="telefoonnummer"
              type="tel"
              value={formData.telefoonnummer}
              onChange={(e) => setFormData({ ...formData, telefoonnummer: e.target.value })}
              placeholder="+31 6 12345678"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={createKlant.isPending}>
              {createKlant.isPending ? 'Aanmaken...' : 'Klant aanmaken'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}