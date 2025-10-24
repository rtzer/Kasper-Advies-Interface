import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InboxFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: string;
    channel: string;
    priority: string;
  };
  onFiltersChange: (filters: { status: string; channel: string; priority: string }) => void;
}

export function InboxFilterDialog({ open, onOpenChange, filters, onFiltersChange }: InboxFilterDialogProps) {
  const handleApply = () => {
    onOpenChange(false);
  };

  const handleReset = () => {
    onFiltersChange({
      status: 'all',
      channel: 'all',
      priority: 'all',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Filter Gesprekken</DialogTitle>
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Gesloten</SelectItem>
                <SelectItem value="pending">In afwachting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Kanaal</Label>
            <Select 
              value={filters.channel} 
              onValueChange={(value) => onFiltersChange({ ...filters, channel: value })}
            >
              <SelectTrigger id="channel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle kanalen</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Telefoon</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
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
                <SelectItem value="high">Hoog</SelectItem>
                <SelectItem value="normal">Normaal</SelectItem>
                <SelectItem value="low">Laag</SelectItem>
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