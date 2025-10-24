import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useKlanten } from '@/lib/api/klanten';
import { useCreateConversation } from '@/lib/api/conversations';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

interface CreateConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateConversationDialog({ open, onOpenChange }: CreateConversationDialogProps) {
  const { toast } = useToast();
  const { data: klantenData, isLoading: klantenLoading } = useKlanten();
  const createConversation = useCreateConversation();
  
  const [formData, setFormData] = useState({
    klant_id: '',
    primary_channel: 'WhatsApp' as const,
    onderwerp: '',
    initial_message: '',
  });

  const klanten = klantenData?.results || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.klant_id) {
      toast({
        title: "Klant vereist",
        description: "Selecteer een klant om de conversatie te starten.",
        variant: "destructive",
      });
      return;
    }

    const selectedKlant = klanten.find(k => k.id === formData.klant_id);
    
    createConversation.mutate(
      {
        klant_id: formData.klant_id,
        klant_naam: selectedKlant?.naam || '',
        primary_channel: formData.primary_channel,
        onderwerp: formData.onderwerp,
        initial_message: formData.initial_message,
      },
      {
        onSuccess: () => {
          toast({
            title: "Conversatie gestart",
            description: `Nieuwe conversatie met ${selectedKlant?.naam} is aangemaakt.`,
          });
          onOpenChange(false);
          setFormData({
            klant_id: '',
            primary_channel: 'WhatsApp',
            onderwerp: '',
            initial_message: '',
          });
        },
        onError: () => {
          toast({
            title: "Fout",
            description: "Kon conversatie niet aanmaken. Probeer opnieuw.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Conversatie Starten</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="klant">Klant *</Label>
            {klantenLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select 
                value={formData.klant_id} 
                onValueChange={(value) => setFormData({ ...formData, klant_id: value })}
              >
                <SelectTrigger id="klant">
                  <SelectValue placeholder="Selecteer klant" />
                </SelectTrigger>
                <SelectContent>
                  {klanten.map((klant) => (
                    <SelectItem key={klant.id} value={klant.id}>
                      {klant.naam} ({klant.klant_nummer})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Kanaal *</Label>
            <Select 
              value={formData.primary_channel} 
              onValueChange={(value: any) => setFormData({ ...formData, primary_channel: value })}
            >
              <SelectTrigger id="channel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Telefoon">Telefoon</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="onderwerp">Onderwerp *</Label>
            <Input
              id="onderwerp"
              value={formData.onderwerp}
              onChange={(e) => setFormData({ ...formData, onderwerp: e.target.value })}
              placeholder="Bijv. BTW vraag Q4 2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial_message">Eerste bericht (optioneel)</Label>
            <Textarea
              id="initial_message"
              value={formData.initial_message}
              onChange={(e) => setFormData({ ...formData, initial_message: e.target.value })}
              placeholder="Typ je eerste bericht..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={createConversation.isPending}
            >
              Annuleren
            </Button>
            <Button 
              type="submit" 
              disabled={createConversation.isPending || !formData.klant_id || !formData.onderwerp}
            >
              {createConversation.isPending ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Aanmaken...
                </>
              ) : (
                'Conversatie starten'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
