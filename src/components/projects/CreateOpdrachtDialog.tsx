import { useState } from 'react';
import { useCreateOpdracht } from '@/lib/api/opdrachten';
import { useKlanten } from '@/lib/api/klanten';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { OpdrachtType } from '@/types';

interface CreateOpdrachtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOpdrachtDialog({ open, onOpenChange }: CreateOpdrachtDialogProps) {
  const { toast } = useToast();
  const createOpdracht = useCreateOpdracht();
  const { data: klantenData } = useKlanten();
  const klanten = klantenData?.results || [];
  
  const [formData, setFormData] = useState({
    opdracht_naam: '',
    klant_id: '',
    type_opdracht: 'BTW-aangifte' as OpdrachtType,
    status: 'Intake' as const,
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedKlant = klanten.find(k => k.id === formData.klant_id);
    
    try {
      await createOpdracht.mutateAsync({
        ...formData,
        klant_naam: selectedKlant?.naam || '',
      });
      toast({
        title: 'Opdracht aangemaakt',
        description: `${formData.opdracht_naam} is succesvol toegevoegd.`,
      });
      onOpenChange(false);
      setFormData({
        opdracht_naam: '',
        klant_id: '',
        type_opdracht: 'BTW-aangifte',
        status: 'Intake',
        deadline: '',
      });
    } catch (error) {
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het aanmaken van de opdracht.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Opdracht</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="opdracht_naam">Opdracht Naam *</Label>
            <Input
              id="opdracht_naam"
              value={formData.opdracht_naam}
              onChange={(e) => setFormData({ ...formData, opdracht_naam: e.target.value })}
              placeholder="Bijv. BTW Q4 2024"
              required
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

          <div className="space-y-2">
            <Label htmlFor="type_opdracht">Type Opdracht *</Label>
            <Select 
              value={formData.type_opdracht} 
              onValueChange={(value) => setFormData({ ...formData, type_opdracht: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTW-aangifte">BTW-aangifte</SelectItem>
                <SelectItem value="Jaaropgave">Jaaropgave</SelectItem>
                <SelectItem value="Belastingaangifte">Belastingaangifte</SelectItem>
                <SelectItem value="Salarisadministratie">Salarisadministratie</SelectItem>
                <SelectItem value="Advies">Advies</SelectItem>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={createOpdracht.isPending}>
              {createOpdracht.isPending ? 'Aanmaken...' : 'Opdracht aanmaken'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}