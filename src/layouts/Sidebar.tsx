import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Inbox, MessageSquare, Users, FileText, CheckSquare, BarChart3, Settings, FolderKanban, Palette, ChevronDown, UserPlus, InboxIcon, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation(['navigation', 'common']);
  const location = useLocation();

  // Force re-render when language changes
  const currentLanguage = i18n.language;
  
  // Collapsible states
  const [isInboxOpen, setIsInboxOpen] = useState(true);
  const [isOverigeOpen, setIsOverigeOpen] = useState(false);
  
  // Hergeordend: dagelijks gebruik bovenaan
  const mainNavigation = [
    { icon: UserPlus, label: t('navigation:menu.prospects', 'Prospects'), href: '/prospects', badge: 5 },
    { icon: Users, label: t('navigation:menu.clients'), href: '/clients', badge: null },
    { icon: FileText, label: t('navigation:menu.assignments'), href: '/assignments', badge: null },
    { icon: CheckSquare, label: t('navigation:menu.tasks'), href: '/tasks', badge: null },
    { icon: FolderKanban, label: t('navigation:menu.projects', 'Projecten'), href: '/projects', badge: null },
  ];
  
  // Inbox submenu items
  const inboxNavigation = [
    { label: t('navigation:menu.allMessages', 'Alle berichten'), href: '/', badge: 8 },
    { label: t('navigation:menu.inboxReview', 'Review'), href: '/inbox/review', badge: 3 },
  ];
  
  // Secundaire items (minder frequent gebruik)
  const secondaryNavigation = [
    { icon: BarChart3, label: t('navigation:menu.statistics'), href: '/analytics', badge: null },
    { icon: UsersRound, label: t('navigation:menu.team', 'Team'), href: '/settings/team', badge: null },
    { icon: Settings, label: t('navigation:menu.settings'), href: '/settings', badge: null },
  ];
  
  const channels = [
    { name: t('navigation:channels.whatsapp'), count: 3, color: 'text-channel-whatsapp', icon: '📱', href: '/channels/whatsapp' },
    { name: t('navigation:channels.email'), count: 2, color: 'text-channel-email', icon: '✉️', href: '/channels/email' },
    { name: t('navigation:channels.phone'), count: 1, color: 'text-channel-phone', icon: '☎️', href: '/channels/phone' },
    { name: t('navigation:channels.video'), count: 0, color: 'text-channel-video', icon: '🎥', href: '/channels/video' },
    { name: t('navigation:channels.sms'), count: 0, color: 'text-channel-sms', icon: '💬', href: '/channels/sms' },
  ];
  
  // Check if any inbox-related route is active
  const isChannelActive = channels.some(channel => location.pathname === channel.href);
  const isInboxRouteActive = inboxNavigation.some(item => location.pathname === item.href);
  const isInboxActive = location.pathname === '/' || location.pathname.startsWith('/inbox') || isChannelActive || isInboxRouteActive;
  
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-white dark:bg-gray-800 
        border-r border-ka-gray-200 dark:border-gray-700 
        flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-ka-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-ka-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-ka-navy dark:text-white">Kaspers Advies</h1>
              <p className="text-xs text-ka-gray-500 dark:text-gray-400">Communication Hub</p>
            </div>
          </div>
        </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          <h3 className="px-3 pb-2 text-xs font-semibold text-ka-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Dagelijks
          </h3>
          
          {/* Inbox met Kanalen submenu */}
          <Collapsible open={isInboxOpen} onOpenChange={setIsInboxOpen}>
            <div className="space-y-1">
              <CollapsibleTrigger className="w-full">
                <div className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isInboxActive
                    ? 'bg-ka-green/10 text-ka-green dark:bg-ka-green/20' 
                    : 'text-ka-gray-600 dark:text-gray-300 hover:bg-ka-gray-100 dark:hover:bg-gray-700 hover:text-ka-navy dark:hover:text-white'
                }`}>
                  <div className="flex items-center space-x-3">
                    <Inbox className="w-5 h-5" />
                    <span>{t('navigation:menu.inbox')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-ka-green hover:bg-ka-green text-white border-ka-green">8</Badge>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isInboxOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-ka-gray-200 dark:border-gray-700 pl-2">
                  {/* Inbox Submenu Links */}
                  {inboxNavigation.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === '/'}
                      className={({ isActive }) => `flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-ka-green/10 text-ka-green dark:bg-ka-green/20' 
                          : 'text-ka-gray-600 dark:text-gray-300 hover:bg-ka-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="text-xs bg-ka-green/20 text-ka-green px-1.5 py-0.5 rounded-full">{item.badge}</span>
                      )}
                    </NavLink>
                  ))}
                  
                  {/* Channel Links */}
                  {channels.map((channel) => (
                    <NavLink
                      key={channel.name}
                      to={channel.href}
                      className={({ isActive }) => `flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-ka-green/10 text-ka-green dark:bg-ka-green/20' 
                          : 'text-ka-gray-600 dark:text-gray-300 hover:bg-ka-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{channel.icon}</span>
                        <span>{channel.name}</span>
                      </div>
                      {channel.count > 0 && (
                        <span className="text-xs text-ka-gray-500 dark:text-gray-400">{channel.count}</span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
          
          {/* Rest of main navigation */}
          {mainNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-ka-green/10 text-ka-green dark:bg-ka-green/20' 
                    : 'text-ka-gray-600 dark:text-gray-300 hover:bg-ka-gray-100 dark:hover:bg-gray-700 hover:text-ka-navy dark:hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge className="bg-ka-green hover:bg-ka-green text-white border-ka-green">{item.badge}</Badge>
                )}
              </NavLink>
            );
          })}
        </div>
        
        {/* Secondary Navigation - Collapsible */}
        <Collapsible open={isOverigeOpen} onOpenChange={setIsOverigeOpen} className="pt-6">
          <CollapsibleTrigger className="w-full px-3 pb-2 flex items-center justify-between text-xs font-semibold text-ka-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-ka-gray-700 dark:hover:text-gray-300 transition-colors">
            <span>Overige</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOverigeOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) => `flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-ka-green/10 text-ka-green dark:bg-ka-green/20' 
                        : 'text-ka-gray-600 dark:text-gray-300 hover:bg-ka-gray-100 dark:hover:bg-gray-700 hover:text-ka-navy dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </nav>
      </aside>
    </>
  );
}
