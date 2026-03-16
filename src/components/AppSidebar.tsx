import {
  LayoutDashboard, Trophy, Shield, Calendar, BookOpen, Settings, Users, ChevronLeft, ClipboardEdit, DollarSign,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Liga", url: "/liga", icon: Shield },
  { title: "Copa", url: "/copa", icon: Trophy },
  { title: "Jogos", url: "/jogos", icon: Calendar },
  { title: "Palpites", url: "/palpites", icon: ClipboardEdit },
  { title: "Regras", url: "/regras", icon: BookOpen },
];

const adminItems = [
  { title: "Gerenciar Jogos", url: "/admin/jogos", icon: Calendar },
  { title: "Participantes", url: "/admin/participantes", icon: Users },
  { title: "Configurações", url: "/admin/config", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <h1 className="font-heading text-xl font-bold">
              <span className="text-gradient">Bolão</span> Copa
            </h1>
          )}
          {collapsed && <Trophy className="h-6 w-6 text-primary" />}
          {!collapsed && (
            <button onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-accent/10"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-accent/10"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className={`p-2 flex ${collapsed ? "justify-center" : "justify-end"}`}>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
