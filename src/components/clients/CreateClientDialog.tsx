import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, X, Search, UserPlus } from 'lucide-react';
import { useAccountManagers } from '@/lib/api/accountManagers';
import { useContactPersonen } from '@/lib/api/contactpersonen';
import { useExternalAccountants } from '@/lib/api/externalAccountants';

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WEBHOOK_URL = 'https://n8n.kaspersadvies.nl/webhook-test/5f328575-4b56-48f8-9fbd-30abbb5c81d6-5f328575-4b56-48f8-9fbd-30abbb5c81d6';
const N8N_AUTH_USERNAME = import.meta.env.VITE_N8N_AUTH_USERNAME || '';
const N8N_AUTH_PASSWORD = import.meta.env.VITE_N8N_AUTH_PASSWORD || '';

function createBasicAuthHeader(): string {
  return `Basic ${btoa(`${N8N_AUTH_USERNAME}:${N8N_AUTH_PASSWORD}`)}`;
}

interface NewContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  isPrimary: boolean;
}

interface NewExternalAccountant {
  businessName: string;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
}

interface SelectedContact {
  id: string;
  naam: string;
  email: string;
  isPrimary: boolean;
}

interface SelectedAccountant {
  id: string;
  businessName: string;
  contactFullName: string;
}

const initialFormData = {
  naam: '',
  type_klant: 'ZZP',
  status: 'Prospect',
  email: '',
  telefoonnummer: '',
  mobiel: '',
  website: '',
  linkedin_url: '',
  voorkeur_kanaal: '',
  adres: '',
  postcode: '',
  plaats: '',
  land: 'Nederland',
  factuur_adres: '',
  factuur_postcode: '',
  factuur_plaats: '',
  factuur_land: '',
  use_different_invoice_address: false,
  kvk_nummer: '',
  btw_nummer: '',
  branche: '',
  groei_fase: '',
  omzet_categorie: '',
  jaren_actief_als_ondernemer: '',
  geboortedatum: '',
  bsn: '',
  iban: '',
  bic: '',
  bank_naam: '',
  alternatief_iban: '',
  betalingstermijn: '30',
  facturatie_frequentie: '',
  notities: '',
  accountmanager_id: '',
  selected_contact_persons: [] as SelectedContact[],
  new_contact_persons: [] as NewContactPerson[],
  selected_external_accountant: null as SelectedAccountant | null,
  new_external_accountant: null as NewExternalAccountant | null,
};

export function CreateClientDialog({ open, onOpenChange }: CreateClientDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [contactSearch, setContactSearch] = useState('');
  const [accountantSearch, setAccountantSearch] = useState('');
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [showAccountantSearch, setShowAccountantSearch] = useState(false);

  const { data: accountManagers = [] } = useAccountManagers();
  const { data: contactPersonenData } = useContactPersonen();
  const { data: externalAccountantsData } = useExternalAccountants();

  const contactPersonen = contactPersonenData?.results || [];
  const externalAccountants = externalAccountantsData?.results || [];

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return contactPersonen.slice(0, 10);
    const search = contactSearch.toLowerCase();
    return contactPersonen
      .filter(c =>
        c.naam.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.bedrijfsnaam?.toLowerCase().includes(search)
      )
      .slice(0, 10);
  }, [contactPersonen, contactSearch]);

  const filteredAccountants = useMemo(() => {
    if (!accountantSearch.trim()) return externalAccountants.slice(0, 10);
    const search = accountantSearch.toLowerCase();
    return externalAccountants
      .filter(a =>
        a.businessName.toLowerCase().includes(search) ||
        a.contactFullName.toLowerCase().includes(search) ||
        a.email.toLowerCase().includes(search)
      )
      .slice(0, 10);
  }, [externalAccountants, accountantSearch]);

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSelectedContact = (contact: { id: string; naam: string; email: string }) => {
    if (formData.selected_contact_persons.some(c => c.id === contact.id)) return;
    setFormData(prev => ({
      ...prev,
      selected_contact_persons: [...prev.selected_contact_persons, { ...contact, isPrimary: false }],
    }));
    setContactSearch('');
    setShowContactSearch(false);
  };

  const removeSelectedContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selected_contact_persons: prev.selected_contact_persons.filter(c => c.id !== id),
    }));
  };

  const toggleSelectedContactPrimary = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selected_contact_persons: prev.selected_contact_persons.map(c =>
        c.id === id ? { ...c, isPrimary: !c.isPrimary } : c
      ),
    }));
  };

  const addNewContactPerson = () => {
    setFormData(prev => ({
      ...prev,
      new_contact_persons: [...prev.new_contact_persons, { firstName: '', lastName: '', email: '', phone: '', jobTitle: '', isPrimary: false }],
    }));
    setShowContactSearch(false);
  };

  const updateNewContactPerson = (index: number, field: keyof NewContactPerson, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      new_contact_persons: prev.new_contact_persons.map((cp, i) => i === index ? { ...cp, [field]: value } : cp),
    }));
  };

  const removeNewContactPerson = (index: number) => {
    setFormData(prev => ({ ...prev, new_contact_persons: prev.new_contact_persons.filter((_, i) => i !== index) }));
  };

  const selectExistingAccountant = (accountant: { id: string; businessName: string; contactFullName: string }) => {
    setFormData(prev => ({
      ...prev,
      selected_external_accountant: accountant,
      new_external_accountant: null,
    }));
    setAccountantSearch('');
    setShowAccountantSearch(false);
  };

  const startNewAccountant = () => {
    setFormData(prev => ({
      ...prev,
      selected_external_accountant: null,
      new_external_accountant: { businessName: '', contactFirstName: '', contactLastName: '', email: '', phone: '' },
    }));
    setShowAccountantSearch(false);
  };

  const clearAccountant = () => {
    setFormData(prev => ({
      ...prev,
      selected_external_accountant: null,
      new_external_accountant: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        client: {
          name: formData.naam,
          client_type: formData.type_klant,
          status: formData.status,
          email: formData.email || null,
          phone: formData.telefoonnummer || null,
          website: formData.website || null,
          preferred_channel: formData.voorkeur_kanaal || null,
          address: formData.adres || null,
          postal_code: formData.postcode || null,
          city: formData.plaats || null,
          country: formData.land || null,
          invoice_address: formData.use_different_invoice_address ? (formData.factuur_adres || null) : (formData.adres || null),
          invoice_postal_code: formData.use_different_invoice_address ? (formData.factuur_postcode || null) : (formData.postcode || null),
          invoice_city: formData.use_different_invoice_address ? (formData.factuur_plaats || null) : (formData.plaats || null),
          invoice_country: formData.use_different_invoice_address ? (formData.factuur_land || null) : (formData.land || null),
          kvk_number: formData.kvk_nummer || null,
          vat_number: formData.btw_nummer || null,
          industry: formData.branche || null,
          growth_phase: formData.groei_fase || null,
          revenue_category: formData.omzet_categorie || null,
          date_of_birth: formData.geboortedatum || null,
          bsn: formData.bsn || null,
          iban: formData.iban || null,
          bic: formData.bic || null,
          bank_name: formData.bank_naam || null,
          iban_secondary: formData.alternatief_iban || null,
          payment_term_days: formData.betalingstermijn ? parseInt(formData.betalingstermijn) : 30,
          billing_frequency: formData.facturatie_frequentie || null,
          notes: formData.notities || null,
          accountmanager_id: formData.accountmanager_id ? parseInt(formData.accountmanager_id) : null,
        },
        contact_persons: {
          existing_ids: formData.selected_contact_persons.map(c => ({
            id: parseInt(c.id),
            is_primary: c.isPrimary,
          })),
          new_contacts: formData.new_contact_persons.filter(cp => cp.firstName || cp.lastName).map(cp => ({
            first_name: cp.firstName,
            last_name: cp.lastName,
            email: cp.email,
            phone: cp.phone,
            job_title: cp.jobTitle,
            is_primary: cp.isPrimary,
          })),
        },
        external_accountant: {
          ...(formData.selected_external_accountant && {
            existing: {
              id: parseInt(formData.selected_external_accountant.id),
              business_name: formData.selected_external_accountant.businessName,
              contact_full_name: formData.selected_external_accountant.contactFullName,
            },
          }),
          ...(formData.new_external_accountant?.businessName && {
            new_accountant: {
              business_name: formData.new_external_accountant.businessName,
              contact_first_name: formData.new_external_accountant.contactFirstName,
              contact_last_name: formData.new_external_accountant.contactLastName,
              email: formData.new_external_accountant.email,
              phone: formData.new_external_accountant.phone,
            },
          }),
        },
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': createBasicAuthHeader() },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create client');

      toast({ title: t('createClient.success.title'), description: t('createClient.success.description', { name: formData.naam }) });
      onOpenChange(false);
      setFormData(initialFormData);
    } catch {
      toast({ title: t('createClient.error.title'), description: t('createClient.error.description'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFormData(initialFormData);
    setContactSearch('');
    setAccountantSearch('');
    setShowContactSearch(false);
    setShowAccountantSearch(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('createClient.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basis */}
          <section>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t('createClient.tabs.basic')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="naam">{t('createClient.fields.name')} *</Label>
                <Input id="naam" value={formData.naam} onChange={(e) => updateField('naam', e.target.value)} placeholder={t('createClient.placeholders.name')} required />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.clientType')} *</Label>
                <Select value={formData.type_klant} onValueChange={(v) => updateField('type_klant', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Particulier">Particulier</SelectItem>
                    <SelectItem value="ZZP">ZZP</SelectItem>
                    <SelectItem value="MKB">MKB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.status')}</Label>
                <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                    <SelectItem value="Actief">Actief</SelectItem>
                    <SelectItem value="Inactief">Inactief</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.accountManager')}</Label>
                <Select value={formData.accountmanager_id || undefined} onValueChange={(v) => updateField('accountmanager_id', v)}>
                  <SelectTrigger><SelectValue placeholder={t('createClient.placeholders.selectAccountManager')} /></SelectTrigger>
                  <SelectContent>
                    {accountManagers.map((am) => (
                      <SelectItem key={am.id} value={String(am.id)}>
                        {am.full_name || am.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t('createClient.sections.contactInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.email')}</Label>
                <Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="contact@voorbeeld.nl" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.phone')}</Label>
                <Input value={formData.telefoonnummer} onChange={(e) => updateField('telefoonnummer', e.target.value)} placeholder="+31 6 12345678" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.mobile')}</Label>
                <Input value={formData.mobiel} onChange={(e) => updateField('mobiel', e.target.value)} placeholder="+31 6 12345678" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.website')}</Label>
                <Input value={formData.website} onChange={(e) => updateField('website', e.target.value)} placeholder="www.voorbeeld.nl" />
              </div>
              <div className="space-y-1.5">
                <Label>LinkedIn</Label>
                <Input value={formData.linkedin_url} onChange={(e) => updateField('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.preferredChannel')}</Label>
                <Select value={formData.voorkeur_kanaal || 'none'} onValueChange={(v) => updateField('voorkeur_kanaal', v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder={t('createClient.placeholders.selectChannel')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    <SelectItem value="E-mail">E-mail</SelectItem>
                    <SelectItem value="Telefoon">Telefoon</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Adres */}
          <section>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t('createClient.sections.primaryAddress')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label>{t('createClient.fields.address')}</Label>
                <Input value={formData.adres} onChange={(e) => updateField('adres', e.target.value)} placeholder="Straatnaam 123" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.postalCode')}</Label>
                <Input value={formData.postcode} onChange={(e) => updateField('postcode', e.target.value)} placeholder="1234 AB" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.city')}</Label>
                <Input value={formData.plaats} onChange={(e) => updateField('plaats', e.target.value)} placeholder="Amsterdam" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.country')}</Label>
                <Input value={formData.land} onChange={(e) => updateField('land', e.target.value)} />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox id="diff_invoice" checked={formData.use_different_invoice_address} onCheckedChange={(c) => updateField('use_different_invoice_address', !!c)} />
              <Label htmlFor="diff_invoice" className="cursor-pointer text-sm">{t('createClient.fields.differentInvoiceAddress')}</Label>
            </div>
            {formData.use_different_invoice_address && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 pt-3 border-t">
                <div className="space-y-1.5 md:col-span-2">
                  <Label>{t('createClient.sections.invoiceAddress')}</Label>
                  <Input value={formData.factuur_adres} onChange={(e) => updateField('factuur_adres', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.postalCode')}</Label>
                  <Input value={formData.factuur_postcode} onChange={(e) => updateField('factuur_postcode', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.city')}</Label>
                  <Input value={formData.factuur_plaats} onChange={(e) => updateField('factuur_plaats', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.country')}</Label>
                  <Input value={formData.factuur_land} onChange={(e) => updateField('factuur_land', e.target.value)} />
                </div>
              </div>
            )}
          </section>

          {/* Business / Personal */}
          {formData.type_klant === 'Particulier' ? (
            <section>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t('createClient.sections.personalInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.dateOfBirth')}</Label>
                  <Input type="date" value={formData.geboortedatum} onChange={(e) => updateField('geboortedatum', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.bsn')}</Label>
                  <Input value={formData.bsn} onChange={(e) => updateField('bsn', e.target.value)} placeholder="123456789" />
                </div>
              </div>
            </section>
          ) : (
            <section>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t('createClient.sections.businessRegistration')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.kvkNumber')}</Label>
                  <Input value={formData.kvk_nummer} onChange={(e) => updateField('kvk_nummer', e.target.value)} placeholder="12345678" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.vatNumber')}</Label>
                  <Input value={formData.btw_nummer} onChange={(e) => updateField('btw_nummer', e.target.value)} placeholder="NL123456789B01" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.industry')}</Label>
                  <Select value={formData.branche || 'none'} onValueChange={(v) => updateField('branche', v === 'none' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder={t('createClient.placeholders.selectIndustry')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="Bouw">Bouw</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Horeca">Horeca</SelectItem>
                      <SelectItem value="ICT">ICT</SelectItem>
                      <SelectItem value="Zorg">Zorg</SelectItem>
                      <SelectItem value="Dienstverlening">Dienstverlening</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Productie">Productie</SelectItem>
                      <SelectItem value="Overig">Overig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.yearsActive')}</Label>
                  <Input type="number" value={formData.jaren_actief_als_ondernemer} onChange={(e) => updateField('jaren_actief_als_ondernemer', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.growthPhase')}</Label>
                  <Select value={formData.groei_fase || 'none'} onValueChange={(v) => updateField('groei_fase', v === 'none' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder={t('createClient.placeholders.selectPhase')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="Starter">Starter</SelectItem>
                      <SelectItem value="Groei">Groei</SelectItem>
                      <SelectItem value="Schaal-op">Schaal-op</SelectItem>
                      <SelectItem value="Professionalisering">Professionalisering</SelectItem>
                      <SelectItem value="Digitalisering">Digitalisering</SelectItem>
                      <SelectItem value="Stabiel">Stabiel</SelectItem>
                      <SelectItem value="Exit">Exit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t('createClient.fields.revenueCategory')}</Label>
                  <Select value={formData.omzet_categorie || 'none'} onValueChange={(v) => updateField('omzet_categorie', v === 'none' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder={t('createClient.placeholders.selectCategory')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="< 50k">&lt; 50k</SelectItem>
                      <SelectItem value="50k-250k">50k - 250k</SelectItem>
                      <SelectItem value="250k-1M">250k - 1M</SelectItem>
                      <SelectItem value="> 1M">&gt; 1M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          )}

          {/* Financial */}
          <section>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t('createClient.sections.bankDetails')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>IBAN</Label>
                <Input value={formData.iban} onChange={(e) => updateField('iban', e.target.value)} placeholder="NL91 ABNA 0417 1643 00" />
              </div>
              <div className="space-y-1.5">
                <Label>BIC</Label>
                <Input value={formData.bic} onChange={(e) => updateField('bic', e.target.value)} placeholder="ABNANL2A" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.bankName')}</Label>
                <Input value={formData.bank_naam} onChange={(e) => updateField('bank_naam', e.target.value)} placeholder="ABN AMRO" />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.secondaryIban')}</Label>
                <Input value={formData.alternatief_iban} onChange={(e) => updateField('alternatief_iban', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.paymentTerm')}</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" value={formData.betalingstermijn} onChange={(e) => updateField('betalingstermijn', e.target.value)} className="w-20" />
                  <span className="text-sm text-muted-foreground">{t('createClient.fields.days')}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t('createClient.fields.billingFrequency')}</Label>
                <Select value={formData.facturatie_frequentie || 'none'} onValueChange={(v) => updateField('facturatie_frequentie', v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder={t('createClient.placeholders.selectFrequency')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    <SelectItem value="Maandelijks">Maandelijks</SelectItem>
                    <SelectItem value="Kwartaal">Kwartaal</SelectItem>
                    <SelectItem value="Jaarlijks">Jaarlijks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Contactpersonen */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-muted-foreground">{t('createClient.sections.contactPersons')}</h3>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowContactSearch(!showContactSearch)}>
                  <Search className="w-4 h-4 mr-1" />{t('createClient.buttons.searchExisting')}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addNewContactPerson}>
                  <UserPlus className="w-4 h-4 mr-1" />{t('createClient.buttons.addNew')}
                </Button>
              </div>
            </div>

            {/* Search existing contacts */}
            {showContactSearch && (
              <div className="bg-muted/30 rounded-lg p-3 mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('createClient.placeholders.searchContact')}
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {filteredContacts.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                        onClick={() => addSelectedContact({ id: contact.id, naam: contact.naam, email: contact.email })}
                      >
                        <div>
                          <div className="font-medium text-sm">{contact.naam}</div>
                          <div className="text-xs text-muted-foreground">{contact.email} {contact.bedrijfsnaam && `• ${contact.bedrijfsnaam}`}</div>
                        </div>
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}
                {contactSearch && filteredContacts.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">{t('createClient.labels.noContactsFound')}</p>
                )}
              </div>
            )}

            {/* Selected existing contacts */}
            {formData.selected_contact_persons.map((contact) => (
              <div key={contact.id} className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium text-sm">{contact.naam}</div>
                    <div className="text-xs text-muted-foreground">{contact.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`existing-primary-${contact.id}`}
                      checked={contact.isPrimary}
                      onCheckedChange={() => toggleSelectedContactPrimary(contact.id)}
                    />
                    <Label htmlFor={`existing-primary-${contact.id}`} className="text-sm">{t('createClient.fields.primaryContact')}</Label>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSelectedContact(contact.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* New contacts */}
            {formData.new_contact_persons.map((cp, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-3 mb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{t('createClient.labels.newContactPerson')} #{i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeNewContactPerson(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Input placeholder={t('createClient.placeholders.firstName')} value={cp.firstName} onChange={(e) => updateNewContactPerson(i, 'firstName', e.target.value)} />
                  <Input placeholder={t('createClient.placeholders.lastName')} value={cp.lastName} onChange={(e) => updateNewContactPerson(i, 'lastName', e.target.value)} />
                  <Input placeholder={t('createClient.placeholders.jobTitle')} value={cp.jobTitle} onChange={(e) => updateNewContactPerson(i, 'jobTitle', e.target.value)} />
                  <Input placeholder={t('createClient.placeholders.email')} value={cp.email} onChange={(e) => updateNewContactPerson(i, 'email', e.target.value)} />
                  <Input placeholder={t('createClient.placeholders.phone')} value={cp.phone} onChange={(e) => updateNewContactPerson(i, 'phone', e.target.value)} />
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`primary-${i}`} checked={cp.isPrimary} onCheckedChange={(c) => updateNewContactPerson(i, 'isPrimary', !!c)} />
                    <Label htmlFor={`primary-${i}`} className="text-sm">{t('createClient.fields.primaryContact')}</Label>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* External Accountant */}
          {formData.type_klant !== 'Particulier' && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-muted-foreground">{t('createClient.sections.externalAccountant')}</h3>
                {!formData.selected_external_accountant && !formData.new_external_accountant && (
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAccountantSearch(!showAccountantSearch)}>
                      <Search className="w-4 h-4 mr-1" />{t('createClient.buttons.searchExisting')}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={startNewAccountant}>
                      <UserPlus className="w-4 h-4 mr-1" />{t('createClient.buttons.addNew')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Search existing accountants */}
              {showAccountantSearch && !formData.selected_external_accountant && !formData.new_external_accountant && (
                <div className="bg-muted/30 rounded-lg p-3 mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t('createClient.placeholders.searchAccountant')}
                      value={accountantSearch}
                      onChange={(e) => setAccountantSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {filteredAccountants.length > 0 && (
                    <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                      {filteredAccountants.map((accountant) => (
                        <div
                          key={accountant.id}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => selectExistingAccountant({ id: accountant.id, businessName: accountant.businessName, contactFullName: accountant.contactFullName })}
                        >
                          <div>
                            <div className="font-medium text-sm">{accountant.businessName}</div>
                            <div className="text-xs text-muted-foreground">{accountant.contactFullName} • {accountant.email}</div>
                          </div>
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                  {accountantSearch && filteredAccountants.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">{t('createClient.labels.noAccountantsFound')}</p>
                  )}
                </div>
              )}

              {/* Selected existing accountant */}
              {formData.selected_external_accountant && (
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">{formData.selected_external_accountant.businessName}</div>
                      <div className="text-xs text-muted-foreground">{formData.selected_external_accountant.contactFullName}</div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={clearAccountant}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* New accountant form */}
              {formData.new_external_accountant && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{t('createClient.labels.newAccountant')}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={clearAccountant}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="md:col-span-3">
                      <Input placeholder={t('createClient.placeholders.businessName')} value={formData.new_external_accountant.businessName} onChange={(e) => updateField('new_external_accountant', { ...formData.new_external_accountant!, businessName: e.target.value })} />
                    </div>
                    <Input placeholder={t('createClient.placeholders.contactFirstName')} value={formData.new_external_accountant.contactFirstName} onChange={(e) => updateField('new_external_accountant', { ...formData.new_external_accountant!, contactFirstName: e.target.value })} />
                    <Input placeholder={t('createClient.placeholders.contactLastName')} value={formData.new_external_accountant.contactLastName} onChange={(e) => updateField('new_external_accountant', { ...formData.new_external_accountant!, contactLastName: e.target.value })} />
                    <Input placeholder={t('createClient.placeholders.email')} value={formData.new_external_accountant.email} onChange={(e) => updateField('new_external_accountant', { ...formData.new_external_accountant!, email: e.target.value })} />
                    <Input placeholder={t('createClient.placeholders.phone')} value={formData.new_external_accountant.phone} onChange={(e) => updateField('new_external_accountant', { ...formData.new_external_accountant!, phone: e.target.value })} />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Notes */}
          <section>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t('createClient.sections.notes')}</h3>
            <Textarea value={formData.notities} onChange={(e) => updateField('notities', e.target.value)} placeholder={t('createClient.placeholders.notes')} rows={3} />
          </section>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>{t('common.cancel')}</Button>
            <Button type="submit" disabled={isSubmitting || !formData.naam}>
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('createClient.buttons.creating')}</>
              ) : (
                t('createClient.buttons.create')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
