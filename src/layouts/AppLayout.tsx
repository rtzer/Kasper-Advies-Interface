import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import CommandPalette from '@/components/layout/CommandPalette';
import Topbar from './Topbar';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-ka-gray-50 dark:bg-gray-900">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with sidebar trigger and command palette */}
          <header className="h-14 border-b border-ka-gray-200 dark:border-gray-700 flex items-center px-4 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            
            <div className="flex-1 flex items-center space-x-4">
              <Button
                variant="outline"
                className="w-64 justify-start text-muted-foreground"
                onClick={() => setCommandOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Zoek of typ "/" voor commando's...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
            
            <Topbar onMenuClick={() => {}} />
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 pb-16 lg:pb-6">
            {children}
          </main>
        </div>
        
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </SidebarProvider>
  );
}
