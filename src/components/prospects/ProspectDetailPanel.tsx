import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Prospect } from '@/types';
import { useUpdateProspect } from '@/lib/api/prospects';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProspectStatusBadge } from './ProspectStatusBadge';
import { ProspectTypeBadge } from './ProspectTypeBadge';
import { ProspectSourceIcon } from './ProspectSourceIcon';
import { 
  Mail, Phone, MapPin, Calendar, Euro, Clock, 
  Building2, User, MessageSquare, History 
} from 'lucide-react';

interface ProspectDetailPanelProps {
  prospect: Prospect | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConvert: () => void;
  onMarkAsLost: () => void;
}

export function ProspectDetailPanel({ 
  prospect, 
  open, 
  onOpenChange,
  onConvert,
  onMarkAsLost,
}: ProspectDetailPanelProps) {
  const { t, i18n } = useTranslation();
  const updateProspect = useUpdateProspect();
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const [editedProspect, setEditedProspect] = useState<Partial<Prospect>>({});
  const [hasChanges, setHasChanges] = useState(false);

  if (!prospect) return null;

  const displayName = prospect.bedrijfsnaam || `${prospect.voornaam} ${prospect.achternaam}`;

  const handleFieldChange = (field: keyof Prospect, value: any) => {
    setEditedProspect(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateProspect.mutateAsync({
        id: prospect.id,
        data: editedProspect,
      });
      toast.success(t('common.saved'));
      setHasChanges(false);
      setEditedProspect({});
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const currentData = { ...prospect, ...editedProspect };
  const canConvert = ['Gekwalificeerd', 'Offerte'].includes(currentData.status);
  const isClosedStatus = ['Gewonnen', 'Verloren'].includes(currentData.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">{displayName}</SheetTitle>
              <p className="text-sm text-muted-foreground">{prospect.prospect_nummer}</p>
            </div>
            <ProspectTypeBadge type={currentData.type_prospect} />
          </div>
          
          {/* Status selector */}
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t('prospects.status')}:</Label>
            <Select
              value={currentData.status}
              onValueChange={v => handleFieldChange('status', v)}
              disabled={isClosedStatus}
            >
              <SelectTrigger className="w-44">
                <SelectValue>
                  <ProspectStatusBadge status={currentData.status} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {['Nieuw', 'Contact gehad', 'Gekwalificeerd', 'Offerte'].map(s => (
                  <SelectItem key={s} value={s}>
                    <ProspectStatusBadge status={s as Prospect['status']} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">{t('prospects.tabs.details')}</TabsTrigger>
            <TabsTrigger value="activity">{t('prospects.tabs.activity')}</TabsTrigger>
            <TabsTrigger value="notes">{t('prospects.tabs.notes')}</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            {/* Contact info */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">{t('prospects.contactInfo')}</h4>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{currentData.voornaam} {currentData.achternaam}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${currentData.email}`} className="text-primary hover:underline">
                  {currentData.email}
                </a>
              </div>
              
              {currentData.telefoon && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${currentData.telefoon}`} className="hover:underline">
                    {currentData.telefoon}
                  </a>
                </div>
              )}
              
              {currentData.mobiel && (
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-channel-whatsapp" />
                  <a href={`https://wa.me/${currentData.mobiel.replace(/[^0-9]/g, '')}`} className="hover:underline">
                    {currentData.mobiel}
                  </a>
                </div>
              )}
              
              {currentData.plaats && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {currentData.adres && `${currentData.adres}, `}
                    {currentData.postcode && `${currentData.postcode} `}
                    {currentData.plaats}
                  </span>
                </div>
              )}
            </div>

            {/* Source */}
            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">{t('prospects.source')}</h4>
              <div className="flex items-center gap-2">
                <ProspectSourceIcon bron={currentData.bron} showLabel />
                {currentData.bron_details && (
                  <span className="text-sm text-muted-foreground">
                    - {currentData.bron_details}
                  </span>
                )}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2 pt-2 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">{t('prospects.interests')}</h4>
              <div className="flex flex-wrap gap-1">
                {currentData.interesse.map(i => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {i}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Planning */}
            <div className="space-y-3 pt-2 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">{t('prospects.planning')}</h4>
              
              {currentData.verwachte_waarde && (
                <div className="flex items-center gap-2 text-sm">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <span>€{currentData.verwachte_waarde.toLocaleString()} {t('prospects.expectedAnnual')}</span>
                </div>
              )}
              
              {currentData.verwachte_start && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{t('prospects.expectedStartDate')}: {format(new Date(currentData.verwachte_start), 'PP', { locale })}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{t('prospects.nextAction')}: {currentData.volgende_actie}</span>
              </div>
              
              <div className="text-sm text-muted-foreground pl-6">
                {format(new Date(currentData.volgende_actie_datum), 'PP', { locale })}
              </div>
            </div>

            {/* Editable fields */}
            <div className="space-y-3 pt-2 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">{t('prospects.editAction')}</h4>
              
              <div>
                <Label className="text-xs">{t('prospects.nextAction')}</Label>
                <Input
                  value={currentData.volgende_actie}
                  onChange={e => handleFieldChange('volgende_actie', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-xs">{t('prospects.nextActionDate')}</Label>
                <Input
                  type="date"
                  value={currentData.volgende_actie_datum}
                  onChange={e => handleFieldChange('volgende_actie_datum', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t('prospects.firstContact')}:</span>
                <span>{format(new Date(prospect.eerste_contact_datum), 'PP', { locale })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t('prospects.lastContact')}:</span>
                <span>{format(new Date(prospect.laatste_contact_datum), 'PP', { locale })}</span>
              </div>
              
              <p className="text-sm text-muted-foreground italic mt-4">
                {t('prospects.activityPlaceholder')}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Textarea
              value={currentData.notities || ''}
              onChange={e => handleFieldChange('notities', e.target.value)}
              placeholder={t('prospects.notesPlaceholder')}
              rows={8}
            />
          </TabsContent>
        </Tabs>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-6 pt-4 border-t">
          {hasChanges && (
            <Button 
              onClick={handleSave}
              disabled={updateProspect.isPending}
              className="bg-ka-green hover:bg-ka-green/90"
            >
              {updateProspect.isPending ? t('common.saving') : t('common.save')}
            </Button>
          )}
          
          {canConvert && !isClosedStatus && (
            <Button variant="secondary" onClick={onConvert}>
              {t('prospects.convertToClient')}
            </Button>
          )}
          
          {!isClosedStatus && (
            <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={onMarkAsLost}>
              {t('prospects.markAsLost')}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
