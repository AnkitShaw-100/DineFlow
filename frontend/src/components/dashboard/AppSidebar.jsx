import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  LayoutGrid,
  ShieldCheck,
  UtensilsCrossed,
  Utensils,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar.jsx";

const items = [
  { title: "Home", url: "/dashboard", icon: Home, exact: true },
  { title: "Orders", url: "/dashboard/orders", icon: ClipboardList },
  { title: "Tables", url: "/dashboard/tables", icon: LayoutGrid },
  { title: "Menu", url: "/dashboard/menu", icon: UtensilsCrossed },
  { title: "Admin", url: "/dashboard/admin", icon: ShieldCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (url, exact) => {
    return exact
      ? pathname === url
      : pathname === url || pathname.startsWith(url + "/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground shadow-sm">
            <Utensils className="h-4 w-4" />
          </span>
          {!collapsed && (
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              Dine Flow
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url, item.exact);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
