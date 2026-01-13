import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConvertProspectToClient } from '@/lib/api/prospects';
import { Prospect } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { CheckCircle, ArrowRight, Building2, User, Mail, Phone } from 'lucide-react';

interface ConvertToClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospect: Prospect | null;
}

export function ConvertToClientDialog({ open, onOpenChange, prospect }: ConvertToClientDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const convertToClient = useConvertProspectToClient();
  const [accountmanager, setAccountmanager] = useState('Linda Prins');

  if (!prospect) return null;

  const handleConvert = async () => {
    try {
      const result = await convertToClient.mutateAsync({
        prospectId: prospect.id,
        accountmanager,
      });

      toast.success(t('prospects.converted'));
      onOpenChange(false);
      
      // Optionally navigate to the new client
      // navigate(`/app/clients/${result.newKlantId}`);
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
            <CheckCircle className="w-5 h-5 text-ka-green" />
            {t('prospects.convertToClient')}
          </DialogTitle>
          <DialogDescription>
            {t('prospects.convertDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Prospect summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              {prospect.bedrijfsnaam ? (
                <Building2 className="w-4 h-4 text-muted-foreground" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="font-medium">{displayName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-3 h-3" />
              {prospect.email}
            </div>
            {prospect.telefoon && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                {prospect.telefoon}
              </div>
            )}
          </div>

          {/* Data to transfer */}
          <div>
            <Label className="text-sm font-medium">{t('prospects.dataToTransfer')}</Label>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-ka-green" />
                {t('prospects.transferContact')}
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-ka-green" />
                {t('prospects.transferAddress')}
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-ka-green" />
                {t('prospects.transferInterests')}
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-ka-green" />
                {t('prospects.transferNotes')}
              </li>
            </ul>
          </div>

          {/* Accountmanager selection */}
          <div>
            <Label>{t('prospects.selectAccountmanager')}</Label>
            <Select value={accountmanager} onValueChange={setAccountmanager}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Harm-Jan Kaspers">Harm-Jan Kaspers</SelectItem>
                <SelectItem value="Linda Prins">Linda Prins</SelectItem>
                <SelectItem value="Jan Jansen">Jan Jansen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleConvert}
            disabled={convertToClient.isPending}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {convertToClient.isPending ? t('common.saving') : t('prospects.convert')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
