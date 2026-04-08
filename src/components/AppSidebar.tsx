import {
  LayoutDashboard, Trophy, Shield, Calendar, BookOpen, Settings, Users, ChevronLeft, ClipboardEdit, DollarSign,
  FlaskConical, GitBranch,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { CollapsibleNav } from "@/components/CollapsibleNav";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Liga", url: "/liga", icon: Shield },
  { title: "Copa", url: "/copa", icon: Trophy },
  { title: "Jogos", url: "/jogos", icon: Calendar },
  { title: "Palpites", url: "/palpites", icon: ClipboardEdit },
  { title: "Regras", url: "/regras", icon: BookOpen },
  { title: "Premiação", url: "/premiacao", icon: DollarSign },
];

const simulatorNav = {
  label: "Simulador",
  icon: <FlaskConical className="h-4 w-4" />,
  children: [
    {
      label: "Jogos",
      path: "/simulador/jogos",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      label: "Copa",
      icon: <Trophy className="h-4 w-4" />,
      children: [
        {
          label: "Classificação",
          path: "/simulador/copa",
        },
        {
          label: "Chaveamento",
          path: "/simulador/chaveamento",
          icon: <GitBranch className="h-4 w-4" />,
        },
      ],
    },
    {
      label: "Liga",
      path: "/simulador/liga",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      label: "Palpites",
      path: "/simulador/palpites",
      icon: <ClipboardEdit className="h-4 w-4" />,
    },
  ],
};

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
                  <SidebarMenuButton asChild tooltip={item.title}>
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
          <SidebarGroupLabel className="text-amber-400 flex items-center gap-2">
            {/* <FlaskConical className="h-3 w-3" /> {!collapsed && "Simulador"} */}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {collapsed ? (
              <SidebarMenu>
                {simulatorNav.children?.map((item) => {
                  if (item.children) {
                    return item.children.map((subItem) => (
                      <SidebarMenuItem key={subItem.path}>
                        <SidebarMenuButton asChild tooltip={subItem.label}>
                          <NavLink
                            to={subItem.path!}
                            className="hover:bg-amber-400/10"
                            activeClassName="bg-amber-400/10 text-amber-500 font-medium"
                          >
                            {subItem.icon || <Trophy className="mr-2 h-4 w-4" />}
                            <span className="sr-only">{subItem.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ));
                  }
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        <NavLink
                          to={item.path!}
                          className="hover:bg-amber-400/10"
                          activeClassName="bg-amber-400/10 text-amber-500 font-medium"
                        >
                          {item.icon}
                          <span className="sr-only">{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            ) : (
              <div className="space-y-1 -ml-2">
                <CollapsibleNav item={simulatorNav} />
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
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