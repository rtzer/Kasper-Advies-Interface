import { useState } from 'react';
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
import { updateProjectStatusWebhook } from '@/lib/api/n8nProxy';
import { toast } from 'sonner';
import { Project } from '@/types';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

// Baserow status options (from table 768 field API)
type BaserowStatus = 'Concept' | 'Actief' | 'On hold' | 'Afgerond' | 'Geannuleerd';

// Map frontend status to Baserow status
function mapToBaserowStatus(frontendStatus: Project['status']): BaserowStatus {
  switch (frontendStatus) {
    case 'niet-gestart': return 'Concept';
    case 'in-uitvoering': return 'Actief';
    case 'geblokkeerd': return 'On hold';
    case 'wacht-op-klant': return 'On hold';
    case 'afgerond': return 'Afgerond';
    default: return 'Concept';
  }
}

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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<BaserowStatus>(mapToBaserowStatus(project.status));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statuses: { value: BaserowStatus; label: string }[] = [
    { value: 'Concept', label: t('projects.status.concept') },
    { value: 'Actief', label: t('projects.status.actief') },
    { value: 'On hold', label: t('projects.status.onHold') },
    { value: 'Afgerond', label: t('projects.status.afgerond') },
    { value: 'Geannuleerd', label: t('projects.status.geannuleerd') },
  ];

  const handleUpdate = async () => {
    setIsSubmitting(true);

    try {
      const response = await updateProjectStatusWebhook(project.id, newStatus);

      if (response.success && response.data?.success) {
        toast.success(t('projects.updateStatusDialog.success'));

        // Invalidate projects queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['baserow-projects'] });

        // Small delay so toast is visible
        setTimeout(() => onOpenChange(false), 300);
      } else {
        toast.error(t('projects.updateStatusDialog.error'));
      }
    } catch (error) {
      toast.error(t('projects.updateStatusDialog.error'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('projects.updateStatusDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('projects.updateStatusDialog.description', { name: project.name })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">{t('projects.updateStatusDialog.newStatus')}</Label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as BaserowStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t('projects.updateStatusDialog.cancel')}
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {isSubmitting ? t('projects.updateStatusDialog.updating') : t('projects.updateStatusDialog.update')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
