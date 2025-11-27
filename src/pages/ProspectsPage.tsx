import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProspects, useProspectStats } from '@/lib/api/prospects';
import { Prospect, ProspectStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ProspectStatusBadge } from '@/components/prospects/ProspectStatusBadge';
import { ProspectTypeBadge } from '@/components/prospects/ProspectTypeBadge';
import { ProspectSourceIcon } from '@/components/prospects/ProspectSourceIcon';
import { ProspectsPipeline } from '@/components/prospects/ProspectsPipeline';
import { ProspectDetailPanel } from '@/components/prospects/ProspectDetailPanel';
import { CreateProspectDialog } from '@/components/prospects/CreateProspectDialog';
import { ConvertToClientDialog } from '@/components/prospects/ConvertToClientDialog';
import { MarkAsLostDialog } from '@/components/prospects/MarkAsLostDialog';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { Users, Plus, TrendingUp, CheckCircle, Search, List, KanbanSquare, Calendar, RotateCcw } from 'lucide-react';

export default function ProspectsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'nl' ? nl : enUS;
  
  const [view, setView] = useState<'list' | 'pipeline'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useProspectStats();
  const { data: prospects = [], isLoading } = useProspects({
    search: search || undefined,
    status: statusFilter !== 'all' ? [statusFilter as ProspectStatus] : undefined,
    type: typeFilter !== 'all' ? typeFilter as Prospect['type_prospect'] : undefined,
  });

  const handleSelectProspect = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setDetailOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const hasFilters = search || statusFilter !== 'all' || typeFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('prospects.title')}</h1>
          <p className="text-muted-foreground">{t('prospects.subtitle')}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-ka-green hover:bg-ka-green/90">
          <Plus className="w-4 h-4 mr-2" />
          {t('prospects.new')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ka-navy/10">
              <Users className="w-5 h-5 text-ka-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.totaal}</p>
              <p className="text-xs text-muted-foreground">{t('prospects.stats.total')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.nieuwDezeWeek}</p>
              <p className="text-xs text-muted-foreground">{t('prospects.stats.newThisWeek')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.inPipeline}</p>
              <p className="text-xs text-muted-foreground">{t('prospects.stats.inPipeline')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-ka-green/10">
              <CheckCircle className="w-5 h-5 text-ka-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">{statsLoading ? '-' : stats?.gewonnenDezeMaand}</p>
              <p className="text-xs text-muted-foreground">{t('prospects.stats.wonThisMonth')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('prospects.searchPlaceholder')}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('prospects.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('prospects.allStatuses')}</SelectItem>
            <SelectItem value="Nieuw">Nieuw</SelectItem>
            <SelectItem value="Contact gehad">Contact gehad</SelectItem>
            <SelectItem value="Gekwalificeerd">Gekwalificeerd</SelectItem>
            <SelectItem value="Offerte">Offerte</SelectItem>
            <SelectItem value="Gewonnen">Gewonnen</SelectItem>
            <SelectItem value="Verloren">Verloren</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder={t('prospects.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('prospects.allTypes')}</SelectItem>
            <SelectItem value="MKB">MKB</SelectItem>
            <SelectItem value="ZZP">ZZP</SelectItem>
            <SelectItem value="Particulier">Particulier</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="w-4 h-4 mr-1" />
            {t('prospects.resetFilters')}
          </Button>
        )}
        <div className="ml-auto">
          <Tabs value={view} onValueChange={v => setView(v as 'list' | 'pipeline')}>
            <TabsList>
              <TabsTrigger value="list"><List className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="pipeline"><KanbanSquare className="w-4 h-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : view === 'list' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('prospects.prospect')}</TableHead>
                <TableHead>{t('prospects.type')}</TableHead>
                <TableHead>{t('prospects.status')}</TableHead>
                <TableHead>{t('prospects.source')}</TableHead>
                <TableHead>{t('prospects.interests')}</TableHead>
                <TableHead>{t('prospects.assignedTo')}</TableHead>
                <TableHead>{t('prospects.nextAction')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prospects.map(prospect => (
                <TableRow 
                  key={prospect.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSelectProspect(prospect)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{prospect.bedrijfsnaam || `${prospect.voornaam} ${prospect.achternaam}`}</div>
                      <div className="text-xs text-muted-foreground">{prospect.prospect_nummer}</div>
                    </div>
                  </TableCell>
                  <TableCell><ProspectTypeBadge type={prospect.type_prospect} /></TableCell>
                  <TableCell><ProspectStatusBadge status={prospect.status} /></TableCell>
                  <TableCell><ProspectSourceIcon bron={prospect.bron} showLabel /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {prospect.interesse.slice(0,2).map(i => (
                        <Badge key={i} variant="outline" className="text-xs">{i}</Badge>
                      ))}
                      {prospect.interesse.length > 2 && <Badge variant="outline" className="text-xs">+{prospect.interesse.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{prospect.toegewezen_aan.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{prospect.toegewezen_aan}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(prospect.volgende_actie_datum), 'dd MMM', { locale })}
                      </div>
                      <div className="truncate max-w-32">{prospect.volgende_actie}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <ProspectsPipeline prospects={prospects} onSelectProspect={handleSelectProspect} />
      )}

      {/* Dialogs */}
      <CreateProspectDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ProspectDetailPanel
        prospect={selectedProspect}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onConvert={() => { setDetailOpen(false); setConvertOpen(true); }}
        onMarkAsLost={() => { setDetailOpen(false); setLostOpen(true); }}
      />
      <ConvertToClientDialog open={convertOpen} onOpenChange={setConvertOpen} prospect={selectedProspect} />
      <MarkAsLostDialog open={lostOpen} onOpenChange={setLostOpen} prospect={selectedProspect} />
    </div>
  );
}
