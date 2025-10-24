import { useState } from 'react';
import { Filter, Calendar, LayoutGrid, List, Zap, AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ProjectFilterDialog } from '@/components/projects/ProjectFilterDialog';
import ProjectsKanban from '@/components/projects/ProjectsKanban';
import ProjectsList from '@/components/projects/ProjectsList';
import ProjectsCalendar from '@/components/projects/ProjectsCalendar';
import ProjectsStats from '@/components/projects/ProjectsStats';
import CreateProjectDialog from '@/components/projects/CreateProjectDialog';

export default function ProjectsPage() {
  const [view, setView] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
  });

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Projecten & Workflows
          </h1>
          <p className="text-muted-foreground mt-1">
            Beheer klantprojecten en terugkerende workflows
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/clients/late-payers">
            <Button variant="outline" size="sm">
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
              Late Klanten
            </Button>
          </Link>
          <Link to="/projects/workload">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Team Workload
            </Button>
          </Link>
          <Link to="/projects/bulk">
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Bulk BTW
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <CreateProjectDialog />
        </div>
      </div>

      <ProjectFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ProjectsStats />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex space-x-2">
          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            onClick={() => setView('kanban')}
            size="sm"
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
            size="sm"
          >
            <List className="w-4 h-4 mr-2" />
            Lijst
          </Button>
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            onClick={() => setView('calendar')}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Kalender
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-background"
          >
            <option value="all">Alle categorieën</option>
            <option value="btw">BTW Aangiftes</option>
            <option value="hypotheek">Hypotheken</option>
            <option value="jaarrekening">Jaarrekeningen</option>
            <option value="advies">Advies</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-background"
          >
            <option value="all">Alle statussen</option>
            <option value="niet-gestart">Niet gestart</option>
            <option value="in-uitvoering">In uitvoering</option>
            <option value="wacht-op-klant">Wacht op klant</option>
            <option value="geblokkeerd">Geblokkeerd</option>
            <option value="afgerond">Afgerond</option>
          </select>
        </div>
      </div>

      {view === 'kanban' && (
        <ProjectsKanban
          filterStatus={filterStatus}
          filterCategory={filterCategory}
        />
      )}
      {view === 'list' && (
        <ProjectsList
          filterStatus={filterStatus}
          filterCategory={filterCategory}
        />
      )}
      {view === 'calendar' && (
        <ProjectsCalendar
          filterStatus={filterStatus}
          filterCategory={filterCategory}
        />
      )}
    </div>
  );
}
