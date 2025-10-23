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
import { useProjectTemplates } from '@/lib/api/projectTemplates';
import { useKlanten } from '@/lib/api/klanten';
import { useCreateProject } from '@/lib/api/projects';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [quarter, setQuarter] = useState<string>('');

  const { data: templatesData } = useProjectTemplates();
  const { data: clientsData } = useKlanten();
  const createProjectMutation = useCreateProject();

  const templates = templatesData?.results || [];
  const clients = clientsData?.results || [];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const selectedClientData = clients.find(c => c.id === selectedClient);
  const isBTWTemplate = selectedTemplateData?.category === 'BTW';

  const handleCreate = async () => {
    if (!selectedTemplate || !selectedClient || !startDate) {
      toast.error('Vul alle verplichte velden in');
      return;
    }

    if (isBTWTemplate && !quarter) {
      toast.error('Selecteer een kwartaal voor BTW aangifte');
      return;
    }

    const template = selectedTemplateData!;
    const client = selectedClientData!;
    
    // Calculate deadline based on template duration
    const deadlineDate = addDays(new Date(startDate), template.default_duration_days);
    
    // For BTW, use fixed quarterly deadlines
    let finalDeadline = format(deadlineDate, 'yyyy-MM-dd');
    if (isBTWTemplate && quarter) {
      const year = new Date(startDate).getFullYear();
      const deadlines: Record<string, string> = {
        'Q1': `${year}-04-25`,
        'Q2': `${year}-07-25`,
        'Q3': `${year}-10-25`,
        'Q4': `${year + 1}-01-25`,
      };
      finalDeadline = deadlines[quarter];
    }

    // Build project name
    let projectName = template.name;
    if (isBTWTemplate && quarter) {
      projectName = `BTW Aangifte ${quarter} ${new Date(startDate).getFullYear()} - ${client.naam}`;
    } else {
      projectName = `${template.name} - ${client.naam}`;
    }

    try {
      await createProjectMutation.mutateAsync({
        name: projectName,
        template_id: template.id,
        client_id: client.id,
        client_name: client.naam,
        category: template.category,
        status: 'niet-gestart',
        start_date: startDate,
        deadline: finalDeadline,
        completion_percentage: 0,
        responsible_team_member: 'Harm-Jan Kaspers', // Default, could be selected
        responsible_initials: 'HK',
        is_overdue: false,
        blocked_reason: null,
        last_reminder_sent: null,
        reminder_count: 0,
        created_at: new Date().toISOString(),
      });

      toast.success(`Project "${projectName}" aangemaakt!`);
      setOpen(false);
      
      // Reset form
      setSelectedTemplate('');
      setSelectedClient('');
      setStartDate(format(new Date(), 'yyyy-MM-dd'));
      setQuarter('');
    } catch (error) {
      toast.error('Fout bij aanmaken project');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-ka-green hover:bg-ka-green/90">
          <Plus className="w-4 h-4 mr-2" />
          Nieuw Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nieuw Project Aanmaken</DialogTitle>
          <DialogDescription>
            Maak een nieuw project aan vanuit een template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Project Template *</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Selecteer template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{template.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({template.default_duration_days} dagen)
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
            <Label htmlFor="client">Klant *</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecteer klant..." />
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

          {/* Quarter Selection (only for BTW) */}
          {isBTWTemplate && (
            <div className="space-y-2">
              <Label htmlFor="quarter">Kwartaal *</Label>
              <Select value={quarter} onValueChange={setQuarter}>
                <SelectTrigger id="quarter">
                  <SelectValue placeholder="Selecteer kwartaal..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1">Q1 (Jan-Mrt) - Deadline: 25 april</SelectItem>
                  <SelectItem value="Q2">Q2 (Apr-Jun) - Deadline: 25 juli</SelectItem>
                  <SelectItem value="Q3">Q3 (Jul-Sep) - Deadline: 25 oktober</SelectItem>
                  <SelectItem value="Q4">Q4 (Okt-Dec) - Deadline: 25 januari</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Startdatum *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Calculated Deadline Preview */}
          {selectedTemplateData && startDate && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium text-foreground mb-1">Preview:</p>
              <p className="text-muted-foreground">
                Geschatte doorlooptijd: {selectedTemplateData.default_duration_days} dagen
              </p>
              {isBTWTemplate && quarter && (
                <p className="text-muted-foreground">
                  Deadline: {quarter === 'Q1' ? '25 april' : quarter === 'Q2' ? '25 juli' : quarter === 'Q3' ? '25 oktober' : '25 januari (volgend jaar)'}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuleren
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={createProjectMutation.isPending}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {createProjectMutation.isPending ? 'Bezig...' : 'Project Aanmaken'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
