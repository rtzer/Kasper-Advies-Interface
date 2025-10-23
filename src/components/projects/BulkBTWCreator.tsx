import { useState } from 'react';
import { Calendar, Users, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useKlanten } from '@/lib/api/klanten';
import { useProjectTemplates } from '@/lib/api/projectTemplates';
import { useCreateProject } from '@/lib/api/projects';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

export default function BulkBTWCreator() {
  const [quarter, setQuarter] = useState('Q1');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);

  const { data: clientsData } = useKlanten();
  const { data: templatesData } = useProjectTemplates();
  const createProjectMutation = useCreateProject();

  const clients = clientsData?.results || [];
  const btwTemplate = templatesData?.results.find(t => t.category === 'BTW');

  const toggleClient = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const selectAll = () => {
    setSelectedClients(clients.map(c => c.id));
  };

  const deselectAll = () => {
    setSelectedClients([]);
  };

  const handleBulkCreate = async () => {
    if (selectedClients.length === 0) {
      toast.error('Selecteer minimaal één klant');
      return;
    }

    if (!btwTemplate) {
      toast.error('BTW template niet gevonden');
      return;
    }

    setIsCreating(true);
    setProgress(0);

    const deadlines: Record<string, string> = {
      'Q1': `${year}-04-25`,
      'Q2': `${year}-07-25`,
      'Q3': `${year}-10-25`,
      'Q4': `${parseInt(year) + 1}-01-25`,
    };

    const startDates: Record<string, string> = {
      'Q1': `${year}-01-01`,
      'Q2': `${year}-04-01`,
      'Q3': `${year}-07-01`,
      'Q4': `${year}-10-01`,
    };

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedClients.length; i++) {
      const clientId = selectedClients[i];
      const client = clients.find(c => c.id === clientId);

      if (!client) continue;

      try {
        await createProjectMutation.mutateAsync({
          name: `BTW Aangifte ${quarter} ${year} - ${client.naam}`,
          template_id: btwTemplate.id,
          client_id: client.id,
          client_name: client.naam,
          category: 'BTW',
          status: 'niet-gestart',
          start_date: startDates[quarter],
          deadline: deadlines[quarter],
          completion_percentage: 0,
          responsible_team_member: client.accountmanager || 'Harm-Jan Kaspers',
          responsible_initials: (client.accountmanager || 'Harm-Jan Kaspers')
            .split(' ')
            .map(n => n[0])
            .join(''),
          is_overdue: false,
          blocked_reason: null,
          last_reminder_sent: null,
          reminder_count: 0,
          created_at: new Date().toISOString(),
        });

        successCount++;
      } catch (error) {
        console.error(`Fout bij aanmaken project voor ${client.naam}:`, error);
        failCount++;
      }

      // Update progress
      setProgress(Math.round(((i + 1) / selectedClients.length) * 100));
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsCreating(false);
    setProgress(0);

    if (successCount > 0) {
      toast.success(`${successCount} BTW projecten succesvol aangemaakt voor ${quarter} ${year}!`);
    }

    if (failCount > 0) {
      toast.error(`${failCount} projecten konden niet worden aangemaakt`);
    }

    // Reset selection
    setSelectedClients([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ka-green" />
          BTW Projecten Bulk Aanmaken
        </CardTitle>
        <CardDescription>
          Maak in één keer BTW-aangifte projecten aan voor meerdere klanten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quarter & Year Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quarter">Kwartaal</Label>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger id="quarter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1">Q1 (Jan-Mrt)</SelectItem>
                <SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem>
                <SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem>
                <SelectItem value="Q4">Q4 (Okt-Dec)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Jaar</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={(new Date().getFullYear() - 1).toString()}>
                  {new Date().getFullYear() - 1}
                </SelectItem>
                <SelectItem value={new Date().getFullYear().toString()}>
                  {new Date().getFullYear()}
                </SelectItem>
                <SelectItem value={(new Date().getFullYear() + 1).toString()}>
                  {new Date().getFullYear() + 1}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Deadline Info */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-100">
            Deadline voor {quarter} {year}:
          </p>
          <p className="text-blue-800 dark:text-blue-200">
            {quarter === 'Q1' && `25 april ${year}`}
            {quarter === 'Q2' && `25 juli ${year}`}
            {quarter === 'Q3' && `25 oktober ${year}`}
            {quarter === 'Q4' && `25 januari ${parseInt(year) + 1}`}
          </p>
        </div>

        {/* Client Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Selecteer klanten</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAll}
                disabled={isCreating}
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                Alles
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={deselectAll}
                disabled={isCreating}
              >
                <Square className="w-4 h-4 mr-1" />
                Geen
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 max-h-80 overflow-y-auto space-y-2">
            {clients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Geen klanten gevonden
              </p>
            ) : (
              clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors"
                >
                  <Checkbox
                    id={`client-${client.id}`}
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => toggleClient(client.id)}
                    disabled={isCreating}
                  />
                  <label
                    htmlFor={`client-${client.id}`}
                    className="flex-1 text-sm font-medium cursor-pointer"
                  >
                    {client.naam}
                  </label>
                  {client.type_klant && (
                    <span className="text-xs text-muted-foreground">
                      {client.type_klant}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Progress Bar (shown during creation) */}
        {isCreating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Projecten aanmaken...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            {selectedClients.length} {selectedClients.length === 1 ? 'klant' : 'klanten'} geselecteerd
          </div>
          <Button
            onClick={handleBulkCreate}
            disabled={selectedClients.length === 0 || isCreating}
            className="bg-ka-green hover:bg-ka-green/90"
          >
            {isCreating ? (
              <>Bezig met aanmaken...</>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Projecten Aanmaken
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
