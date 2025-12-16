import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Prospect } from '@/types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

// Webhook calls are now routed through the secure proxy at /api/n8n/webhook

interface MarkAsLostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospect: Prospect | null;
}

const lostReasons = [
  { value: 'Te duur', labelKey: 'prospects.lostReasons.tooExpensive' },
  { value: 'Andere partij gekozen', labelKey: 'prospects.lostReasons.competitor' },
  { value: 'Geen reactie', labelKey: 'prospects.lostReasons.noResponse' },
  { value: 'Niet serieus', labelKey: 'prospects.lostReasons.notSerious' },
  { value: 'Timing niet goed', labelKey: 'prospects.lostReasons.badTiming' },
  { value: 'Buiten doelgroep', labelKey: 'prospects.lostReasons.outOfTarget' },
];

export function MarkAsLostDialog({ open, onOpenChange, prospect }: MarkAsLostDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!prospect) return null;

  const handleMarkAsLost = async () => {
    if (!reason) {
      toast.error(t('prospects.selectReason'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the secure proxy - no secrets exposed client-side
      const response = await fetch('/api/n8n/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookType: 'prospect-lost',
          prospect_id: prospect.id,
          lost_reason: reason,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error('Update failed');
      }

      // Refresh prospects data
      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      await queryClient.invalidateQueries({ queryKey: ['prospect', prospect.id] });
      await queryClient.invalidateQueries({ queryKey: ['prospect-stats'] });

      toast.success(t('prospects.markedAsLost'));
      onOpenChange(false);
      setReason('');
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = prospect.bedrijfsnaam || [prospect.voornaam, prospect.achternaam].filter(Boolean).join(' ') || '-';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="w-5 h-5 text-destructive" />
            {t('prospects.markAsLost')}
          </DialogTitle>
          <DialogDescription>
            {t('prospects.markAsLostDescription', { name: displayName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>{t('prospects.lostReason')}</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2 space-y-2">
              {lostReasons.map(r => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value} className="font-normal cursor-pointer">
                    {t(r.labelKey)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('actions.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleMarkAsLost}
            disabled={isSubmitting || !reason}
          >
            {isSubmitting ? t('actions.save') : t('actions.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
