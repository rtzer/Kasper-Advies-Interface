import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Klant } from '@/types';
import { useUpdateKlant } from '@/lib/api/klanten';
import { toast } from 'sonner';
import { Building2, User, MapPin, CreditCard, FileText, Lock } from 'lucide-react';

interface EditClientDialogProps {
  klant: Klant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditClientDialog({ klant, open, onOpenChange }: EditClientDialogProps) {
  const { t } = useTranslation();
  const updateKlant = useUpdateKlant();

  const [formData, setFormData] = useState<Partial<Klant>>({
    naam: klant.naam,
    email: klant.email,
    telefoonnummer: klant.telefoonnummer,
    mobiel: klant.mobiel || '',
    linkedin_url: klant.linkedin_url || '',
    website: klant.website || '',
    adres: klant.adres,
    postcode: klant.postcode,
    plaats: klant.plaats,
    land: klant.land || 'Nederland',
    factuur_adres: klant.factuur_adres || '',
    factuur_postcode: klant.factuur_postcode || '',
    factuur_plaats: klant.factuur_plaats || '',
    factuur_land: klant.factuur_land || '',
    geboortedatum: klant.geboortedatum || '',
    bsn: klant.bsn || '',
    kvk_nummer: klant.kvk_nummer || '',
    btw_nummer: klant.btw_nummer || '',
    iban: klant.iban || '',
    bic: klant.bic || '',
    bank_naam: klant.bank_naam || '',
    alternatief_iban: klant.alternatief_iban || '',
    betalingstermijn: klant.betalingstermijn || 30,
    status: klant.status,
    voorkeur_kanaal: klant.voorkeur_kanaal,
    notities: klant.notities || '',
    interne_notities: klant.interne_notities || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic IBAN validation
    if (formData.iban && !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(formData.iban.replace(/\s/g, ''))) {
      toast.error(t('editClient.validation.invalidIban'));
      return;
    }

    // BSN validation (basic check - 9 digits)
    if (formData.bsn && !/^\d{9}$/.test(formData.bsn)) {
      toast.error(t('editClient.validation.invalidBsn'));
      return;
    }

    updateKlant.mutate(
      { id: klant.id, data: formData },
      {
        onSuccess: () => {
          toast.success(t('editClient.success.description', { name: klant.naam }));
          onOpenChange(false);
        },
        onError: () => {
          toast.error(t('editClient.error.description'));
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('editClient.title')}</DialogTitle>
          <DialogDescription>
            {t('editClient.subtitle', { name: klant.naam })}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basisinformatie */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-ka-gray-500" />
                <h3 className="font-semibold text-ka-navy dark:text-white">{t('editClient.sections.basicInfo')}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="naam">{t('editClient.fields.name')} *</Label>
                  <Input
                    id="naam"
                    value={formData.naam}
                    onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">{t('editClient.fields.status')}</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Klant['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actief">{t('clients.active')}</SelectItem>
                      <SelectItem value="Inactief">{t('clients.inactive')}</SelectItem>
                      <SelectItem value="Prospect">{t('clients.prospect')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="geboortedatum">{t('editClient.fields.birthDate')}</Label>
                  <Input
                    id="geboortedatum"
                    type="date"
                    value={formData.geboortedatum}
                    onChange={(e) => setFormData({ ...formData, geboortedatum: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contactgegevens */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-ka-gray-500" />
                <h3 className="font-semibold text-ka-navy dark:text-white">{t('editClient.sections.contactInfo')}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">{t('editClient.fields.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefoonnummer">{t('editClient.fields.phone')} *</Label>
                  <Input
                    id="telefoonnummer"
                    value={formData.telefoonnummer}
                    onChange={(e) => setFormData({ ...formData, telefoonnummer: e.target.value })}
                    placeholder={t('editClient.placeholders.phone')}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="mobiel">{t('editClient.fields.mobile')}</Label>
                  <Input
                    id="mobiel"
                    value={formData.mobiel}
                    onChange={(e) => setFormData({ ...formData, mobiel: e.target.value })}
                    placeholder={t('editClient.placeholders.phone')}
                  />
                </div>

                <div>
                  <Label htmlFor="voorkeur_kanaal">{t('editClient.fields.preferredChannel')}</Label>
                  <Select value={formData.voorkeur_kanaal || ''} onValueChange={(value) => setFormData({ ...formData, voorkeur_kanaal: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('editClient.placeholders.selectChannel')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="E-mail">{t('editClient.channels.email')}</SelectItem>
                      <SelectItem value="Telefoon">{t('editClient.channels.phone')}</SelectItem>
                      <SelectItem value="Zoom">Zoom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="linkedin_url">{t('editClient.fields.linkedinProfile')}</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <Label htmlFor="website">{t('editClient.fields.website')}</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Adresgegevens */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-ka-gray-500" />
                <h3 className="font-semibold text-ka-navy dark:text-white">{t('editClient.sections.primaryAddress')}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="adres">{t('editClient.fields.address')}</Label>
                  <Input
                    id="adres"
                    value={formData.adres}
                    onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="postcode">{t('editClient.fields.postalCode')}</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    placeholder={t('editClient.placeholders.postalCode')}
                  />
                </div>

                <div>
                  <Label htmlFor="plaats">{t('editClient.fields.city')}</Label>
                  <Input
                    id="plaats"
                    value={formData.plaats}
                    onChange={(e) => setFormData({ ...formData, plaats: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="land">{t('editClient.fields.country')}</Label>
                  <Input
                    id="land"
                    value={formData.land}
                    onChange={(e) => setFormData({ ...formData, land: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Factuuradres */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-ka-gray-500" />
                <h3 className="font-semibold text-ka-navy dark:text-white">{t('editClient.sections.invoiceAddress')}</h3>
              </div>
              <p className="text-sm text-ka-gray-500 dark:text-gray-400">
                {t('editClient.sections.invoiceAddressHint')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="factuur_adres">{t('editClient.fields.invoiceAddress')}</Label>
                  <Input
                    id="factuur_adres"
                    value={formData.factuur_adres}
                    onChange={(e) => setFormData({ ...formData, factuur_adres: e.target.value })}
                    placeholder={t('editClient.placeholders.invoiceAddress')}
                  />
                </div>

                <div>
                  <Label htmlFor="factuur_postcode">{t('editClient.fields.postalCode')}</Label>
                  <Input
                    id="factuur_postcode"
                    value={formData.factuur_postcode}
                    onChange={(e) => setFormData({ ...formData, factuur_postcode: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="factuur_plaats">{t('editClient.fields.city')}</Label>
                  <Input
                    id="factuur_plaats"
                    value={formData.factuur_plaats}
                    onChange={(e) => setFormData({ ...formData, factuur_plaats: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="factuur_land">{t('editClient.fields.country')}</Label>
                  <Input
                    id="factuur_land"
                    value={formData.factuur_land}
                    onChange={(e) => setFormData({ ...formData, factuur_land: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Bedrijfsgegevens */}
            {(klant.type_klant === 'ZZP' || klant.type_klant === 'MKB') && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-ka-gray-500" />
                    <h3 className="font-semibold text-ka-navy dark:text-white">{t('editClient.sections.businessInfo')}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="kvk_nummer">{t('editClient.fields.kvkNumber')}</Label>
                      <Input
                        id="kvk_nummer"
                        value={formData.kvk_nummer}
                        onChange={(e) => setFormData({ ...formData, kvk_nummer: e.target.value })}
                        placeholder={t('editClient.placeholders.kvkNumber')}
                        maxLength={8}
                      />
                    </div>

                    <div>
                      <Label htmlFor="btw_nummer">{t('editClient.fields.vatNumber')}</Label>
                      <Input
                        id="btw_nummer"
                        value={formData.btw_nummer}
                        onChange={(e) => setFormData({ ...formData, btw_nummer: e.target.value })}
                        placeholder={t('editClient.placeholders.vatNumber')}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Financiële gegevens */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-ka-gray-500" />
                <h3 className="font-semibold text-ka-navy dark:text-white">{t('editClient.sections.financialInfo')}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="iban">{t('editClient.fields.iban')}</Label>
                  <Input
                    id="iban"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase().replace(/\s/g, '') })}
                    placeholder={t('editClient.placeholders.iban')}
                  />
                </div>

                <div>
                  <Label htmlFor="bic">{t('editClient.fields.bic')}</Label>
                  <Input
                    id="bic"
                    value={formData.bic}
                    onChange={(e) => setFormData({ ...formData, bic: e.target.value.toUpperCase() })}
                    placeholder={t('editClient.placeholders.bic')}
                  />
                </div>

                <div>
                  <Label htmlFor="bank_naam">{t('editClient.fields.bankName')}</Label>
                  <Input
                    id="bank_naam"
                    value={formData.bank_naam}
                    onChange={(e) => setFormData({ ...formData, bank_naam: e.target.value })}
                    placeholder={t('editClient.placeholders.bankName')}
                  />
                </div>

                <div>
                  <Label htmlFor="betalingstermijn">{t('editClient.fields.paymentTerms')}</Label>
                  <Input
                    id="betalingstermijn"
                    type="number"
                    value={formData.betalingstermijn}
                    onChange={(e) => setFormData({ ...formData, betalingstermijn: parseInt(e.target.value) || 30 })}
                    min="0"
                    max="365"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="alternatief_iban">{t('editClient.fields.alternativeIban')}</Label>
                  <Input
                    id="alternatief_iban"
                    value={formData.alternatief_iban}
                    onChange={(e) => setFormData({ ...formData, alternatief_iban: e.target.value.toUpperCase().replace(/\s/g, '') })}
                    placeholder={t('editClient.placeholders.alternativeIban')}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacygevoelige gegevens */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-ka-navy dark:text-white">{t('editClient.sections.sensitiveData')}</h3>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">
                ⚠️ {t('editClient.sections.sensitiveDataWarning')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bsn">{t('editClient.fields.bsn')}</Label>
                  <Input
                    id="bsn"
                    value={formData.bsn}
                    onChange={(e) => setFormData({ ...formData, bsn: e.target.value.replace(/\D/g, '') })}
                    placeholder={t('editClient.placeholders.bsn')}
                    maxLength={9}
                    type="password"
                  />
                  <p className="text-xs text-ka-gray-500 mt-1">{t('editClient.fields.bsnHint')}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notities */}
            <div className="space-y-4">
              <h3 className="font-semibold text-ka-navy dark:text-white">{t('editClient.sections.notes')}</h3>

              <div>
                <Label htmlFor="notities">{t('editClient.fields.generalNotes')}</Label>
                <Textarea
                  id="notities"
                  value={formData.notities}
                  onChange={(e) => setFormData({ ...formData, notities: e.target.value })}
                  rows={3}
                  placeholder={t('editClient.placeholders.generalNotes')}
                />
              </div>

              <div>
                <Label htmlFor="interne_notities">{t('editClient.fields.internalNotes')}</Label>
                <Textarea
                  id="interne_notities"
                  value={formData.interne_notities}
                  onChange={(e) => setFormData({ ...formData, interne_notities: e.target.value })}
                  rows={3}
                  placeholder={t('editClient.placeholders.internalNotes')}
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('editClient.buttons.cancel')}
          </Button>
          <Button
            type="submit"
            className="bg-ka-green hover:bg-ka-green/90"
            disabled={updateKlant.isPending}
            onClick={(e) => {
              e.preventDefault();
              const form = e.currentTarget.closest('.flex')?.previousElementSibling?.querySelector('form');
              if (form instanceof HTMLFormElement) {
                form.requestSubmit();
              }
            }}
          >
            {updateKlant.isPending ? t('editClient.buttons.saving') : t('editClient.buttons.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
