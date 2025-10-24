import { useState } from 'react';
import { useCreateTaak } from '@/lib/api/taken';
import { useKlanten } from '@/lib/api/klanten';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
  const { toast } = useToast();
  const createTaak = useCreateTaak();
  const { data: klantenData } = useKlanten();
  const klanten = klantenData?.results || [];
  
  const [formData, setFormData] = useState({
    titel: '',
    beschrijving: '',
    klant_id: '',
    status: 'Te doen' as 'Te doen' | 'In uitvoering' | 'Geblokkeerd' | 'Afgerond' | 'Gereed voor controle',
    prioriteit: 'Normaal',
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedKlant = klanten.find(k => k.id === formData.klant_id);
    
    try {
      await createTaak.mutateAsync({
        ...formData,
        klant_naam: selectedKlant?.naam || '',
      });
      toast({
        title: 'Taak aangemaakt',
        description: `${formData.titel} is succesvol toegevoegd.`,
      });
      onOpenChange(false);
      setFormData({
        titel: '',
        beschrijving: '',
        klant_id: '',
        status: 'Te doen',
        prioriteit: 'Normaal',
        deadline: '',
      });
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het aanmaken van de taak.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Taak</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titel">Titel *</Label>
            <Input
              id="titel"
              value={formData.titel}
              onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
              placeholder="Bijv. Check documenten Q4"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beschrijving">Beschrijving</Label>
            <Textarea
              id="beschrijving"
              value={formData.beschrijving}
              onChange={(e) => setFormData({ ...formData, beschrijving: e.target.value })}
              placeholder="Beschrijf de taak..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="klant_id">Klant *</Label>
            <Select 
              value={formData.klant_id} 
              onValueChange={(value) => setFormData({ ...formData, klant_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer klant" />
              </SelectTrigger>
              <SelectContent>
                {klanten.map((klant) => (
                  <SelectItem key={klant.id} value={klant.id}>
                    {klant.naam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prioriteit">Prioriteit</Label>
              <Select 
                value={formData.prioriteit} 
                onValueChange={(value) => setFormData({ ...formData, prioriteit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laag">Laag</SelectItem>
                  <SelectItem value="Normaal">Normaal</SelectItem>
                  <SelectItem value="Hoog">Hoog</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={createTaak.isPending}>
              {createTaak.isPending ? 'Aanmaken...' : 'Taak aanmaken'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}