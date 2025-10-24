import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import UnifiedCommandPalette from '@/components/search/UnifiedCommandPalette';
import InlineSearch from '@/components/search/InlineSearch';
import Topbar from './Topbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-ka-gray-50 dark:bg-gray-900">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with sidebar trigger and inline search */}
          <header className="h-14 border-b border-ka-gray-200 dark:border-gray-700 flex items-center px-4 bg-white dark:bg-gray-800 sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            
            <div className="flex-1 flex items-center space-x-4">
              <InlineSearch onOpenCommandPalette={() => setCommandOpen(true)} />
            </div>
            
            <Topbar onMenuClick={() => {}} onSearchClick={() => setCommandOpen(true)} />
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 pb-16 lg:pb-6">
            {children}
          </main>
        </div>
        
        <UnifiedCommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </SidebarProvider>
  );
}
