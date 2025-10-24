import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  FileText,
  CheckSquare,
  ChevronDown,
  Home,
  MessageSquare,
  BarChart3,
  Settings,
  CheckCircle,
  Calendar,
  KanbanSquare,
  Clock,
  DollarSign,
  UserCircle,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useRole } from '@/hooks/useRole';

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { isAdmin } = useRole();
  const currentPath = location.pathname;
  
  const collapsed = state === 'collapsed';

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    klanten: false,
    projecten: false,
    opdrachten: false,
    taken: false,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (paths: string[]) => paths.some(path => currentPath.startsWith(path));

  const getNavCls = (active: boolean) =>
    active ? 'bg-ka-green/20 text-ka-navy dark:text-ka-green font-medium' : 'hover:bg-muted/50';

  return (
    <Sidebar collapsible="icon"  className={collapsed ? 'w-16' : 'w-64'}>
      <SidebarContent>
        {/* Hoofdmenu */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigatie</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end className={getNavCls(isActive('/'))}>
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Inbox */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/unified-inbox" className={getNavCls(isActive('/unified-inbox'))}>
                    <MessageSquare className="h-4 w-4" />
                    {!collapsed && <span>Inbox</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Klanten met submenu */}
              <Collapsible
                open={openGroups.klanten || isGroupActive(['/clients'])}
                onOpenChange={() => toggleGroup('klanten')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/clients']))}>
                      <Users className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>Klanten</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/clients" className={getNavCls(isActive('/clients'))}>
                              Alle klanten
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/clients/my-clients" className={getNavCls(isActive('/clients/my-clients'))}>
                              <UserCircle className="h-3 w-3 mr-1" />
                              Mijn klanten
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Projecten met submenu */}
              <Collapsible
                open={openGroups.projecten || isGroupActive(['/projects'])}
                onOpenChange={() => toggleGroup('projecten')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/projects']))}>
                      <FolderKanban className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>Projecten</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/projects" className={getNavCls(isActive('/projects'))}>
                              Alle projecten
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/projects/my-projects" className={getNavCls(isActive('/projects/my-projects'))}>
                              <UserCircle className="h-3 w-3 mr-1" />
                              Mijn projecten
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/projects/calendar" className={getNavCls(isActive('/projects/calendar'))}>
                              <Calendar className="h-3 w-3 mr-1" />
                              Kalender
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/projects/kanban" className={getNavCls(isActive('/projects/kanban'))}>
                              <KanbanSquare className="h-3 w-3 mr-1" />
                              Kanban
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/projects/bulk" className={getNavCls(isActive('/projects/bulk'))}>
                              Bulk projecten
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/projects/team-workload" className={getNavCls(isActive('/projects/team-workload'))}>
                              <Clock className="h-3 w-3 mr-1" />
                              Team workload
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Opdrachten met submenu */}
              <Collapsible
                open={openGroups.opdrachten || isGroupActive(['/opdrachten', '/assignments'])}
                onOpenChange={() => toggleGroup('opdrachten')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/opdrachten', '/assignments']))}>
                      <FileText className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>Opdrachten</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/opdrachten" className={getNavCls(isActive('/opdrachten'))}>
                              Alle opdrachten
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/opdrachten/my-assignments" className={getNavCls(isActive('/opdrachten/my-assignments'))}>
                              <UserCircle className="h-3 w-3 mr-1" />
                              Mijn opdrachten
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        {isAdmin && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink 
                                to="/opdrachten/awaiting-approval" 
                                className={getNavCls(isActive('/opdrachten/awaiting-approval'))}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Wacht op goedkeuring
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Taken met submenu */}
              <Collapsible
                open={openGroups.taken || isGroupActive(['/taken', '/tasks'])}
                onOpenChange={() => toggleGroup('taken')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/taken', '/tasks']))}>
                      <CheckSquare className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>Taken</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/taken" className={getNavCls(isActive('/taken'))}>
                              Alle taken
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/taken/my-tasks" className={getNavCls(isActive('/taken/my-tasks'))}>
                              <UserCircle className="h-3 w-3 mr-1" />
                              Mijn taken
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/taken/team-tasks" className={getNavCls(isActive('/taken/team-tasks'))}>
                              <Users className="h-3 w-3 mr-1" />
                              Team taken
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        {isAdmin && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink 
                                to="/taken/awaiting-approval" 
                                className={getNavCls(isActive('/taken/awaiting-approval'))}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Te beoordelen
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management (alleen Harm-Jan) */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/analytics" className={getNavCls(isActive('/analytics'))}>
                      <BarChart3 className="h-4 w-4" />
                      {!collapsed && <span>Rapportages</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/clients/late-payers" className={getNavCls(isActive('/clients/late-payers'))}>
                      <DollarSign className="h-4 w-4" />
                      {!collapsed && <span>Late betalers</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/settings" className={getNavCls(isActive('/settings'))}>
                      <Settings className="h-4 w-4" />
                      {!collapsed && <span>Instellingen</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
