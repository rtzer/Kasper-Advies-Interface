import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateTime } from '@/lib/utils/dateHelpers';
import { useUserStore } from '@/store/userStore';

interface Notification {
  id: string;
  type: 'new_message' | 'task_assigned' | 'deadline_approaching' | 'mention';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationPanel() {
  const { currentUser } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'new_message',
      title: 'Nieuw bericht van Rosemary Braun',
      description: 'Vraag over factuur #12345',
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'task_assigned',
      title: 'Nieuwe taak toegewezen',
      description: 'Offerte opstellen voor Tech Solutions BV',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      read: false,
    },
    {
      id: '3',
      type: 'deadline_approaching',
      title: 'Deadline nadert',
      description: 'Project voor Acme Corp over 2 dagen',
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      read: true,
    },
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-destructive text-white px-1.5 py-0.5 text-xs min-w-[1.25rem] h-5 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="p-4 border-b border-ka-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-ka-navy dark:text-white">Notificaties</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="h-8"
            >
              <Check className="w-4 h-4 mr-2" />
              Alles gelezen
            </Button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-ka-gray-500 dark:text-gray-400">
              Geen notificaties
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`w-full p-4 border-b border-ka-gray-200 dark:border-gray-700 hover:bg-ka-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${
                  !notif.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`text-sm font-medium text-ka-navy dark:text-white ${
                    !notif.read ? 'font-semibold' : ''
                  }`}>
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-ka-green rounded-full mt-1 ml-2 flex-shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-ka-gray-600 dark:text-gray-400 mb-1">{notif.description}</p>
                <span className="text-xs text-ka-gray-500 dark:text-gray-500">
                  {formatDateTime(notif.timestamp, currentUser?.language || 'nl')}
                </span>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
