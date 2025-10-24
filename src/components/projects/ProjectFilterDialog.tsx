import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: string;
    category: string;
    priority: string;
  };
  onFiltersChange: (filters: { status: string; category: string; priority: string }) => void;
}

export function ProjectFilterDialog({ open, onOpenChange, filters, onFiltersChange }: ProjectFilterDialogProps) {
  const handleApply = () => {
    onOpenChange(false);
  };

  const handleReset = () => {
    onFiltersChange({
      status: 'all',
      category: 'all',
      priority: 'all',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Filter Projecten</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statussen</SelectItem>
                <SelectItem value="In uitvoering">In uitvoering</SelectItem>
                <SelectItem value="Wacht op klant">Wacht op klant</SelectItem>
                <SelectItem value="Geblokkeerd">Geblokkeerd</SelectItem>
                <SelectItem value="Voltooid">Voltooid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categorie</Label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle categorieën</SelectItem>
                <SelectItem value="BTW">BTW</SelectItem>
                <SelectItem value="Jaaropgave">Jaaropgave</SelectItem>
                <SelectItem value="Belastingaangifte">Belastingaangifte</SelectItem>
                <SelectItem value="Advies">Advies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioriteit</Label>
            <Select 
              value={filters.priority} 
              onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle prioriteiten</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Hoog">Hoog</SelectItem>
                <SelectItem value="Normaal">Normaal</SelectItem>
                <SelectItem value="Laag">Laag</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Toepassen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}