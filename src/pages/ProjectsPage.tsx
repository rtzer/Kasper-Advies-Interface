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
import { responsiveHeading, responsiveBody } from '@/lib/utils/typography';
import { useDeviceChecks } from '@/hooks/useBreakpoint';

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
  
  const { isMobile } = useDeviceChecks();

  return (
    <div className="px-3 xs:px-4 sm:px-6 py-4 xs:py-5 sm:py-6 max-w-screen-2xl mx-auto">
      {/* Header - Optimized for 360px */}
      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h1 className={`${responsiveHeading.h2} truncate`}>
            Projecten & Workflows
          </h1>
          <p className={`${responsiveBody.small} mt-0.5 xs:mt-1 truncate`}>
            Beheer klantprojecten en terugkerende workflows
          </p>
        </div>

        {/* Action buttons - Horizontal scroll on mobile */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <Link to="/clients/late-payers" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="h-8 xs:h-9 text-xs xs:text-sm whitespace-nowrap px-2 xs:px-3">
              <AlertCircle className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5 text-yellow-600" />
              <span className="hidden xs:inline">Late Klanten</span>
            </Button>
          </Link>
          <Link to="/projects/workload" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="h-8 xs:h-9 text-xs xs:text-sm whitespace-nowrap px-2 xs:px-3">
              <Users className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
              <span className="hidden xs:inline">Workload</span>
            </Button>
          </Link>
          <Link to="/projects/bulk" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="h-8 xs:h-9 text-xs xs:text-sm whitespace-nowrap px-2 xs:px-3">
              <Zap className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
              <span className="hidden sm:inline">Bulk BTW</span>
              <span className="sm:hidden">Bulk</span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilterDialogOpen(true)}
            className="h-8 xs:h-9 text-xs xs:text-sm whitespace-nowrap px-2 xs:px-3 flex-shrink-0"
          >
            <Filter className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
            <span className="hidden xs:inline">Filters</span>
          </Button>
          <div className="flex-shrink-0">
            <CreateProjectDialog />
          </div>
        </div>
      </div>

      <ProjectFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ProjectsStats />

      {/* View Switcher + Filters - Optimized for 360px */}
      <div className="flex flex-col gap-2.5 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6">
        {/* View Switcher - Full width on mobile */}
        <div className="flex gap-1.5 xs:gap-2">
          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            onClick={() => setView('kanban')}
            size="sm"
            className="flex-1 h-8 xs:h-9 text-xs xs:text-sm"
          >
            <LayoutGrid className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
            <span className="hidden xs:inline">Kanban</span>
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
            size="sm"
            className="flex-1 h-8 xs:h-9 text-xs xs:text-sm"
          >
            <List className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
            <span className="hidden xs:inline">Lijst</span>
          </Button>
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            onClick={() => setView('calendar')}
            size="sm"
            className="flex-1 h-8 xs:h-9 text-xs xs:text-sm"
          >
            <Calendar className="w-3 h-3 xs:w-4 xs:h-4 xs:mr-1.5" />
            <span className="hidden xs:inline">Kalender</span>
          </Button>
        </div>

        {/* Filters - Stacked on mobile */}
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 px-2.5 xs:px-3 py-1.5 xs:py-2 border rounded-lg text-xs xs:text-sm bg-background h-8 xs:h-9"
          >
            <option value="all">{isMobile ? 'Categorie' : 'Alle categorieën'}</option>
            <option value="btw">BTW Aangiftes</option>
            <option value="hypotheek">Hypotheken</option>
            <option value="jaarrekening">Jaarrekeningen</option>
            <option value="advies">Advies</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 px-2.5 xs:px-3 py-1.5 xs:py-2 border rounded-lg text-xs xs:text-sm bg-background h-8 xs:h-9"
          >
            <option value="all">{isMobile ? 'Status' : 'Alle statussen'}</option>
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
