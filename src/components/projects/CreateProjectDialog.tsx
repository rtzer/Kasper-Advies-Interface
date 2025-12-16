import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProjectTemplates } from '@/lib/api/projectTemplates';
import { useKlanten } from '@/lib/api/klanten';
import { useAccountManagers } from '@/lib/api/accountManagers';
import { createProjectWebhook } from '@/lib/api/n8nProxy';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { useTranslation } from 'react-i18next';

// Baserow project_type options (from table 768 field API)
type ProjectCategory = 'Groeibegeleiding' | 'Procesoptimalisatie' | 'Digitalisering' | 'VOF naar BV' | 'Jaarrekening Pakket' | 'Bedrijfsoverdracht' | 'Overig';
// Baserow status options
type ProjectStatus = 'Concept' | 'Actief' | 'On hold' | 'Afgerond' | 'Geannuleerd';

export default function CreateProjectDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('Concept');
  const [selectedResponsible, setSelectedResponsible] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [deadline, setDeadline] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: templatesData } = useProjectTemplates();
  const { data: clientsData } = useKlanten();
  const { data: accountManagers } = useAccountManagers();

  const templates = templatesData?.results || [];
  const clients = clientsData?.results || [];
  const users = accountManagers || [];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const selectedClientData = clients.find(c => c.id === selectedClient);
  const selectedUserData = users.find(u => u.id.toString() === selectedResponsible);

  // Auto-calculate deadline when start date or template changes
  const calculatedDeadline = selectedTemplateData && startDate
    ? format(addDays(new Date(startDate), selectedTemplateData.default_duration_days), 'yyyy-MM-dd')
    : '';

  // Use calculated deadline if no manual deadline is set
  const effectiveDeadline = deadline || calculatedDeadline;

  const handleCreate = async () => {
    if (!selectedClient || !startDate || !selectedCategory || !selectedResponsible || !effectiveDeadline) {
      toast.error(t('projects.createDialog.fillRequired'));
      return;
    }

    const client = selectedClientData!;
    const user = selectedUserData!;

    // Build project name
    const projectName = `${selectedTemplateData?.name || selectedCategory} - ${client.naam}`;

    setIsSubmitting(true);

    // Generate initials from full_name (e.g., "Harm-Jan Kaspers" -> "HK")
    const nameParts = user.full_name.split(' ');
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : user.full_name.substring(0, 2).toUpperCase();

    try {
      const response = await createProjectWebhook({
        name: projectName,
        description: description,
        template_id: selectedTemplate || null,
        client_id: client.id,
        client_name: client.naam,
        project_type: selectedCategory,
        status: selectedStatus,
        start_date: startDate,
        planned_end_date: effectiveDeadline,
        assigned_to: user.id,
        responsible_team_member: user.full_name,
        responsible_initials: initials,
        progress_percentage: 0,
        created_at: new Date().toISOString(),
      });

      if (response.success && response.data?.success) {
        toast.success(t('projects.createDialog.success', { name: projectName }));

        // Reset form
        setSelectedTemplate('');
        setSelectedClient('');
        setSelectedCategory('');
        setSelectedStatus('Concept');
        setSelectedResponsible('');
        setDescription('');
        setStartDate(format(new Date(), 'yyyy-MM-dd'));
        setDeadline('');

        // Small delay before closing so user sees the success toast
        setTimeout(() => setOpen(false), 300);
      } else {
        toast.error(t('projects.createDialog.error'));
      }
    } catch (error) {
      toast.error(t('projects.createDialog.error'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: ProjectCategory[] = [
    'Groeibegeleiding',
    'Procesoptimalisatie',
    'Digitalisering',
    'VOF naar BV',
    'Jaarrekening Pakket',
    'Bedrijfsoverdracht',
    'Overig',
  ];

  const statuses: { value: ProjectStatus; label: string }[] = [
    { value: 'Concept', label: t('projects.status.concept') },
    { value: 'Actief', label: t('projects.status.actief') },
    { value: 'On hold', label: t('projects.status.onHold') },
    { value: 'Afgerond', label: t('projects.status.afgerond') },
    { value: 'Geannuleerd', label: t('projects.status.geannuleerd') },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-ka-green hover:bg-ka-green/90">
          <Plus className="w-4 h-4 mr-2" />
          {t('projects.newProject')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('projects.createDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('projects.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Template Selection (optional) */}
          <div className="space-y-2">
            <Label htmlFor="template">{t('projects.createDialog.template')}</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template">
                <SelectValue placeholder={t('projects.createDialog.selectTemplate')} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{template.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({template.default_duration_days} {t('projects.createDialog.days')})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplateData && (
              <p className="text-sm text-muted-foreground">
                {selectedTemplateData.description}
              </p>
            )}
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client">{t('projects.client')} *</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder={t('projects.createDialog.selectClient')} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.naam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">{t('projects.category')} *</Label>
            <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ProjectCategory)}>
              <SelectTrigger id="category">
                <SelectValue placeholder={t('projects.createDialog.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">{t('projects.status.label')} *</Label>
            <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ProjectStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Responsible Team Member Selection */}
          <div className="space-y-2">
            <Label htmlFor="responsible">{t('projects.createDialog.responsible')} *</Label>
            <Select value={selectedResponsible} onValueChange={setSelectedResponsible}>
              <SelectTrigger id="responsible">
                <SelectValue placeholder={t('projects.createDialog.selectResponsible')} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('projects.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('projects.createDialog.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">{t('projects.startDate')} *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">{t('projects.deadline')} *</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline || calculatedDeadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            {selectedTemplateData && !deadline && (
              <p className="text-xs text-muted-foreground">
                {t('projects.createDialog.autoCalculated')} ({selectedTemplateData.default_duration_days} {t('projects.createDialog.days')})
              </p>
            )}
          </div>

          {/* Preview */}
          {selectedClientData && startDate && effectiveDeadline && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium text-foreground mb-1">{t('projects.createDialog.preview')}:</p>
              <p className="text-muted-foreground">
                {t('projects.client')}: {selectedClientData.naam}
              </p>
              {selectedCategory && (
                <p className="text-muted-foreground">
                  {t('projects.category')}: {selectedCategory}
                </p>
              )}
              {selectedUserData && (
                <p className="text-muted-foreground">
                  {t('projects.createDialog.responsible')}: {selectedUserData.full_name}
                </p>
              )}
              <p className="text-muted-foreground">
                {t('projects.startDate')}: {startDate}
              </p>
              <p className="text-muted-foreground">
                {t('projects.deadline')}: {effectiveDeadline}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('projects.createDialog.cancel')}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {isSubmitting ? t('projects.createDialog.creating') : t('projects.createDialog.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
