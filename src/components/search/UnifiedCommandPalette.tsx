import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Users,
  FolderKanban,
  FileText,
  CheckSquare,
  Plus,
  Search,
  Clock,
  Settings,
  BarChart3,
  CheckCircle,
  DollarSign,
  Building2,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { useDebounce } from '@/hooks/useDebounce';
import { useKlanten } from '@/lib/api/klanten';
import { useInteracties } from '@/lib/api/interacties';
import { useOpdrachten } from '@/lib/api/opdrachten';
import { Badge } from '@/components/ui/badge';

interface UnifiedCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  type: 'Klant' | 'Interactie' | 'Opdracht';
  id: string;
  name: string;
  description: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function UnifiedCommandPalette({ open, onOpenChange }: UnifiedCommandPaletteProps) {
  const navigate = useNavigate();
  const { t } = useTranslation(['common']);
  const { isAdmin } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const { data: klanten } = useKlanten();
  const { data: interacties } = useInteracties();
  const { data: opdrachten } = useOpdrachten();

  // Keyboard shortcut: Cmd+K or Ctrl+K or /
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === '/' && !open) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  // Perform search when query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, klanten, interacties, opdrachten]);

  const performSearch = (query: string) => {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Check for @ filters
    const filterMatch = query.match(/^@(\w+)\s+(.+)/);
    const filterType = filterMatch?.[1];
    const filterQuery = filterMatch?.[2]?.toLowerCase() || lowerQuery;

    // Search klanten
    if (!filterType || filterType === 'klant' || filterType === 'client') {
      klanten?.results.slice(0, 5).forEach((klant) => {
        if (
          klant.naam.toLowerCase().includes(filterQuery) ||
          klant.klant_nummer.toLowerCase().includes(filterQuery) ||
          klant.plaats?.toLowerCase().includes(filterQuery)
        ) {
          results.push({
            type: 'Klant',
            id: klant.id,
            name: klant.naam,
            description: `${klant.klant_nummer} • ${klant.plaats || 'Geen plaats'}`,
            url: `/app/clients/${klant.id}`,
            icon: Users,
          });
        }
      });
    }

    // Search opdrachten
    if (!filterType || filterType === 'opdracht' || filterType === 'assignment') {
      opdrachten?.results.slice(0, 5).forEach((opr) => {
        if (
          opr.opdracht_naam.toLowerCase().includes(filterQuery) ||
          opr.klant_naam.toLowerCase().includes(filterQuery)
        ) {
          results.push({
            type: 'Opdracht',
            id: opr.id,
            name: opr.opdracht_naam,
            description: `${opr.klant_naam} • ${opr.status}`,
            url: `/app/assignments/${opr.id}`,
            icon: FileText,
          });
        }
      });
    }

    // Search interacties
    if (!filterType || filterType === 'interactie' || filterType === 'interaction') {
      interacties?.results.slice(0, 5).forEach((int) => {
        if (
          int.onderwerp.toLowerCase().includes(filterQuery) ||
          int.samenvatting?.toLowerCase().includes(filterQuery) ||
          int.klant_naam.toLowerCase().includes(filterQuery)
        ) {
          results.push({
            type: 'Interactie',
            id: int.id,
            name: int.onderwerp,
            description: `${int.klant_naam} • ${int.kanaal}`,
            url: `/app/clients/${int.klant_id}`,
            icon: MessageSquare,
          });
        }
      });
    }

    setSearchResults(results.slice(0, 10));
  };

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    setSearchQuery('');
    setSearchResults([]);
    command();
  };

  const showSearchResults = searchResults.length > 0;
  const showNavigation = !searchQuery || searchQuery.length < 2;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder={t('common:actions.search') + ' or type a command...'} 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          {searchQuery.length >= 2 ? 'No results found.' : 'Type to search or select a command...'}
        </CommandEmpty>

        {/* Search Results */}
        {showSearchResults && (
          <>
            <CommandGroup heading="Search Results">
              {searchResults.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => runCommand(() => navigate(result.url))}
                >
                  <result.icon className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{result.name}</div>
                    <div className="text-xs text-muted-foreground">{result.description}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs ml-2">
                    {result.type}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation - Show when not searching or search is short */}
        {showNavigation && (
          <>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => runCommand(() => navigate('/app/inbox'))}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Inbox</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/clients'))}>
                <Users className="mr-2 h-4 w-4" />
                <span>Klanten</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/projects'))}>
                <FolderKanban className="mr-2 h-4 w-4" />
                <span>Projecten</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/assignments'))}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Opdrachten</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/tasks'))}>
                <CheckSquare className="mr-2 h-4 w-4" />
                <span>Taken</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/analytics'))}>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/settings'))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Instellingen</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            {/* Quick Actions */}
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => runCommand(() => navigate('/app/clients?action=new'))}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Nieuwe klant</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/projects?action=new'))}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Nieuw project</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/assignments?action=new'))}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Nieuwe opdracht</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/tasks?action=new'))}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Nieuwe taak</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/app/tasks'))}>
                <Clock className="mr-2 h-4 w-4" />
                <span>Tijd registreren</span>
              </CommandItem>
            </CommandGroup>

            {/* Admin commands */}
            {isAdmin && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Management (Harm-Jan)">
                  <CommandItem onSelect={() => runCommand(() => navigate('/app/assignments/pending-approval'))}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Opdrachten goedkeuren</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => navigate('/app/tasks/review'))}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Taken goedkeuren</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => navigate('/app/projects/workload'))}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Team workload</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => navigate('/app/clients/late-payers'))}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Late betalers</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}

            <CommandSeparator />

            {/* Shortcuts hint */}
            <CommandGroup heading="Tips">
              <CommandItem disabled>
                <span className="text-xs text-muted-foreground">
                  Use @ to filter: @klant, @opdracht, @interactie
                </span>
              </CommandItem>
              <CommandItem disabled>
                <span className="text-xs text-muted-foreground">
                  ⌘K / Ctrl+K or / to open this palette
                </span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
