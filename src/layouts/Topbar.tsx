import { useTranslation } from 'react-i18next';
import { Search, Bell, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { t, i18n } = useTranslation(['common']);
  
  const changeLanguage = (lang: 'nl' | 'en') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-ka-gray-200 dark:border-gray-700 flex items-center px-6 justify-between">
      <div className="flex items-center space-x-4 flex-1">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ka-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder={t('common:actions.search') + ' klanten, gesprekken...'}
            className="pl-10 bg-ka-gray-50 dark:bg-gray-700 border-ka-gray-200 dark:border-gray-600 focus:ring-ka-green focus:border-ka-green"
          />
        </div>
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
            <DropdownMenuItem className="cursor-pointer">Nieuwe conversatie</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Nieuwe klant</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Nieuwe opdracht</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Nieuwe taak</DropdownMenuItem>
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
            <DropdownMenuItem onClick={() => changeLanguage('nl')} className="cursor-pointer">
              <span className="mr-2">🇳🇱</span> Nederlands
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
              <span className="mr-2">🇬🇧</span> English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-ka-gray-600 dark:text-gray-300" />
          <Badge className="absolute -top-1 -right-1 bg-red-600 text-white px-1.5 py-0.5 text-xs">
            3
          </Badge>
        </Button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-ka-navy dark:bg-ka-green text-white flex items-center justify-center text-sm font-medium">
                HK
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-ka-gray-900 dark:text-white">Harm-Jan Kaspers</p>
                <p className="text-xs text-ka-gray-500 dark:text-gray-400">Administrator</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-ka-gray-200 dark:border-gray-700 z-50">
            <DropdownMenuItem className="cursor-pointer">Profiel</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Instellingen</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">Uitloggen</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
