import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateProspect } from '@/lib/api/prospects';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProspectBron, ProspectType } from '@/types';

interface CreateProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const interesseOpties = [
  'BTW-aangifte',
  'Jaarrekening',
  'IB (Inkomstenbelasting)',
  'Vennootschapsbelasting',
  'Loonadministratie',
  'Groeibegeleiding',
  'Startersbegeleiding',
  'Procesoptimalisatie',
  'Financieel advies',
  'Toeslag aanvragen',
  'Schenking/Erfenis',
];

const bronOpties: ProspectBron[] = ['Website', 'Referral', 'LinkedIn', 'Telefoon', 'Event', 'Netwerk', 'Anders'];
const typeOpties: ProspectType[] = ['MKB', 'ZZP', 'Particulier'];

export function CreateProspectDialog({ open, onOpenChange }: CreateProspectDialogProps) {
  const { t } = useTranslation();
  const createProspect = useCreateProspect();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    bedrijfsnaam: '',
    email: '',
    telefoon: '',
    mobiel: '',
    type_prospect: 'ZZP' as ProspectType,
    adres: '',
    postcode: '',
    plaats: '',
    bron: 'Website' as ProspectBron,
    bron_details: '',
    interesse: [] as string[],
    notities: '',
    verwachte_waarde: '',
    verwachte_start: '',
    volgende_actie: '',
    volgende_actie_datum: '',
    toegewezen_aan: 'Linda Prins',
  });

  const handleSubmit = async () => {
    if (!formData.email || formData.interesse.length === 0) {
      toast.error(t('prospects.validation.required'));
      return;
    }

    try {
      await createProspect.mutateAsync({
        voornaam: formData.voornaam,
        achternaam: formData.achternaam,
        bedrijfsnaam: formData.bedrijfsnaam || undefined,
        email: formData.email,
        telefoon: formData.telefoon || undefined,
        mobiel: formData.mobiel || undefined,
        type_prospect: formData.type_prospect,
        adres: formData.adres || undefined,
        postcode: formData.postcode || undefined,
        plaats: formData.plaats || undefined,
        bron: formData.bron,
        bron_details: formData.bron_details || undefined,
        interesse: formData.interesse,
        notities: formData.notities || undefined,
        verwachte_waarde: formData.verwachte_waarde ? Number(formData.verwachte_waarde) : undefined,
        verwachte_start: formData.verwachte_start || undefined,
        volgende_actie: formData.volgende_actie || 'Eerste contact opnemen',
        volgende_actie_datum: formData.volgende_actie_datum || new Date().toISOString().split('T')[0],
        toegewezen_aan: formData.toegewezen_aan,
        status: 'Nieuw',
        eerste_contact_datum: new Date().toISOString().split('T')[0],
        laatste_contact_datum: new Date().toISOString().split('T')[0],
      });

      toast.success(t('prospects.created'));
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      voornaam: '',
      achternaam: '',
      bedrijfsnaam: '',
      email: '',
      telefoon: '',
      mobiel: '',
      type_prospect: 'ZZP',
      adres: '',
      postcode: '',
      plaats: '',
      bron: 'Website',
      bron_details: '',
      interesse: [],
      notities: '',
      verwachte_waarde: '',
      verwachte_start: '',
      volgende_actie: '',
      volgende_actie_datum: '',
      toegewezen_aan: 'Linda Prins',
    });
  };

  const toggleInteresse = (item: string) => {
    setFormData(prev => ({
      ...prev,
      interesse: prev.interesse.includes(item)
        ? prev.interesse.filter(i => i !== item)
        : [...prev.interesse, item],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); onOpenChange(o); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('prospects.new')}</DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`flex-1 h-1 rounded ${s <= step ? 'bg-ka-green' : 'bg-muted'}`}
            />
          ))}
        </div>

        {/* Step 1: Basisgegevens */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('prospects.firstName')}</Label>
                <Input
                  value={formData.voornaam}
                  onChange={e => setFormData(prev => ({ ...prev, voornaam: e.target.value }))}
                  placeholder="Jan"
                />
              </div>
              <div>
                <Label>{t('prospects.lastName')}</Label>
                <Input
                  value={formData.achternaam}
                  onChange={e => setFormData(prev => ({ ...prev, achternaam: e.target.value }))}
                  placeholder="Jansen"
                />
              </div>
            </div>

            <div>
              <Label>{t('prospects.company')}</Label>
              <Input
                value={formData.bedrijfsnaam}
                onChange={e => setFormData(prev => ({ ...prev, bedrijfsnaam: e.target.value }))}
                placeholder={t('prospects.companyOptional')}
              />
            </div>

            <div>
              <Label>{t('prospects.type')}</Label>
              <Select
                value={formData.type_prospect}
                onValueChange={(v: ProspectType) => setFormData(prev => ({ ...prev, type_prospect: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOpties.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('prospects.email')} *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="jan@voorbeeld.nl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('prospects.phone')}</Label>
                <Input
                  value={formData.telefoon}
                  onChange={e => setFormData(prev => ({ ...prev, telefoon: e.target.value }))}
                  placeholder="0599-123456"
                />
              </div>
              <div>
                <Label>{t('prospects.mobile')}</Label>
                <Input
                  value={formData.mobiel}
                  onChange={e => setFormData(prev => ({ ...prev, mobiel: e.target.value }))}
                  placeholder="06-12345678"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Interesse en bron */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>{t('prospects.source')}</Label>
              <Select
                value={formData.bron}
                onValueChange={(v: ProspectBron) => setFormData(prev => ({ ...prev, bron: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bronOpties.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(formData.bron === 'Referral' || formData.bron === 'Event' || formData.bron === 'Netwerk') && (
              <div>
                <Label>{t('prospects.sourceDetails')}</Label>
                <Input
                  value={formData.bron_details}
                  onChange={e => setFormData(prev => ({ ...prev, bron_details: e.target.value }))}
                  placeholder={formData.bron === 'Referral' ? 'Via klant...' : 'Details...'}
                />
              </div>
            )}

            <div>
              <Label>{t('prospects.interests')} *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                {interesseOpties.map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Checkbox
                      id={item}
                      checked={formData.interesse.includes(item)}
                      onCheckedChange={() => toggleInteresse(item)}
                    />
                    <label htmlFor={item} className="text-sm cursor-pointer">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>{t('prospects.notes')}</Label>
              <Textarea
                value={formData.notities}
                onChange={e => setFormData(prev => ({ ...prev, notities: e.target.value }))}
                placeholder={t('prospects.notesPlaceholder')}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3: Toewijzing en planning */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>{t('prospects.assignedTo')}</Label>
              <Select
                value={formData.toegewezen_aan}
                onValueChange={v => setFormData(prev => ({ ...prev, toegewezen_aan: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Linda Prins">Linda Prins</SelectItem>
                  <SelectItem value="Harm-Jan Kaspers">Harm-Jan Kaspers</SelectItem>
                  <SelectItem value="Jan Jansen">Jan Jansen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('prospects.expectedValue')}</Label>
              <Input
                type="number"
                value={formData.verwachte_waarde}
                onChange={e => setFormData(prev => ({ ...prev, verwachte_waarde: e.target.value }))}
                placeholder="5000"
              />
            </div>

            <div>
              <Label>{t('prospects.expectedStart')}</Label>
              <Input
                type="date"
                value={formData.verwachte_start}
                onChange={e => setFormData(prev => ({ ...prev, verwachte_start: e.target.value }))}
              />
            </div>

            <div>
              <Label>{t('prospects.nextAction')}</Label>
              <Input
                value={formData.volgende_actie}
                onChange={e => setFormData(prev => ({ ...prev, volgende_actie: e.target.value }))}
                placeholder={t('prospects.nextActionPlaceholder')}
              />
            </div>

            <div>
              <Label>{t('prospects.nextActionDate')}</Label>
              <Input
                type="date"
                value={formData.volgende_actie_datum}
                onChange={e => setFormData(prev => ({ ...prev, volgende_actie_datum: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(s => s - 1)}>
              {t('common.back')}
            </Button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)}>
              {t('common.next')}
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={createProspect.isPending}
              className="bg-ka-green hover:bg-ka-green/90"
            >
              {createProspect.isPending ? t('common.saving') : t('common.save')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
