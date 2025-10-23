import { useTranslation } from 'react-i18next';
import { Home, Inbox, Users, CheckSquare, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const { t } = useTranslation(['navigation']);
  
  const tabs = [
    { icon: Home, label: t('navigation:menu.dashboard'), href: '/', badge: null },
    { icon: Inbox, label: t('navigation:menu.inbox'), href: '/inbox', badge: 8 },
    { icon: Users, label: t('navigation:menu.clients'), href: '/clients', badge: null },
    { icon: CheckSquare, label: t('navigation:menu.tasks'), href: '/tasks', badge: null },
    { icon: Menu, label: 'Meer', href: '/settings', badge: null },
  ];
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-ka-gray-200 dark:border-gray-700 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.href}
              to={tab.href}
              className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors relative ${
                isActive 
                  ? 'text-ka-green' 
                  : 'text-ka-gray-600 dark:text-gray-400 hover:text-ka-navy dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {tab.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-ka-green hover:bg-ka-green text-white border-ka-green px-1.5 py-0 text-xs min-w-[20px] h-[20px] flex items-center justify-center">
                    {tab.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
