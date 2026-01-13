import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import { Filter, Circle, Flame, PhoneMissed, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FilterPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: string;
    channel: string;
    priority: string;
    assigned: string;
    unreadOnly: boolean;
    missedCallsOnly: boolean;
  };
  onFiltersChange: (filters: { 
    status: string; 
    channel: string; 
    priority: string;
    assigned: string;
    unreadOnly: boolean;
    missedCallsOnly: boolean;
  }) => void;
}

export function FilterPopover({ open, onOpenChange, filters, onFiltersChange }: FilterPopoverProps) {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['common', 'navigation', 'translation']);

  const handleReset = () => {
    onFiltersChange({
      status: 'all',
      channel: 'all',
      priority: 'all',
      assigned: 'all',
      unreadOnly: false,
      missedCallsOnly: false,
    });
  };

  const handleApply = () => {
    onOpenChange(false);
  };

  const activeFiltersCount = [
    filters.status !== 'all',
    filters.channel !== 'all',
    filters.priority !== 'all',
    filters.assigned !== 'all',
    filters.unreadOnly,
    filters.missedCallsOnly,
  ].filter(Boolean).length;

  // Quick filter buttons
  const QuickFilters = () => (
    <div className="flex items-center gap-1 mb-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={filters.unreadOnly ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onFiltersChange({ ...filters, unreadOnly: !filters.unreadOnly })}
          >
            <Circle className={`h-4 w-4 ${filters.unreadOnly ? 'fill-current' : ''}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('translation:inbox.filters.unreadOnly')}</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={filters.priority === 'urgent' ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onFiltersChange({ 
              ...filters, 
              priority: filters.priority === 'urgent' ? 'all' : 'urgent' 
            })}
          >
            <Flame className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('translation:inbox.filters.urgentOnly')}</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={filters.missedCallsOnly ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onFiltersChange({ ...filters, missedCallsOnly: !filters.missedCallsOnly })}
          >
            <PhoneMissed className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('translation:inbox.filters.missedCalls')}</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={filters.assigned === 'me' ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onFiltersChange({ 
              ...filters, 
              assigned: filters.assigned === 'me' ? 'all' : 'me' 
            })}
          >
            <User className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('translation:inbox.filters.assignedToMe')}</TooltipContent>
      </Tooltip>
    </div>
  );

  // Filter content component (shared between popover and sheet)
  const FilterContent = () => (
    <div className="space-y-4">
      <QuickFilters />
      
      <div className="space-y-2">
        <Label htmlFor="status">{t('translation:inbox.filters.status')}</Label>
        <Select 
          value={filters.status} 
          onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('translation:inbox.filters.allStatuses')}</SelectItem>
            <SelectItem value="open">{t('translation:inbox.filters.open')}</SelectItem>
            <SelectItem value="closed">{t('translation:inbox.filters.closed')}</SelectItem>
            <SelectItem value="pending">{t('translation:inbox.filters.pending')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="channel">{t('translation:inbox.filters.channel')}</Label>
        <Select 
          value={filters.channel} 
          onValueChange={(value) => onFiltersChange({ ...filters, channel: value })}
        >
          <SelectTrigger id="channel">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('translation:inbox.filters.allChannels')}</SelectItem>
            <SelectItem value="whatsapp">{t('navigation:channels.whatsapp')}</SelectItem>
            <SelectItem value="email">{t('navigation:channels.email')}</SelectItem>
            <SelectItem value="phone">{t('navigation:channels.phone')}</SelectItem>
            <SelectItem value="video">{t('navigation:channels.video')}</SelectItem>
            <SelectItem value="sms">{t('navigation:channels.sms')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">{t('translation:inbox.filters.priority')}</Label>
        <Select 
          value={filters.priority} 
          onValueChange={(value) => onFiltersChange({ ...filters, priority: value })}
        >
          <SelectTrigger id="priority">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('translation:inbox.filters.allPriorities')}</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">{t('translation:inbox.filters.high')}</SelectItem>
            <SelectItem value="normal">{t('translation:inbox.filters.normal')}</SelectItem>
            <SelectItem value="low">{t('translation:inbox.filters.low')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigned">{t('translation:inbox.filters.assigned')}</Label>
        <Select 
          value={filters.assigned} 
          onValueChange={(value) => onFiltersChange({ ...filters, assigned: value })}
        >
          <SelectTrigger id="assigned">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('translation:inbox.filters.allAssigned')}</SelectItem>
            <SelectItem value="me">{t('translation:inbox.filters.assignedToMe')}</SelectItem>
            <SelectItem value="unassigned">{t('translation:inbox.filters.unassigned')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="unread" className="cursor-pointer">{t('translation:inbox.filters.unreadOnly')}</Label>
        <Switch 
          id="unread"
          checked={filters.unreadOnly}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, unreadOnly: checked })}
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="missed" className="cursor-pointer">{t('translation:inbox.filters.missedCalls')}</Label>
        <Switch 
          id="missed"
          checked={filters.missedCallsOnly}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, missedCallsOnly: checked })}
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={handleReset} size="sm">
          {t('common:actions.reset')}
        </Button>
        <Button onClick={handleApply} size="sm">
          {t('common:actions.apply')}
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
              {t('translation:inbox.filters.title')}
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
          className="relative h-9 w-9 xs:h-10 xs:w-10"
          title={t('translation:inbox.filters.title')}
        >
          <Filter className="w-4 h-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
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
            {t('translation:inbox.filters.title')}
          </h4>
          <p className="text-xs text-muted-foreground">
            {t('translation:inbox.filters.description')}
          </p>
        </div>
        <FilterContent />
      </PopoverContent>
    </Popover>
  );
}
