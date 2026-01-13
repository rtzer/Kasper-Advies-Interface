import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  UserPlus,
  FolderKanban,
  FileText,
  CheckSquare,
  ChevronDown,
  BarChart3,
  Settings,
  Palette,
  CheckCircle,
  KanbanSquare,
  Clock,
  DollarSign,
  UserCircle,
  AlertCircle,
  Inbox,
  Layers,
} from 'lucide-react';
import { useProspectStats } from '@/lib/api/prospects';
import { useInboxStats } from '@/lib/api/inboxItems';
import { Badge } from '@/components/ui/badge';

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
  const { t } = useTranslation(['navigation', 'common']);
  const { state } = useSidebar();
  const location = useLocation();
  const { isAdmin } = useRole();
  const currentPath = location.pathname;
  
  const collapsed = state === 'collapsed';
  
  // Stats for badges
  const { data: prospectStats } = useProspectStats();
  const { data: inboxStats } = useInboxStats();
  const nieuwProspects = prospectStats?.nieuwDezeWeek ?? 0;
  const nieuwInbox = inboxStats?.nieuw ?? 0;

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (paths: string[]) => paths.some(path => currentPath.startsWith(path));
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => ({
    klanten: false,
    projecten: false,
    opdrachten: false,
    taken: false,
    settings: false,
  }));
  
  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const getNavCls = (active: boolean) =>
    active ? 'bg-ka-green/20 text-ka-navy dark:text-ka-green font-medium' : 'hover:bg-muted/50';

  return (
    <Sidebar collapsible="icon"  className={collapsed ? 'w-16' : 'w-64'}>
      <SidebarContent>
        {/* Hoofdmenu */}
        <SidebarGroup>
          <SidebarGroupLabel>{t('common:common.navigation', 'Navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Inbox */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app/inbox" className={getNavCls(isGroupActive(['/app/inbox']))}>
                    <Inbox className="h-4 w-4" />
                    {!collapsed && <span>{t('navigation:menu.inbox')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Inbox Review */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app/inbox/review" className={`${getNavCls(isActive('/app/inbox/review'))} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Inbox className="h-4 w-4" />
                      {!collapsed && <span>{t('navigation:menu.inboxReview')}</span>}
                    </div>
                    {!collapsed && nieuwInbox > 0 && (
                      <Badge variant="destructive" className={`h-5 px-1.5 text-xs ${nieuwInbox > 5 ? 'animate-pulse' : ''}`}>
                        {nieuwInbox}
                      </Badge>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Klanten met submenu */}
              <Collapsible
                open={openGroups.klanten || isGroupActive(['/app/clients'])}
                onOpenChange={() => toggleGroup('klanten')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/app/clients']))}>
                      <Users className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>{t('navigation:menu.clients')}</span>
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
                            <NavLink to="/app/clients" className={getNavCls(isActive('/app/clients'))}>
                              {t('common:clients.allClients')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/app/clients/mine" className={getNavCls(isActive('/app/clients/mine'))}>
                              <UserCircle className="h-3 w-3 mr-1" />
                              {t('common:clients.myClients')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Prospects (na Klanten) */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app/prospects" className={`${getNavCls(isActive('/app/prospects'))} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      {!collapsed && <span>{t('navigation:menu.prospects')}</span>}
                    </div>
                    {!collapsed && nieuwProspects > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {nieuwProspects}
                      </Badge>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Projecten met submenu */}
              <Collapsible
                open={openGroups.projecten || isGroupActive(['/app/projects'])}
                onOpenChange={() => toggleGroup('projecten')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/app/projects']))}>
                      <FolderKanban className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>{t('navigation:menu.projects')}</span>
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
                            <NavLink to="/app/projects" className={getNavCls(isActive('/app/projects'))}>
                              {t('common:projects.allProjects')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/app/projects/mine" className={getNavCls(isActive('/app/projects/mine'))}>
                              <UserCircle className="h-3 w-3 mr-1" />
                              {t('common:projects.myProjects')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/app/projects/bulk-import" className={getNavCls(isActive('/app/projects/bulk-import'))}>
                              <Layers className="h-3 w-3 mr-1" />
                              {t('common:projects.bulkProjects', 'Bulk projects')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/app/projects/workload" className={getNavCls(isActive('/app/projects/workload'))}>
                              <Clock className="h-3 w-3 mr-1" />
                              {t('common:projects.teamWorkload', 'Team workload')}
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
                open={openGroups.opdrachten || isGroupActive(['/app/assignments'])}
                onOpenChange={() => toggleGroup('opdrachten')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/app/assignments']))}>
                      <FileText className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>{t('navigation:menu.assignments')}</span>
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
                            <NavLink to="/app/assignments" className={getNavCls(isActive('/app/assignments'))}>
                              {t('common:assignments.allAssignments')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/app/assignments/mine" className={getNavCls(isActive('/app/assignments/mine'))}>
                              <UserCircle className="h-3 w-3 mr-1" />
                              {t('common:assignments.myAssignments')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        {isAdmin && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to="/app/assignments/pending-approval"
                                className={getNavCls(isActive('/app/assignments/pending-approval'))}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t('common:assignments.awaitingApproval')}
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/app/assignments/by-type" className={getNavCls(isActive('/app/assignments/by-type'))}>
                              {t('common:assignments.byType', 'By type')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Taken met submenu */}
              <Collapsible
                open={openGroups.taken || isGroupActive(['/app/tasks'])}
                onOpenChange={() => toggleGroup('taken')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/app/tasks']))}>
                      <CheckSquare className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>{t('navigation:menu.tasks')}</span>
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
                            <NavLink to="/app/tasks" className={getNavCls(isActive('/app/tasks'))}>
                              <UserCircle className="h-3 w-3 mr-1" />
                              {t('common:tasks.myTasks')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink to="/app/tasks/team" className={getNavCls(isActive('/app/tasks/team'))}>
                              <Users className="h-3 w-3 mr-1" />
                              {t('common:tasks.teamTasks')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        {isAdmin && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to="/app/tasks/review"
                                className={getNavCls(isActive('/app/tasks/review'))}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t('common:tasks.needsApproval')}
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Analytics */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/app/analytics" className={getNavCls(isActive('/app/analytics'))}>
                    <BarChart3 className="h-4 w-4" />
                    {!collapsed && <span>{t('navigation:menu.statistics')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Brand Guide */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/app/docs/brand-guide-extended"
                    className={getNavCls(isActive('/app/docs/brand-guide-extended'))}
                  >
                    <Palette className="h-4 w-4" />
                    {!collapsed && <span>{t('navigation:menu.brandGuide', 'Brand Guide')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Settings (general for everyone, team-only is admin) */}
              <Collapsible
                open={openGroups.settings || isGroupActive(['/app/settings'])}
                onOpenChange={() => toggleGroup('settings')}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={getNavCls(isGroupActive(['/app/settings']))}>
                      <Settings className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span>{t('navigation:menu.settings')}</span>
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
                            <NavLink to="/app/settings" className={getNavCls(isActive('/app/settings'))}>
                              {t('common:common.general', 'General')}
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        {isAdmin && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <NavLink to="/app/settings/team" className={getNavCls(isActive('/app/settings/team'))}>
                                <Users className="h-3 w-3 mr-1" />
                                {t('navigation:menu.team')}
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
            <SidebarGroupLabel>{t('common:common.management', 'Management')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/app/clients/late-payers" className={getNavCls(isActive('/app/clients/late-payers'))}>
                      <DollarSign className="h-4 w-4" />
                      {!collapsed && <span>{t('common:clients.latePayers', 'Late payers')}</span>}
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
