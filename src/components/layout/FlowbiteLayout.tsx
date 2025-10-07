import { useState } from "react";
import { FlowbiteSidebar } from "./FlowbiteSidebar";
import { Menu } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FloatingThemeToggle } from "./FloatingThemeToggle";
import { useTranslation } from "react-i18next";

interface FlowbiteLayoutProps {
  children: React.ReactNode;
}

export function FlowbiteLayout({ children }: FlowbiteLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <FlowbiteSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navbar */}
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-20 lg:left-64">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex justify-start items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-xl font-semibold dark:text-white">
                {t('nav.title')}
              </span>
            </div>
            <div className="flex items-center gap-2 lg:order-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="pt-16 h-screen overflow-hidden">
          {children}
        </main>
      </div>

      {/* Floating Theme Toggle */}
      <FloatingThemeToggle />
    </div>
  );
}
