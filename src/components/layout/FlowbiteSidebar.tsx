import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Inbox, 
  BarChart3, 
  Settings, 
  MessageSquare, 
  Mail, 
  Phone, 
  Video, 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

const mainRoutes = [
  { title: "Home", url: "/", icon: Home },
  { title: "Unified Inbox", url: "/unified-inbox", icon: Inbox, badge: 8 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Instellingen", url: "/settings", icon: Settings },
];

const channelRoutes = [
  { title: "WhatsApp", url: "/channels/whatsapp", icon: MessageSquare, badge: 3 },
  { title: "Email", url: "/channels/email", icon: Mail, badge: 2 },
  { title: "SMS", url: "/channels/sms", icon: MessageCircle, badge: 1 },
  { title: "Telefoon", url: "/channels/phone", icon: Phone },
  { title: "Video", url: "/channels/video", icon: Video },
  { title: "Facebook", url: "/channels/facebook", icon: Facebook, badge: 5 },
  { title: "Instagram", url: "/channels/instagram", icon: Instagram, badge: 2 },
  { title: "LinkedIn", url: "/channels/linkedin", icon: Linkedin },
];

interface FlowbiteSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FlowbiteSidebar({ isOpen, onToggle }: FlowbiteSidebarProps) {
  const [channelsOpen, setChannelsOpen] = useState(true);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900/50 dark:bg-gray-900/90 lg:hidden"
          onClick={onToggle}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between mb-5 px-3">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Communication Hub
            </span>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <ul className="space-y-2 font-medium">
            {mainRoutes.map((route) => (
              <li key={route.url}>
                <NavLink
                  to={route.url}
                  end={route.url === "/"}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg group ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <route.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3 flex-1">{route.title}</span>
                  {route.badge && (
                    <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-white bg-blue-600 rounded-full">
                      {route.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            {/* Channels Dropdown */}
            <button
              type="button"
              onClick={() => setChannelsOpen(!channelsOpen)}
              className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="flex-1 ms-3 text-left">Kanalen</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  channelsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Channels List */}
            <ul className={`${channelsOpen ? 'block' : 'hidden'} space-y-2 ps-6`}>
              {channelRoutes.map((route) => (
                <li key={route.url}>
                  <NavLink
                    to={route.url}
                    className={({ isActive }) =>
                      `flex items-center p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                        isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`
                    }
                  >
                    <route.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="ms-3 flex-1">{route.title}</span>
                    {route.badge && (
                      <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                        {route.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
