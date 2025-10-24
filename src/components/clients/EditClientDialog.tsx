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
      toast.error('Ongeldig IBAN formaat');
      return;
    }
    
    // BSN validation (basic check - 9 digits)
    if (formData.bsn && !/^\d{9}$/.test(formData.bsn)) {
      toast.error('BSN moet 9 cijfers bevatten');
      return;
    }
    
    updateKlant.mutate(
      { id: klant.id, data: formData },
      {
        onSuccess: () => {
          toast.success('Klantgegevens succesvol bijgewerkt');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Er ging iets mis bij het opslaan');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Bewerk klantgegevens</DialogTitle>
          <DialogDescription>
            Wijzig de gegevens van {klant.naam}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basisinformatie */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-ka-gray-500" />
                <h3 className="font-semibold text-ka-navy dark:text-white">Basisinformatie</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="naam">Naam *</Label>
                  <Input
                    id="naam"
                    value={formData.naam}
                    onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Klant['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actief">Actief</SelectItem>
                      <SelectItem value="Inactief">Inactief</SelectItem>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="geboortedatum">Geboortedatum</Label>
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
                <h3 className="font-semibold text-ka-navy dark:text-white">Contactgegevens</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="telefoonnummer">Telefoon *</Label>
                  <Input
                    id="telefoonnummer"
                    value={formData.telefoonnummer}
                    onChange={(e) => setFormData({ ...formData, telefoonnummer: e.target.value })}
                    placeholder="+31..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="mobiel">Mobiel</Label>
                  <Input
                    id="mobiel"
                    value={formData.mobiel}
                    onChange={(e) => setFormData({ ...formData, mobiel: e.target.value })}
                    placeholder="+31..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="voorkeur_kanaal">Voorkeur communicatie</Label>
                  <Select value={formData.voorkeur_kanaal || ''} onValueChange={(value) => setFormData({ ...formData, voorkeur_kanaal: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer kanaal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="E-mail">E-mail</SelectItem>
                      <SelectItem value="Telefoon">Telefoon</SelectItem>
                      <SelectItem value="Zoom">Zoom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="linkedin_url">LinkedIn profiel</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
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
                <h3 className="font-semibold text-ka-navy dark:text-white">Adresgegevens (primair)</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="adres">Adres</Label>
                  <Input
                    id="adres"
                    value={formData.adres}
                    onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    placeholder="1234 AB"
                  />
                </div>
                
                <div>
                  <Label htmlFor="plaats">Plaats</Label>
                  <Input
                    id="plaats"
                    value={formData.plaats}
                    onChange={(e) => setFormData({ ...formData, plaats: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="land">Land</Label>
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
                <h3 className="font-semibold text-ka-navy dark:text-white">Factuuradres (optioneel)</h3>
              </div>
              <p className="text-sm text-ka-gray-500 dark:text-gray-400">
                Indien afwijkend van primair adres
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="factuur_adres">Factuuradres</Label>
                  <Input
                    id="factuur_adres"
                    value={formData.factuur_adres}
                    onChange={(e) => setFormData({ ...formData, factuur_adres: e.target.value })}
                    placeholder="Bijv. Postbus 1234"
                  />
                </div>
                
                <div>
                  <Label htmlFor="factuur_postcode">Postcode</Label>
                  <Input
                    id="factuur_postcode"
                    value={formData.factuur_postcode}
                    onChange={(e) => setFormData({ ...formData, factuur_postcode: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="factuur_plaats">Plaats</Label>
                  <Input
                    id="factuur_plaats"
                    value={formData.factuur_plaats}
                    onChange={(e) => setFormData({ ...formData, factuur_plaats: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="factuur_land">Land</Label>
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
                    <h3 className="font-semibold text-ka-navy dark:text-white">Bedrijfsgegevens</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="kvk_nummer">KVK nummer</Label>
                      <Input
                        id="kvk_nummer"
                        value={formData.kvk_nummer}
                        onChange={(e) => setFormData({ ...formData, kvk_nummer: e.target.value })}
                        placeholder="12345678"
                        maxLength={8}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="btw_nummer">BTW nummer</Label>
                      <Input
                        id="btw_nummer"
                        value={formData.btw_nummer}
                        onChange={(e) => setFormData({ ...formData, btw_nummer: e.target.value })}
                        placeholder="NL123456789B01"
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
                <h3 className="font-semibold text-ka-navy dark:text-white">Financiële gegevens</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase().replace(/\s/g, '') })}
                    placeholder="NL91ABNA0417164300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bic">BIC/SWIFT</Label>
                  <Input
                    id="bic"
                    value={formData.bic}
                    onChange={(e) => setFormData({ ...formData, bic: e.target.value.toUpperCase() })}
                    placeholder="ABNANL2A"
                  />
                </div>

                <div>
                  <Label htmlFor="bank_naam">Bank naam</Label>
                  <Input
                    id="bank_naam"
                    value={formData.bank_naam}
                    onChange={(e) => setFormData({ ...formData, bank_naam: e.target.value })}
                    placeholder="ABN AMRO"
                  />
                </div>

                <div>
                  <Label htmlFor="betalingstermijn">Betalingstermijn (dagen)</Label>
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
                  <Label htmlFor="alternatief_iban">Alternatief IBAN (optioneel)</Label>
                  <Input
                    id="alternatief_iban"
                    value={formData.alternatief_iban}
                    onChange={(e) => setFormData({ ...formData, alternatief_iban: e.target.value.toUpperCase().replace(/\s/g, '') })}
                    placeholder="Voor tweede rekening"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacygevoelige gegevens */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-ka-navy dark:text-white">Privacygevoelige gegevens</h3>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">
                ⚠️ Deze gegevens zijn vertrouwelijk en worden beveiligd opgeslagen
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bsn">BSN (Burger Service Nummer)</Label>
                  <Input
                    id="bsn"
                    value={formData.bsn}
                    onChange={(e) => setFormData({ ...formData, bsn: e.target.value.replace(/\D/g, '') })}
                    placeholder="9 cijfers"
                    maxLength={9}
                    type="password"
                  />
                  <p className="text-xs text-ka-gray-500 mt-1">Alleen zichtbaar voor gemachtigden</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notities */}
            <div className="space-y-4">
              <h3 className="font-semibold text-ka-navy dark:text-white">Notities</h3>
              
              <div>
                <Label htmlFor="notities">Algemene notities</Label>
                <Textarea
                  id="notities"
                  value={formData.notities}
                  onChange={(e) => setFormData({ ...formData, notities: e.target.value })}
                  rows={3}
                  placeholder="Algemene opmerkingen over deze klant..."
                />
              </div>
              
              <div>
                <Label htmlFor="interne_notities">Interne notities</Label>
                <Textarea
                  id="interne_notities"
                  value={formData.interne_notities}
                  onChange={(e) => setFormData({ ...formData, interne_notities: e.target.value })}
                  rows={3}
                  placeholder="Alleen zichtbaar voor het team..."
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
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
            {updateKlant.isPending ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
