import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreateClientDialog } from '@/components/clients/CreateClientDialog';
import { useKlanten } from '@/lib/api/klanten';
import { useUsers } from '@/lib/api/users';
import { Klant, LifecycleStage } from '@/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Search, Users, Plus, Mail, Phone, MessageSquare, Star, 
  UserCheck, AlertTriangle, UserPlus, CheckSquare, Download
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { useDeviceChecks } from '@/hooks/useBreakpoint';
import { LifecycleBadge } from '@/components/clients/LifecycleBadge';
import { HealthScoreIndicator } from '@/components/clients/HealthScoreIndicator';
import { LastContactIndicator } from '@/components/clients/LastContactIndicator';
import { toast } from 'sonner';

type QuickTab = 'all' | 'focus' | 'at-risk' | 'new';

export default function ClientsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('all');
  const [accountmanagerFilter, setAccountmanagerFilter] = useState<string>('all');
  const [focusOnly, setFocusOnly] = useState(false);
  const [hasOpenTasks, setHasOpenTasks] = useState(false);
  const [quickTab, setQuickTab] = useState<QuickTab>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { isMobile } = useDeviceChecks();
  const { data, isLoading } = useKlanten();
  const { data: users = [] } = useUsers();
  const klanten = data?.results || [];

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      total: klanten.length,
      actief: klanten.filter(k => k.status === 'Actief').length,
      focus: klanten.filter(k => k.focus_client).length,
      lowHealth: klanten.filter(k => k.health_score < 50).length,
      newClients: klanten.filter(k => new Date(k.sinds_wanneer_klant) >= thirtyDaysAgo).length,
    };
  }, [klanten]);

  // Apply quick tab filter
  const getQuickTabFilter = (k: Klant): boolean => {
    switch (quickTab) {
      case 'focus': return k.focus_client;
      case 'at-risk': return k.lifecycle_stage === 'At-risk';
      case 'new': return k.lifecycle_stage === 'Onboarding';
      default: return true;
    }
  };

  // Filter clients
  const filteredKlanten = useMemo(() => {
    return klanten.filter((klant) => {
      const matchesSearch = 
        klant.naam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        klant.klant_nummer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        klant.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || klant.status === statusFilter;
      const matchesType = typeFilter === 'all' || klant.type_klant === typeFilter;
      const matchesLifecycle = lifecycleFilter === 'all' || klant.lifecycle_stage === lifecycleFilter;
      const matchesAccountmanager = accountmanagerFilter === 'all' || klant.accountmanager === accountmanagerFilter;
      const matchesFocus = !focusOnly || klant.focus_client;
      const matchesOpenTasks = !hasOpenTasks || klant.open_tasks_count > 0;
      const matchesQuickTab = getQuickTabFilter(klant);

      return matchesSearch && matchesStatus && matchesType && matchesLifecycle && 
             matchesAccountmanager && matchesFocus && matchesOpenTasks && matchesQuickTab;
    });
  }, [klanten, searchQuery, statusFilter, typeFilter, lifecycleFilter, accountmanagerFilter, focusOnly, hasOpenTasks, quickTab]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredKlanten.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredKlanten.map(k => k.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAssign = () => {
    toast.success(t('clients.bulk.assignSuccess', { count: selectedIds.length }));
    setSelectedIds([]);
  };

  const handleExport = () => {
    toast.success(t('clients.bulk.exportSuccess', { count: selectedIds.length }));
    setSelectedIds([]);
  };

  // Get unique accountmanagers
  const accountmanagers = useMemo(() => {
    return [...new Set(klanten.map(k => k.accountmanager))].filter(Boolean);
  }, [klanten]);

  return (
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 space-y-3 xs:space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className={`${responsiveHeading.h2} flex items-center gap-2`}>
            <Users className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-ka-green flex-shrink-0" />
            <span className="truncate">{t('clients.title')}</span>
          </h1>
          <p className={`${responsiveBody.small} mt-0.5 xs:mt-1 truncate`}>
            {t('clients.subtitle')}
          </p>
        </div>
        <Button 
          className="bg-ka-green hover:bg-ka-green/90 w-full xs:w-auto h-10 xs:h-11 text-sm xs:text-base flex-shrink-0" 
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5 xs:mr-2" />
          {isMobile ? t('clients.newShort') : t('clients.new')}
        </Button>
      </div>

      <CreateClientDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-ka-navy dark:text-ka-navy-light" />
            <div>
              <div className="text-[10px] xs:text-xs text-muted-foreground">{t('clients.stats.total')}</div>
              <div className="text-lg xs:text-xl font-bold">{stats.total}</div>
            </div>
          </div>
        </Card>
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-ka-green" />
            <div>
              <div className="text-[10px] xs:text-xs text-muted-foreground">{t('clients.stats.active')}</div>
              <div className="text-lg xs:text-xl font-bold text-ka-green">{stats.actief}</div>
            </div>
          </div>
        </Card>
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <div>
              <div className="text-[10px] xs:text-xs text-muted-foreground">{t('clients.stats.focus')}</div>
              <div className="text-lg xs:text-xl font-bold text-yellow-600">{stats.focus}</div>
            </div>
          </div>
        </Card>
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-[10px] xs:text-xs text-muted-foreground">{t('clients.stats.lowHealth')}</div>
              <div className="text-lg xs:text-xl font-bold text-red-600">{stats.lowHealth}</div>
            </div>
          </div>
        </Card>
        <Card className="px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 border-ka-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-[10px] xs:text-xs text-muted-foreground">{t('clients.stats.new30days')}</div>
              <div className="text-lg xs:text-xl font-bold text-blue-600">{stats.newClients}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Filter Tabs */}
      <Tabs value={quickTab} onValueChange={(v) => setQuickTab(v as QuickTab)} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all" className="gap-2">
            {t('clients.tabs.all')}
            <Badge variant="secondary" className="h-5 px-1.5">{stats.total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus" className="gap-2">
            {t('clients.tabs.focus')}
            <Badge variant="secondary" className="h-5 px-1.5 bg-yellow-100 text-yellow-700">{stats.focus}</Badge>
          </TabsTrigger>
          <TabsTrigger value="at-risk" className="gap-2">
            {t('clients.tabs.atRisk')}
            <Badge variant="destructive" className="h-5 px-1.5">{klanten.filter(k => k.lifecycle_stage === 'At-risk').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2">
            {t('clients.tabs.new')}
            <Badge variant="secondary" className="h-5 px-1.5 bg-blue-100 text-blue-700">{klanten.filter(k => k.lifecycle_stage === 'Onboarding').length}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <Card className="px-3 xs:px-4 py-3 xs:py-4 border-ka-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2 xs:gap-2.5 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 xs:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 xs:w-4 xs:h-4" />
              <Input
                placeholder={t('clients.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 xs:pl-10 h-9 xs:h-10 text-xs xs:text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[130px] h-9 xs:h-10 text-xs xs:text-sm">
                <SelectValue placeholder={t('clients.filters.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filters.allStatuses')}</SelectItem>
                <SelectItem value="Actief">{t('clients.filters.active')}</SelectItem>
                <SelectItem value="Inactief">{t('clients.filters.inactive')}</SelectItem>
                <SelectItem value="Prospect">{t('clients.filters.prospect')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 xs:h-10 text-xs xs:text-sm">
                <SelectValue placeholder={t('clients.filters.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filters.allTypes')}</SelectItem>
                <SelectItem value="ZZP">ZZP</SelectItem>
                <SelectItem value="MKB">MKB</SelectItem>
                <SelectItem value="Particulier">{t('clients.filters.particulier')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
              <SelectTrigger className="w-full sm:w-[140px] h-9 xs:h-10 text-xs xs:text-sm">
                <SelectValue placeholder={t('clients.filters.lifecycle')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filters.allLifecycle')}</SelectItem>
                <SelectItem value="Onboarding">{t('clients.lifecycle.onboarding')}</SelectItem>
                <SelectItem value="Actief">{t('clients.lifecycle.active')}</SelectItem>
                <SelectItem value="At-risk">{t('clients.lifecycle.atRisk')}</SelectItem>
                <SelectItem value="Churned">{t('clients.lifecycle.churned')}</SelectItem>
                <SelectItem value="Reactivated">{t('clients.lifecycle.reactivated')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={accountmanagerFilter} onValueChange={setAccountmanagerFilter}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 xs:h-10 text-xs xs:text-sm">
                <SelectValue placeholder={t('clients.filters.accountmanager')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('clients.filters.allAccountmanagers')}</SelectItem>
                {accountmanagers.map(am => (
                  <SelectItem key={am} value={am}>{am}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={focusOnly} onCheckedChange={(c) => setFocusOnly(!!c)} />
              <span>{t('clients.filters.focusOnly')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={hasOpenTasks} onCheckedChange={(c) => setHasOpenTasks(!!c)} />
              <span>{t('clients.filters.hasOpenTasks')}</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card className="px-3 py-2 bg-ka-green/10 border-ka-green/30 flex items-center justify-between">
          <span className="text-sm font-medium">
            {t('clients.bulk.selected', { count: selectedIds.length })}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleBulkAssign}>
              {t('clients.bulk.assign')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              {t('clients.bulk.export')}
            </Button>
          </div>
        </Card>
      )}

      {/* Clients Table */}
      <Card className="border-ka-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredKlanten.length === 0 ? (
          <div className="px-3 xs:px-4 sm:px-6 py-8 text-center">
            <Users className="w-10 h-10 xs:w-12 xs:h-12 text-muted-foreground mx-auto mb-2 xs:mb-3" />
            <h3 className={`${responsiveHeading.h4} mb-1`}>{t('clients.noResults')}</h3>
            <p className={responsiveBody.small}>{t('clients.noResultsHint')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox 
                      checked={selectedIds.length === filteredKlanten.length && filteredKlanten.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t('clients.table.client')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('clients.table.type')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('clients.table.lifecycle')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('clients.table.health')}</TableHead>
                  <TableHead className="hidden xl:table-cell">{t('clients.table.accountmanager')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('clients.table.lastContact')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('clients.table.openTasks')}</TableHead>
                  <TableHead className="w-24">{t('clients.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKlanten.map((klant) => (
                  <TableRow 
                    key={klant.id} 
                    className="group hover:bg-muted/50 cursor-pointer"
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedIds.includes(klant.id)}
                        onCheckedChange={() => handleSelect(klant.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Link to={`/clients/${klant.id}`} className="block">
                        <div className="flex items-center gap-2">
                          {klant.focus_client && (
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          )}
                          <div>
                            <div className="font-medium text-sm">{klant.naam}</div>
                            <div className="text-xs text-muted-foreground font-mono">{klant.klant_nummer}</div>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {klant.type_klant}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <LifecycleBadge stage={klant.lifecycle_stage} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <HealthScoreIndicator score={klant.health_score} size="sm" />
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-[10px]">
                            {klant.accountmanager?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs truncate max-w-24">{klant.accountmanager}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <LastContactIndicator 
                        date={klant.last_contact_date} 
                        clientType={klant.type_klant} 
                      />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {klant.open_tasks_count > 0 ? (
                        <Badge variant="secondary" className="text-xs">
                          <CheckSquare className="w-3 h-3 mr-1" />
                          {klant.open_tasks_count}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `mailto:${klant.email}`;
                              }}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Email</TooltipContent>
                        </Tooltip>
                        {klant.mobiel && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.open(`https://wa.me/${klant.mobiel?.replace(/\D/g, '')}`, '_blank');
                                }}
                              >
                                <MessageSquare className="w-4 h-4 text-green-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>WhatsApp</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `tel:${klant.telefoonnummer}`;
                              }}
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t('clients.actions.call')}</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Results count */}
      {!isLoading && filteredKlanten.length > 0 && (
        <div className="text-center text-xs xs:text-sm text-muted-foreground py-2">
          {t('clients.resultsCount', { shown: filteredKlanten.length, total: klanten.length })}
        </div>
      )}
    </div>
  );
}
