import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { Filter } from 'lucide-react';

interface FilterPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: string;
    channel: string;
    priority: string;
  };
  onFiltersChange: (filters: { status: string; channel: string; priority: string }) => void;
}

export function FilterPopover({ open, onOpenChange, filters, onFiltersChange }: FilterPopoverProps) {
  const isMobile = useIsMobile();

  const handleReset = () => {
    onFiltersChange({
      status: 'all',
      channel: 'all',
      priority: 'all',
    });
  };

  const handleApply = () => {
    onOpenChange(false);
  };

  // Filter content component (shared between popover and sheet)
  const FilterContent = () => (
    <div className="space-y-4">
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
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">Hoog</SelectItem>
            <SelectItem value="normal">Normaal</SelectItem>
            <SelectItem value="low">Laag</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={handleReset} size="sm">
          Reset
        </Button>
        <Button onClick={handleApply} size="sm">
          Toepassen
        </Button>
      </div>
    </div>
  );

  // Mobile: Use Sheet (bottom drawer)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Gesprekken
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop/Tablet: Use Popover
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
          title="Filter gesprekken"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-4" 
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="space-y-1 mb-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Gesprekken
          </h4>
          <p className="text-xs text-muted-foreground">
            Filter gesprekken op status, kanaal en prioriteit
          </p>
        </div>
        <FilterContent />
      </PopoverContent>
    </Popover>
  );
}
