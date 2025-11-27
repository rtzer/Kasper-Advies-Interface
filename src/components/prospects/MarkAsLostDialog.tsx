import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateProspect } from '@/lib/api/prospects';
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

interface MarkAsLostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospect: Prospect | null;
}

const lostReasons = [
  { value: 'Te duur', labelKey: 'prospects.lostReasons.tooExpensive' },
  { value: 'Concurrent gekozen', labelKey: 'prospects.lostReasons.competitor' },
  { value: 'Geen reactie', labelKey: 'prospects.lostReasons.noResponse' },
  { value: 'Geen behoefte', labelKey: 'prospects.lostReasons.noNeed' },
  { value: 'Anders', labelKey: 'prospects.lostReasons.other' },
];

export function MarkAsLostDialog({ open, onOpenChange, prospect }: MarkAsLostDialogProps) {
  const { t } = useTranslation();
  const updateProspect = useUpdateProspect();
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  if (!prospect) return null;

  const handleMarkAsLost = async () => {
    if (!reason) {
      toast.error(t('prospects.selectReason'));
      return;
    }

    try {
      await updateProspect.mutateAsync({
        id: prospect.id,
        data: {
          status: 'Verloren',
          verloren_reden: reason === 'Anders' && notes ? notes : reason,
          notities: prospect.notities 
            ? `${prospect.notities}\n\n[Verloren] ${reason}${notes ? `: ${notes}` : ''}`
            : `[Verloren] ${reason}${notes ? `: ${notes}` : ''}`,
        },
      });

      toast.success(t('prospects.markedAsLost'));
      onOpenChange(false);
      setReason('');
      setNotes('');
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const displayName = prospect.bedrijfsnaam || `${prospect.voornaam} ${prospect.achternaam}`;

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

          <div>
            <Label>{t('prospects.additionalNotes')}</Label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('prospects.additionalNotesPlaceholder')}
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="destructive"
            onClick={handleMarkAsLost}
            disabled={updateProspect.isPending || !reason}
          >
            {updateProspect.isPending ? t('common.saving') : t('common.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
