import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProjectStatus } from '@/lib/api/projects';
import { toast } from 'sonner';
import { Project } from '@/types';

interface UpdateStatusDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateStatusDialog({
  project,
  open,
  onOpenChange,
}: UpdateStatusDialogProps) {
  const [newStatus, setNewStatus] = useState<Project['status']>(project.status);
  const [blockedReason, setBlockedReason] = useState(project.blocked_reason || '');
  
  const updateStatusMutation = useUpdateProjectStatus();

  const handleUpdate = async () => {
    if (newStatus === 'geblokkeerd' && !blockedReason.trim()) {
      toast.error('Geef een reden op waarom het project geblokkeerd is');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        id: project.id,
        status: newStatus,
        blocked_reason: newStatus === 'geblokkeerd' ? blockedReason : null,
      });

      toast.success('Project status bijgewerkt!');
      
      // Small delay so toast is visible
      setTimeout(() => onOpenChange(false), 300);
    } catch (error) {
      toast.error('Fout bij updaten status');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Project Status Updaten</DialogTitle>
          <DialogDescription>
            Wijzig de status van: {project.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Nieuwe Status</Label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Project['status'])}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="niet-gestart">Niet gestart</SelectItem>
                <SelectItem value="in-uitvoering">In uitvoering</SelectItem>
                <SelectItem value="wacht-op-klant">Wacht op klant</SelectItem>
                <SelectItem value="geblokkeerd">Geblokkeerd</SelectItem>
                <SelectItem value="afgerond">Afgerond</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {newStatus === 'geblokkeerd' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="blocked-reason" className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                Reden voor blokkade *
              </Label>
              <Textarea
                id="blocked-reason"
                value={blockedReason}
                onChange={(e) => setBlockedReason(e.target.value)}
                placeholder="Bijv: Wachten op aanvullende documenten van klant..."
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                Beschrijf waarom het project geblokkeerd is, zodat het team weet wat er moet gebeuren.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={updateStatusMutation.isPending}
          >
            Annuleren
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={updateStatusMutation.isPending}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {updateStatusMutation.isPending ? 'Bezig...' : 'Status Updaten'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
