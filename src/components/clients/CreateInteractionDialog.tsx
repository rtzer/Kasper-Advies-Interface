import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Phone, Mail, MessageCircle, Video, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useCreateInteractie } from '@/lib/api/interacties';
import { toast } from 'sonner';
import { Channel } from '@/types';

interface CreateInteractionDialogProps {
  klantId: string;
  klantNaam: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const channels: { value: Channel; label: string; icon: React.ReactNode }[] = [
  { value: 'Telefoon', label: 'Telefoon', icon: <Phone className="w-4 h-4" /> },
  { value: 'E-mail', label: 'E-mail', icon: <Mail className="w-4 h-4" /> },
  { value: 'WhatsApp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
  { value: 'Zoom', label: 'Video call', icon: <Video className="w-4 h-4" /> },
];

const sentiments = [
  { value: 'Positief', label: 'Positief', emoji: '😊' },
  { value: 'Neutraal', label: 'Neutraal', emoji: '😐' },
  { value: 'Negatief', label: 'Negatief', emoji: '😟' },
];

export default function CreateInteractionDialog({ 
  klantId, 
  klantNaam, 
  open, 
  onOpenChange 
}: CreateInteractionDialogProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'nl' ? nl : enUS;
  const createInteractie = useCreateInteractie();
  
  const [formData, setFormData] = useState({
    kanaal: '' as Channel | '',
    richting: 'Inbound' as 'Inbound' | 'Outbound',
    onderwerp: '',
    samenvatting: '',
    opvolgingNodig: false,
    opvolgingDatum: undefined as Date | undefined,
    sentiment: 'Neutraal',
  });
  
  const handleSubmit = async () => {
    if (!formData.kanaal || !formData.onderwerp) {
      toast.error(t('clients.interactions.fillRequired'));
      return;
    }
    
    try {
      await createInteractie.mutateAsync({
        klant_id: klantId,
        kanaal: formData.kanaal,
        type: formData.richting,
        onderwerp: formData.onderwerp,
        samenvatting: formData.samenvatting,
        opvolging_nodig: formData.opvolgingNodig,
        opvolging_datum: formData.opvolgingDatum?.toISOString(),
        sentiment: formData.sentiment as 'Positief' | 'Neutraal' | 'Negatief',
      });
      
      toast.success(t('clients.interactions.created'));
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(t('common:error'));
    }
  };
  
  const resetForm = () => {
    setFormData({
      kanaal: '',
      richting: 'Inbound',
      onderwerp: '',
      samenvatting: '',
      opvolgingNodig: false,
      opvolgingDatum: undefined,
      sentiment: 'Neutraal',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('clients.interactions.newInteraction')}</DialogTitle>
          <DialogDescription>
            {t('clients.interactions.newInteractionDesc', { name: klantNaam })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Channel Selection */}
          <div className="space-y-2">
            <Label>{t('clients.interactions.channel')}</Label>
            <div className="grid grid-cols-4 gap-2">
              {channels.map((channel) => (
                <Button
                  key={channel.value}
                  type="button"
                  variant={formData.kanaal === channel.value ? 'default' : 'outline'}
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto py-3",
                    formData.kanaal === channel.value && "bg-ka-green hover:bg-ka-green/90"
                  )}
                  onClick={() => setFormData(prev => ({ ...prev, kanaal: channel.value }))}
                >
                  {channel.icon}
                  <span className="text-xs">{channel.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Direction */}
          <div className="space-y-2">
            <Label>{t('clients.interactions.direction')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={formData.richting === 'Inbound' ? 'default' : 'outline'}
                className={cn(
                  "flex items-center gap-2",
                  formData.richting === 'Inbound' && "bg-ka-green hover:bg-ka-green/90"
                )}
                onClick={() => setFormData(prev => ({ ...prev, richting: 'Inbound' }))}
              >
                <ArrowDownLeft className="w-4 h-4" />
                {t('clients.interactions.inbound')}
              </Button>
              <Button
                type="button"
                variant={formData.richting === 'Outbound' ? 'default' : 'outline'}
                className={cn(
                  "flex items-center gap-2",
                  formData.richting === 'Outbound' && "bg-ka-green hover:bg-ka-green/90"
                )}
                onClick={() => setFormData(prev => ({ ...prev, richting: 'Outbound' }))}
              >
                <ArrowUpRight className="w-4 h-4" />
                {t('clients.interactions.outbound')}
              </Button>
            </div>
          </div>
          
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="onderwerp">{t('clients.interactions.subject')}</Label>
            <Input
              id="onderwerp"
              value={formData.onderwerp}
              onChange={(e) => setFormData(prev => ({ ...prev, onderwerp: e.target.value }))}
              placeholder={t('clients.interactions.subjectPlaceholder')}
            />
          </div>
          
          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="samenvatting">{t('clients.interactions.summary')}</Label>
            <Textarea
              id="samenvatting"
              value={formData.samenvatting}
              onChange={(e) => setFormData(prev => ({ ...prev, samenvatting: e.target.value }))}
              placeholder={t('clients.interactions.summaryPlaceholder')}
              rows={3}
            />
          </div>
          
          {/* Sentiment */}
          <div className="space-y-2">
            <Label>{t('clients.interactions.sentiment')}</Label>
            <div className="grid grid-cols-3 gap-2">
              {sentiments.map((s) => (
                <Button
                  key={s.value}
                  type="button"
                  variant={formData.sentiment === s.value ? 'default' : 'outline'}
                  className={cn(
                    "flex items-center gap-2",
                    formData.sentiment === s.value && (
                      s.value === 'Positief' ? 'bg-ka-green hover:bg-ka-green/90' :
                      s.value === 'Negatief' ? 'bg-red-500 hover:bg-red-600' :
                      'bg-ka-gray-500 hover:bg-ka-gray-600'
                    )
                  )}
                  onClick={() => setFormData(prev => ({ ...prev, sentiment: s.value }))}
                >
                  <span>{s.emoji}</span>
                  <span className="text-sm">{s.label}</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Follow-up */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="opvolging"
                checked={formData.opvolgingNodig}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    opvolgingNodig: checked as boolean,
                    opvolgingDatum: checked ? prev.opvolgingDatum : undefined
                  }))
                }
              />
              <Label htmlFor="opvolging" className="cursor-pointer">
                {t('clients.interactions.followupRequired')}
              </Label>
            </div>
            
            {formData.opvolgingNodig && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.opvolgingDatum && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.opvolgingDatum 
                      ? format(formData.opvolgingDatum, 'PPP', { locale })
                      : t('clients.interactions.selectFollowupDate')
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.opvolgingDatum}
                    onSelect={(date) => setFormData(prev => ({ ...prev, opvolgingDatum: date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common:cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createInteractie.isPending}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {createInteractie.isPending ? t('common:saving') : t('common:save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
