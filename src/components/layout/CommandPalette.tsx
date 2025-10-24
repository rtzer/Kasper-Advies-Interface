import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { isAdmin } = useRole(); // Harm-Jan check

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type een commando of zoek..." />
      <CommandList>
        <CommandEmpty>Geen resultaten gevonden.</CommandEmpty>

        {/* Navigatie - Voor iedereen */}
        <CommandGroup heading="Navigatie">
          <CommandItem onSelect={() => runCommand(() => navigate('/clients'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Klanten</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/projects'))}>
            <FolderKanban className="mr-2 h-4 w-4" />
            <span>Projecten</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/assignments'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Opdrachten</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/tasks'))}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Taken</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Acties - Voor iedereen */}
        <CommandGroup heading="Acties">
          <CommandItem onSelect={() => runCommand(() => navigate('/clients?action=new'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nieuwe klant</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/projects?action=new'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nieuw project</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/assignments?action=new'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nieuwe opdracht</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/tasks?action=new'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nieuwe taak</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Zoek gesprekken</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/tasks'))}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Tijd registreren</span>
          </CommandItem>
        </CommandGroup>

        {/* Harm-Jan only commands */}
        {isAdmin && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Management (Harm-Jan)">
              <CommandItem onSelect={() => runCommand(() => navigate('/assignments/pending'))}>
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Opdrachten goedkeuren</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/tasks/review'))}>
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Taken goedkeuren</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/analytics'))}>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Financiële rapportages</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/projects/workload'))}>
                <Users className="mr-2 h-4 w-4" />
                <span>Team workload</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/clients?filter=late-betaling'))}>
                <DollarSign className="mr-2 h-4 w-4" />
                <span>Late betalers</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Instellingen</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        
        {/* Snelkoppelingen */}
        <CommandGroup heading="Sneltoetsen">
          <CommandItem disabled>
            <span className="text-xs text-muted-foreground">
              ⌘K / Ctrl+K: Command palette
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
