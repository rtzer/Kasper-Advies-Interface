import { useTranslation } from 'react-i18next';
import { Menu, Globe, LogOut, User as UserIcon, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import { useAuth } from '@/contexts/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
  onSearchClick?: () => void;
}

export default function Topbar({ onMenuClick, onSearchClick }: TopbarProps) {
  const { t, i18n } = useTranslation(['common']);
  const { user, logout } = useAuth();
  
  const changeLanguage = (lang: 'nl' | 'en') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  return (
    <>
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Mobile search button - optional extra trigger */}
        {onSearchClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            className="md:hidden"
            title="Search (Cmd+K or /)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Quick Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-ka-gray-200 dark:border-gray-600">
              <span className="text-sm">{t('common:actions.new')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-ka-gray-200 dark:border-gray-700 z-50">
            <DropdownMenuItem className="cursor-pointer">{t('common:quickActions.newConversation')}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">{t('common:quickActions.newClient')}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">{t('common:quickActions.newAssignment')}</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">{t('common:quickActions.newTask')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Theme Switcher */}
        <ThemeSwitcher />
        
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5 text-ka-gray-600 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-ka-gray-200 dark:border-gray-700 z-50">
            <DropdownMenuItem 
              onClick={() => changeLanguage('nl')} 
              className={`cursor-pointer ${
                i18n.language === 'nl' 
                  ? 'bg-ka-green/10 border-2 border-ka-green font-semibold text-ka-navy dark:text-white dark:bg-ka-green/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">🇳🇱</span> Nederlands
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => changeLanguage('en')} 
              className={`cursor-pointer ${
                i18n.language === 'en' 
                  ? 'bg-ka-green/10 border-2 border-ka-green font-semibold text-ka-navy dark:text-white dark:bg-ka-green/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">🇬🇧</span> English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications */}
        <NotificationPanel />
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-ka-navy dark:bg-ka-green text-white flex items-center justify-center text-sm font-medium">
                {user?.full_name?.substring(0, 2).toUpperCase() || 'HK'}
              </div>
              <div className="hidden md:block text-left">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-ka-gray-900 dark:text-white">
                    {user?.full_name || 'Gebruiker'}
                  </p>
                  {user?.role === 'admin' && (
                    <Badge variant="secondary" className="text-xs py-0 px-1.5">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-ka-gray-200 dark:border-gray-700 z-50">
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="w-4 h-4 mr-2" />
              {t('common:user.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              {t('common:user.settings')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 dark:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              {t('common:user.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
