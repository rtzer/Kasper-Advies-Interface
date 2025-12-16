import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Loader2 } from 'lucide-react';

interface CreateProspectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Webhook calls are now routed through the secure proxy at /api/n8n/webhook

// Baserow exact values
const interesseOpties = [
  'IB-aangifte',
  'Jaarrekening',
  'BTW-aangifte',
  'VPB-aangifte',
  'Loonadministratie',
  'Groeibegeleiding',
  'Procesoptimalisatie',
  'Toeslagen',
];

const bronOpties = [
  'Website',
  'Verwijzing',
  'LinkedIn',
  'Google',
  'Evenement',
  'Bestaande klant',
  'Anders',
];

const typeOpties = ['MKB', 'ZZP', 'Particulier'];

const estimatedRevenueOpties = [
  '< €50k',
  '€50k - €100k',
  '€100k - €250k',
  '€250k - €500k',
];

const industryOpties = [
  'Bouw',
  'Retail',
  'Horeca',
  'ICT',
  'Zorg',
  'Dienstverlening',
  'Transport',
  'Productie',
  'Overig',
];

const countryOpties = [
  'Nederland',
  'België',
  'Duitsland',
  'Frankrijk',
  'Luxemburg',
  'Spanje',
  'Italië',
  'Verenigd Koninkrijk',
  'Anders',
];

export function CreateProspectDialog({ open, onOpenChange }: CreateProspectDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefoon: '',
    type_prospect: 'ZZP',
    industry: '',
    adres: '',
    postcode: '',
    plaats: '',
    land: 'Nederland',
    bron: 'Website',
    interesse: [] as string[],
    notities: '',
    verwachte_waarde: '',
    volgende_actie_datum: '',
  });

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error(t('prospects.validation.nameRequired'));
      return;
    }

    if (!formData.email) {
      toast.error(t('prospects.validation.emailRequired'));
      return;
    }

    if (formData.interesse.length === 0) {
      toast.error(t('prospects.validation.interestsRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        action: 'create',
        entity: 'prospect',
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.telefoon || '',
          address: formData.adres || null,
          postal_code: formData.postcode || null,
          city: formData.plaats || null,
          country: formData.land || null,
          prospect_type: formData.type_prospect,
          industry: formData.industry || null,
          source: formData.bron,
          interested_services: formData.interesse,
          estimated_revenue: formData.verwachte_waarde || null,
          notes: formData.notities || null,
          recontact_date: formData.volgende_actie_datum || null,
          status: 'Nieuw',
        },
      };

      // Use the secure proxy - no secrets exposed client-side
      const response = await fetch('/api/n8n/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webhookType: 'create-prospect', ...payload }),
      });

      if (response.status === 200) {
        // Success - prospect created in Baserow
        toast.success(t('prospects.created'), {
          description: t('prospects.createdDescription', { name: formData.name }),
        });

        // Refresh prospects list immediately
        queryClient.invalidateQueries({ queryKey: ['prospects'] });
        queryClient.invalidateQueries({ queryKey: ['prospect-stats'] });

        onOpenChange(false);
        resetForm();
      } else {
        // Error from n8n (400 or other)
        throw new Error('Failed to create prospect');
      }
    } catch (error) {
      console.error('Error creating prospect:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      telefoon: '',
      type_prospect: 'ZZP',
      industry: '',
      adres: '',
      postcode: '',
      plaats: '',
      land: 'Nederland',
      bron: 'Website',
      interesse: [],
      notities: '',
      verwachte_waarde: '',
      volgende_actie_datum: '',
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

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('prospects.createTitle')}</DialogTitle>
          <DialogDescription>{t('prospects.createDescription')}</DialogDescription>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-1 rounded ${s <= step ? 'bg-ka-green' : 'bg-muted'}`}
              />
              <span className={`text-xs ${s <= step ? 'text-ka-green' : 'text-muted-foreground'}`}>
                {s === 1 && t('prospects.steps.basicInfo')}
                {s === 2 && t('prospects.steps.interestsSource')}
                {s === 3 && t('prospects.steps.planning')}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Basisgegevens */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>{t('prospects.name')} *</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('prospects.placeholders.name')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('prospects.type')}</Label>
                <Select
                  value={formData.type_prospect}
                  onValueChange={v => setFormData(prev => ({ ...prev, type_prospect: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOpties.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('prospects.industry')}</Label>
                <Select
                  value={formData.industry}
                  onValueChange={v => setFormData(prev => ({ ...prev, industry: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('prospects.selectIndustry')} />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOpties.map(ind => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('prospects.email')} *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t('prospects.placeholders.email')}
                />
              </div>
              <div>
                <Label>{t('prospects.phone')}</Label>
                <Input
                  value={formData.telefoon}
                  onChange={e => setFormData(prev => ({ ...prev, telefoon: e.target.value }))}
                  placeholder="+31 6 12345678"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('prospects.fields.city')}</Label>
                <Input
                  value={formData.plaats}
                  onChange={e => setFormData(prev => ({ ...prev, plaats: e.target.value }))}
                  placeholder={t('prospects.placeholders.city')}
                />
              </div>
              <div>
                <Label>{t('prospects.country')}</Label>
                <Select
                  value={formData.land}
                  onValueChange={v => setFormData(prev => ({ ...prev, land: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOpties.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                onValueChange={v => setFormData(prev => ({ ...prev, bron: v }))}
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
              <Label>{t('prospects.fields.notes')}</Label>
              <Textarea
                value={formData.notities}
                onChange={e => setFormData(prev => ({ ...prev, notities: e.target.value }))}
                placeholder={t('prospects.notesPlaceholder')}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3: Planning */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>{t('prospects.expectedValue')}</Label>
              <Select
                value={formData.verwachte_waarde}
                onValueChange={v => setFormData(prev => ({ ...prev, verwachte_waarde: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('prospects.selectRevenue')} />
                </SelectTrigger>
                <SelectContent>
                  {estimatedRevenueOpties.map(rev => (
                    <SelectItem key={rev} value={rev}>{rev}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={isSubmitting}>
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
              disabled={isSubmitting}
              className="bg-ka-green hover:bg-ka-green/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('prospects.creating')}
                </>
              ) : (
                t('prospects.create')
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
