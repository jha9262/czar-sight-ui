import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Warehouse,
  Package,
  Boxes,
  Cpu,
  ListTree,
  ClipboardList,
  Users,
  Settings,
  Factory,
  ChevronDown,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const nav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const inventory = {
  label: "Inventory",
  icon: Package,
  children: [
    { title: "Parts", url: "/inventory/parts" },
    { title: "Item Templates", url: "/inventory/items" },
    { title: "Item Stock", url: "/inventory/stock" },
    { title: "Sourcing", url: "/inventory/sourcing" },
    { title: "Product Models", url: "/product-models" },
    { title: "Bill of Materials", url: "/bom" },
  ],
};

const stock = {
  label: "Stock Management",
  icon: ClipboardList,
  children: [
    { title: "Stock Entries", url: "/stock/entries" },
    { title: "Templates", url: "/stock/templates" },
    { title: "Ledger", url: "/stock/ledger" },
  ],
};

const admin = [
  { title: "Warehouses", url: "/warehouses", icon: Warehouse },
  { title: "Users", url: "/users", icon: Users, adminOnly: true },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Factory className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">CZAR Production</p>
              <p className="truncate text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                Operations Console
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Catalog</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <CollapsibleGroup group={inventory} pathname={pathname} isActive={isActive} />
              <CollapsibleGroup group={stock} pathname={pathname} isActive={isActive} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {admin.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.adminOnly && !collapsed && (
                        <span className="ml-auto rounded bg-sidebar-accent px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-sidebar-foreground/70">
                          Admin
                        </span>
                      )}
                    </Link>
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

function CollapsibleGroup({
  group,
  pathname,
  isActive,
}: {
  group: { label: string; icon: any; children: { title: string; url: string }[] };
  pathname: string;
  isActive: (url: string) => boolean;
}) {
  const anyActive = group.children.some((c) => isActive(c.url));
  const Icon = group.icon;
  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={anyActive} className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={group.label} isActive={anyActive}>
            <Icon className="h-4 w-4" />
            <span>{group.label}</span>
            <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {group.children.map((c) => (
              <SidebarMenuSubItem key={c.url}>
                <SidebarMenuSubButton asChild isActive={isActive(c.url)}>
                  <Link to={c.url}>{c.title}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
