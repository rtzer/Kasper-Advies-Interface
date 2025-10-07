import { MessageSquare, Mail, Phone, Video, Inbox, Home, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mainRoutes = [
  { title: "Home", url: "/", icon: Home },
  { title: "Unified Inbox", url: "/unified-inbox", icon: Inbox, badge: 8 },
];

const channelRoutes = [
  { title: "WhatsApp", url: "/channels/whatsapp", icon: MessageSquare, badge: 3, color: "text-channel-whatsapp" },
  { title: "Email", url: "/channels/email", icon: Mail, badge: 2, color: "text-channel-email" },
  { title: "SMS", url: "/channels/sms", icon: MessageCircle, badge: 1, color: "text-channel-phone" },
  { title: "Telefoon", url: "/channels/phone", icon: Phone, color: "text-channel-phone" },
  { title: "Video", url: "/channels/video", icon: Video, color: "text-channel-video" },
  { title: "Facebook", url: "/channels/facebook", icon: Facebook, badge: 5, color: "text-channel-social" },
  { title: "Instagram", url: "/channels/instagram", icon: Instagram, badge: 2, color: "text-channel-social" },
  { title: "LinkedIn", url: "/channels/linkedin", icon: Linkedin, color: "text-channel-email" },
];

export function AppSidebar() {
  const { open } = useSidebar();

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={open ? "w-60" : "w-14"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={!open ? "sr-only" : ""}>Navigatie</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainRoutes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                      {open && item.badge && (
                        <Badge className="ml-auto bg-inbox-unread hover:bg-inbox-unread">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className={!open ? "sr-only" : ""}>Kanalen</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {channelRoutes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className={`h-4 w-4 ${item.color || ""}`} />
                      {open && <span>{item.title}</span>}
                      {open && item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
