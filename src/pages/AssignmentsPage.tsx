import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateOpdrachtDialog } from '@/components/projects/CreateOpdrachtDialog';
import { 
  Briefcase, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Plus,
  List,
  LayoutGrid,
  CalendarDays,
  Users,
  User,
  Search,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOpdrachten } from '@/lib/api/opdrachten';
import { useUsers } from '@/lib/api/users';
import { useUserStore } from '@/store/userStore';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { differenceInDays, isPast, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { OpdrachtTypeBadge } from '@/components/assignments/OpdrachtTypeBadge';
import { DeadlineIndicator } from '@/components/assignments/DeadlineIndicator';
import { AssignmentProgressBar } from '@/components/assignments/AssignmentProgressBar';
import { FacturatieStatusBadge, FacturatieStatus } from '@/components/assignments/FacturatieStatusBadge';
import { AssignmentsKanban } from '@/components/assignments/AssignmentsKanban';
import { AssignmentsCalendar } from '@/components/assignments/AssignmentsCalendar';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'kanban' | 'calendar' | 'byClient';

const assignmentTypes = [
  'BTW-aangifte',
  'IB (Inkomstenbelasting)',
  'Jaarrekening',
  'Vennootschapsbelasting',
  'Loonadministratie',
  'Toeslag aanvragen',
  'Groeibegeleiding',
  'Procesoptimalisatie',
];

export default function AssignmentsPage() {
  const { t } = useTranslation(['common']);
  const { currentUser } = useUserStore();
  const { user: authUser } = useAuth();
  const location = useLocation();
  const isMyAssignmentsPage = location.pathname === '/assignments/my';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVerantwoordelijke, setFilterVerantwoordelijke] = useState<string>('all');
  const [filterInvoice, setFilterInvoice] = useState<string>('all');
  const [searchClient, setSearchClient] = useState('');
  const [onlyMine, setOnlyMine] = useState(isMyAssignmentsPage);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { data: opdrachtenData, isLoading } = useOpdrachten();
  const { data: usersData } = useUsers();
  
  const opdrachten = opdrachtenData?.results || [];
  const users = usersData || [];
  
  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const activeStatuses = ['Intake', 'In behandeling', 'Wacht op klant', 'Gereed voor controle'];
    
    return {
      totalActive: opdrachten.filter(o => activeStatuses.includes(o.status)).length,
      deadlineThisWeek: opdrachten.filter(o => {
        if (!o.deadline) return false;
        const deadline = new Date(o.deadline);
        return isWithinInterval(deadline, { start: weekStart, end: weekEnd }) && activeStatuses.includes(o.status);
      }).length,
      overdue: opdrachten.filter(o => {
        if (!o.deadline || o.status === 'Afgerond' || o.status === 'Ingediend') return false;
        return isPast(new Date(o.deadline));
      }).length,
      awaitingApproval: opdrachten.filter(o => o.status === 'Gereed voor controle').length,
      completedMonth: opdrachten.filter(o => {
        if (o.status !== 'Afgerond' || !o.afgerond_datum) return false;
        const completed = new Date(o.afgerond_datum);
        return isWithinInterval(completed, { start: monthStart, end: monthEnd });
      }).length,
    };
  }, [opdrachten]);
  
  // Filter assignments
  const filteredOpdrachten = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const activeStatuses = ['Intake', 'In behandeling', 'Wacht op klant', 'Gereed voor controle'];
    
    return opdrachten.filter((opdracht) => {
      // Special stat filters
      if (filterStatus === 'deadline-week') {
        if (!opdracht.deadline) return false;
        const deadline = new Date(opdracht.deadline);
        return isWithinInterval(deadline, { start: weekStart, end: weekEnd }) && activeStatuses.includes(opdracht.status);
      }
      if (filterStatus === 'overdue') {
        if (!opdracht.deadline || opdracht.status === 'Afgerond' || opdracht.status === 'Ingediend') return false;
        return isPast(new Date(opdracht.deadline));
      }
      
      // Regular status filter
      if (filterStatus !== 'all' && filterStatus !== 'deadline-week' && filterStatus !== 'overdue' && opdracht.status !== filterStatus) return false;
      if (filterType !== 'all' && opdracht.type_opdracht !== filterType) return false;
      if (filterVerantwoordelijke !== 'all' && opdracht.verantwoordelijk !== filterVerantwoordelijke) return false;
      if (filterInvoice !== 'all' && opdracht.facturatie_status !== filterInvoice) return false;
      if ((isMyAssignmentsPage || onlyMine) && authUser?.id && !opdracht.user_ids?.includes(authUser.id)) return false;
      if (searchClient && !opdracht.klant_naam.toLowerCase().includes(searchClient.toLowerCase())) return false;
      return true;
    });
  }, [opdrachten, filterStatus, filterType, filterVerantwoordelijke, filterInvoice, onlyMine, isMyAssignmentsPage, authUser, searchClient]);
  
  // Group by client for byClient view
  const groupedByClient = useMemo(() => {
    const groups: Record<string, typeof filteredOpdrachten> = {};
    filteredOpdrachten.forEach((o) => {
      if (!groups[o.klant_naam]) {
        groups[o.klant_naam] = [];
      }
      groups[o.klant_naam].push(o);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredOpdrachten]);
  
  const getStatusBadgeClass = (status: string) => {
    const classes: Record<string, string> = {
      'Intake': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'In behandeling': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      'Wacht op klant': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Gereed voor controle': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Afgerond': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Ingediend': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="bg-background min-h-screen -m-6 -mb-16 lg:-mb-6">
      <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isMyAssignmentsPage ? t('assignments.myAssignments') : t('assignments.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredOpdrachten.length} {filteredOpdrachten.length === 1 ? t('assignments.count', { count: filteredOpdrachten.length }) : t('assignments.count_plural', { count: filteredOpdrachten.length })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/app/projects/bulk-import">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              {t('assignments.bulkBTW')}
            </Button>
          </Link>
          <Button className="bg-ka-green hover:bg-ka-green/90" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('assignments.newAssignment')}
          </Button>
        </div>
      </div>
      
      {/* Stats Row - Clickable for filtering */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-ka-navy/50"
          onClick={() => setFilterStatus('all')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ka-navy/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-ka-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalActive}</p>
              <p className="text-xs text-muted-foreground">{t('assignments.stats.totalActive')}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-orange-500/50"
          onClick={() => setFilterStatus('deadline-week')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.deadlineThisWeek}</p>
              <p className="text-xs text-muted-foreground">{t('assignments.stats.deadlineThisWeek')}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-red-500/50"
          onClick={() => setFilterStatus('overdue')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">{t('assignments.stats.overdue')}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-4 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-500/50"
          onClick={() => setFilterStatus('Gereed voor controle')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.awaitingApproval}</p>
              <p className="text-xs text-muted-foreground">{t('assignments.stats.awaitingApproval')}</p>
            </div>
          </div>
        </Card>
        
        <Card 
          className="p-4 col-span-2 sm:col-span-1 cursor-pointer hover:shadow-md transition-shadow hover:border-ka-green/50"
          onClick={() => setFilterStatus('Afgerond')}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-ka-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ka-green">{stats.completedMonth}</p>
              <p className="text-xs text-muted-foreground">{t('assignments.stats.completedMonth')}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* View Toggle & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="w-full lg:w-auto">
          <TabsList className="grid grid-cols-4 w-full lg:w-auto">
            <TabsTrigger value="list" className="flex items-center gap-1">
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{t('assignments.views.list')}</span>
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-1">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{t('assignments.views.kanban')}</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">{t('assignments.views.calendar')}</span>
            </TabsTrigger>
            <TabsTrigger value="byClient" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{t('assignments.views.byClient')}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('assignments.filters.searchClient')}
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t('assignments.filters.allStatuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('assignments.filters.allStatuses')}</SelectItem>
              <SelectItem value="Intake">{t('assignments.status.intake')}</SelectItem>
              <SelectItem value="In behandeling">{t('assignments.status.inProgress')}</SelectItem>
              <SelectItem value="Wacht op klant">{t('assignments.status.waitingClient')}</SelectItem>
              <SelectItem value="Gereed voor controle">{t('assignments.status.readyForReview')}</SelectItem>
              <SelectItem value="Afgerond">{t('assignments.status.completed')}</SelectItem>
              <SelectItem value="Ingediend">{t('assignments.status.submitted')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('assignments.filters.allTypes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('assignments.filters.allTypes')}</SelectItem>
              {assignmentTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterVerantwoordelijke} onValueChange={setFilterVerantwoordelijke}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('assignments.filters.allResponsible')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('assignments.filters.allResponsible')}</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {!isMyAssignmentsPage && (
            <div className="flex items-center gap-2">
              <Switch id="onlyMine" checked={onlyMine} onCheckedChange={setOnlyMine} />
              <Label htmlFor="onlyMine" className="text-sm whitespace-nowrap">
                {t('assignments.filters.onlyMine')}
              </Label>
            </div>
          )}
        </div>
      </div>

      <CreateOpdrachtDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      
      {/* Content based on view mode */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : viewMode === 'kanban' ? (
        <AssignmentsKanban
          filterType={filterType}
          filterVerantwoordelijke={filterVerantwoordelijke}
          onlyMine={onlyMine}
          currentUserId={authUser?.id}
        />
      ) : viewMode === 'calendar' ? (
        <AssignmentsCalendar
          filterType={filterType}
          filterVerantwoordelijke={filterVerantwoordelijke}
          onlyMine={onlyMine}
          currentUserId={authUser?.id}
        />
      ) : viewMode === 'byClient' ? (
        <div className="space-y-6">
          {groupedByClient.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t('common.labels.no_results')}
            </div>
          ) : (
            groupedByClient.map(([clientName, clientOpdrachten]) => (
              <Card key={clientName} className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-ka-navy" />
                  <h3 className="font-semibold text-foreground">{clientName}</h3>
                  <Badge variant="secondary">{clientOpdrachten.length}</Badge>
                </div>
                <div className="space-y-2">
                  {clientOpdrachten.map((opdracht) => (
                    <Link key={opdracht.id} to={`/app/assignments/${opdracht.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <OpdrachtTypeBadge type={opdracht.type_opdracht} />
                          <span className="font-medium text-foreground">{opdracht.opdracht_naam}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {opdracht.deadline && <DeadlineIndicator deadline={opdracht.deadline} />}
                          <Badge variant="outline" className={getStatusBadgeClass(opdracht.status)}>
                            {opdracht.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* List View (default) */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('assignments.table.assignment')}</TableHead>
                <TableHead>{t('assignments.table.client')}</TableHead>
                <TableHead>{t('assignments.table.type')}</TableHead>
                <TableHead>{t('assignments.table.status')}</TableHead>
                <TableHead>{t('assignments.table.deadline')}</TableHead>
                <TableHead>{t('assignments.table.responsible')}</TableHead>
                <TableHead className="w-[120px]">{t('assignments.table.progress')}</TableHead>
                <TableHead>{t('assignments.table.hours')}</TableHead>
                <TableHead>{t('assignments.table.invoice')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpdrachten.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {t('common.labels.no_results')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOpdrachten.map((opdracht) => (
                  <TableRow key={opdracht.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link to={`/app/assignments/${opdracht.id}`} className="hover:underline">
                        <div>
                          <p className="font-medium text-foreground">{opdracht.opdracht_nummer}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{opdracht.opdracht_naam}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/app/clients/${opdracht.klant_id}`} className="text-sm hover:underline text-foreground">
                        {opdracht.klant_naam}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <OpdrachtTypeBadge type={opdracht.type_opdracht} showIcon={false} className="text-xs" />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs', getStatusBadgeClass(opdracht.status))}>
                        {opdracht.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {opdracht.deadline && <DeadlineIndicator deadline={opdracht.deadline} />}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-ka-navy text-white">
                            {opdracht.verantwoordelijk?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{opdracht.verantwoordelijk}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {opdracht.voortgang_percentage !== undefined && (
                        <AssignmentProgressBar percentage={opdracht.voortgang_percentage} showLabel />
                      )}
                    </TableCell>
                    <TableCell>
                      {opdracht.bestede_uren !== undefined && opdracht.budget_uren !== undefined && (
                        <span className="text-sm text-muted-foreground">
                          {t('assignments.hoursFormat', { spent: opdracht.bestede_uren, budget: opdracht.budget_uren })}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {opdracht.facturatie_status && (
                        <FacturatieStatusBadge status={opdracht.facturatie_status as FacturatieStatus} className="text-xs" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      </div>
    </div>
  );
}
