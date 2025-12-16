import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Klant, Prospect } from '@/types';

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  klant?: Klant | null;
  prospect?: Prospect | null;
  onSuccess?: () => void;
}

// Webhook calls are now routed through the secure proxy at /api/n8n/webhook

interface NewContactPerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  isPrimary: boolean;
  isDecisionMaker: boolean;
  department: string;
  preferredChannel: string;
  notes: string;
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
  website: '',
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

export function CreateClientDialog({ open, onOpenChange, klant, prospect, onSuccess }: CreateClientDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [contactSearch, setContactSearch] = useState('');
  const [accountantSearch, setAccountantSearch] = useState('');
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [showAccountantSearch, setShowAccountantSearch] = useState(false);

  const isEditMode = !!klant;
  const isConvertMode = !!prospect;

  const { data: accountManagers = [] } = useAccountManagers();
  const { data: contactPersonenData } = useContactPersonen();
  const { data: externalAccountantsData } = useExternalAccountants();

  // Pre-fill form from prospect data (convert mode)
  useEffect(() => {
    if (prospect && open && !klant) {
      // Map prospect type to client type
      const mapProspectTypeToClientType = (type: string) => {
        switch (type) {
          case 'ZZP': return 'ZZP';
          case 'MKB': return 'MKB';
          case 'Particulier': return 'Particulier';
          default: return 'ZZP';
        }
      };

      setFormData({
        ...initialFormData,
        naam: prospect.bedrijfsnaam || [prospect.voornaam, prospect.achternaam].filter(Boolean).join(' ') || '',
        type_klant: mapProspectTypeToClientType(prospect.type_prospect),
        status: 'Actief',
        email: prospect.email || '',
        telefoonnummer: prospect.telefoon || '',
        adres: prospect.adres || '',
        postcode: prospect.postcode || '',
        plaats: prospect.plaats || '',
        land: prospect.land || 'Nederland',
        notities: prospect.notities || '',
      });
    }
  }, [prospect, open, klant]);

  // Pre-fill form when editing an existing client
  useEffect(() => {
    if (klant && open && !prospect) {
      const hasDifferentInvoiceAddress = !!(
        klant.factuur_adres &&
        klant.factuur_adres !== klant.adres
      );

      // Find matching account manager ID
      const matchingManager = accountManagers.find(
        (am) => am.full_name === klant.accountmanager || am.email === klant.accountmanager
      );

      setFormData({
        naam: klant.naam || '',
        type_klant: klant.type_klant || 'ZZP',
        status: klant.status || 'Prospect',
        email: klant.email || '',
        telefoonnummer: klant.telefoonnummer || '',
        website: klant.website || '',
        voorkeur_kanaal: klant.voorkeur_kanaal || '',
        adres: klant.adres || '',
        postcode: klant.postcode || '',
        plaats: klant.plaats || '',
        land: klant.land || 'Nederland',
        factuur_adres: klant.factuur_adres || '',
        factuur_postcode: klant.factuur_postcode || '',
        factuur_plaats: klant.factuur_plaats || '',
        factuur_land: klant.factuur_land || '',
        use_different_invoice_address: hasDifferentInvoiceAddress,
        kvk_nummer: klant.kvk_nummer || '',
        btw_nummer: klant.btw_nummer || '',
        branche: klant.branche || '',
        bsn: klant.bsn || '',
        iban: klant.iban || '',
        bic: klant.bic || '',
        bank_naam: klant.bank_naam || '',
        alternatief_iban: klant.alternatief_iban || '',
        betalingstermijn: klant.betalingstermijn?.toString() || '30',
        facturatie_frequentie: klant.facturatie_frequentie || '',
        notities: klant.notities || '',
        accountmanager_id: matchingManager ? String(matchingManager.id) : '',
        selected_contact_persons: [],
        new_contact_persons: [],
        selected_external_accountant: null,
        new_external_accountant: null,
      });
    } else if (!open) {
      setFormData(initialFormData);
    }
  }, [klant, open, accountManagers]);

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
      new_contact_persons: [...prev.new_contact_persons, {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        jobTitle: '',
        isPrimary: false,
        isDecisionMaker: false,
        department: '',
        preferredChannel: '',
        notes: '',
      }],
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
      // Build client object, only including non-empty values
      const clientData: Record<string, unknown> = {
        name: formData.naam,
        client_type: formData.type_klant,
        status: formData.status,
      };

      // Only add fields if they have values
      if (formData.email) clientData.email = formData.email;
      if (formData.telefoonnummer) clientData.phone = formData.telefoonnummer;
      if (formData.website) clientData.website = formData.website;
      if (formData.voorkeur_kanaal) clientData.preferred_channel = formData.voorkeur_kanaal;
      if (formData.adres) clientData.address = formData.adres;
      if (formData.postcode) clientData.postal_code = formData.postcode;
      if (formData.plaats) clientData.city = formData.plaats;
      if (formData.land) clientData.country = formData.land;

      // Invoice address
      if (formData.use_different_invoice_address) {
        if (formData.factuur_adres) clientData.invoice_address = formData.factuur_adres;
        if (formData.factuur_postcode) clientData.invoice_postal_code = formData.factuur_postcode;
        if (formData.factuur_plaats) clientData.invoice_city = formData.factuur_plaats;
        if (formData.factuur_land) clientData.invoice_country = formData.factuur_land;
      } else {
        if (formData.adres) clientData.invoice_address = formData.adres;
        if (formData.postcode) clientData.invoice_postal_code = formData.postcode;
        if (formData.plaats) clientData.invoice_city = formData.plaats;
        if (formData.land) clientData.invoice_country = formData.land;
      }

      // Business info
      if (formData.kvk_nummer) clientData.kvk_number = formData.kvk_nummer;
      if (formData.btw_nummer) clientData.vat_number = formData.btw_nummer;
      if (formData.branche) clientData.industry = formData.branche;

      // Personal info
      if (formData.bsn) clientData.bsn = formData.bsn;

      // Financial info
      if (formData.iban) clientData.iban = formData.iban;
      if (formData.bic) clientData.bic = formData.bic;
      if (formData.bank_naam) clientData.bank_name = formData.bank_naam;
      if (formData.alternatief_iban) clientData.iban_secondary = formData.alternatief_iban;
      if (formData.betalingstermijn) clientData.payment_term_days = parseInt(formData.betalingstermijn);
      if (formData.facturatie_frequentie) clientData.billing_frequency = formData.facturatie_frequentie;

      // Notes
      if (formData.notities) clientData.notes = formData.notities;

      // Account manager
      if (formData.accountmanager_id) clientData.accountmanager_id = parseInt(formData.accountmanager_id);

      const payload = {
        action: isEditMode ? 'update' : 'create',
        ...(isEditMode && { client_id: parseInt(klant!.id) }),
        client: clientData,
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
            is_decision_maker: cp.isDecisionMaker,
            department: cp.department || '',
            preferred_channel: cp.preferredChannel || '',
            notes: cp.notes || '',
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

      // Use the secure proxy - no secrets exposed client-side
      const webhookType = isEditMode ? 'update-client' : 'create-client';
      const response = await fetch('/api/n8n/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookType, ...payload }),
      });

      if (!response.ok) throw new Error(isEditMode ? 'Failed to update client' : 'Failed to create client');

      toast({
        title: isEditMode ? t('editClient.success.title') : t('createClient.success.title'),
        description: isEditMode
          ? t('editClient.success.description', { name: formData.naam })
          : t('createClient.success.description', { name: formData.naam }),
      });

      // Wait 2 seconds for n8n to process the request before closing and refreshing
      await new Promise(resolve => setTimeout(resolve, 2000));

      onOpenChange(false);
      setFormData(initialFormData);
      onSuccess?.();
    } catch {
      toast({
        title: isEditMode ? t('editClient.error.title') : t('createClient.error.title'),
        description: isEditMode ? t('editClient.error.description') : t('createClient.error.description'),
        variant: 'destructive',
      });
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
      <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">
            {isEditMode ? t('editClient.title') : isConvertMode ? t('prospects.convertToClient') : t('createClient.title')}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <form id="create-client-form" onSubmit={handleSubmit} className="space-y-6">
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
                <Label>{t('createClient.fields.website')}</Label>
                <Input value={formData.website} onChange={(e) => updateField('website', e.target.value)} placeholder="www.voorbeeld.nl" />
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
                  <Select value={cp.department || 'none'} onValueChange={(v) => updateNewContactPerson(i, 'department', v === 'none' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder={t('createClient.placeholders.selectDepartment')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="Directie">Directie</SelectItem>
                      <SelectItem value="Financiën">Financiën</SelectItem>
                      <SelectItem value="Administratie">Administratie</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={cp.preferredChannel || 'none'} onValueChange={(v) => updateNewContactPerson(i, 'preferredChannel', v === 'none' ? '' : v)}>
                    <SelectTrigger><SelectValue placeholder={t('createClient.placeholders.selectContactChannel')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="E-mail">E-mail</SelectItem>
                      <SelectItem value="Telefoon">Telefoon</SelectItem>
                      <SelectItem value="Zoom">Zoom</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`primary-${i}`} checked={cp.isPrimary} onCheckedChange={(c) => updateNewContactPerson(i, 'isPrimary', !!c)} />
                    <Label htmlFor={`primary-${i}`} className="text-sm">{t('createClient.fields.primaryContact')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`decision-maker-${i}`} checked={cp.isDecisionMaker} onCheckedChange={(c) => updateNewContactPerson(i, 'isDecisionMaker', !!c)} />
                    <Label htmlFor={`decision-maker-${i}`} className="text-sm">{t('createClient.fields.decisionMaker')}</Label>
                  </div>
                  <div className="md:col-span-3">
                    <Input placeholder={t('createClient.placeholders.contactNotes')} value={cp.notes} onChange={(e) => updateNewContactPerson(i, 'notes', e.target.value)} />
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
          </form>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose}>{t('common.cancel')}</Button>
          <Button type="submit" form="create-client-form" disabled={isSubmitting || !formData.naam}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditMode ? t('editClient.buttons.saving') : t('createClient.buttons.creating')}
              </>
            ) : (
              isEditMode ? t('editClient.buttons.save') : t('createClient.buttons.create')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
