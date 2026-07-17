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
  Building2,
  Truck,
  FileText,
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
    { title: "Bill of Materials", url: "/bom" },
  ],
};

const sourcing = {
  label: "Supply Chain",
  icon: Truck,
  children: [
    { title: "Vendors", url: "/sourcing/vendors" },
    { title: "Manufacturers", url: "/sourcing/manufacturers" },
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
  { title: "Companies", url: "/companies", icon: Building2 },
  { title: "Warehouses", url: "/warehouses", icon: Warehouse },
  { title: "Files", url: "/files", icon: FileText },
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

        {/* Inventory, Supply Chain, and Stock Management Group */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Inventory */}
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={inventory.label}>
                      <inventory.icon className="h-4 w-4" />
                      <span>{inventory.label}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {inventory.children.map((child) => (
                        <SidebarMenuSubItem key={child.url}>
                          <SidebarMenuSubButton asChild isActive={isActive(child.url)}>
                            <Link to={child.url}>{child.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Supply Chain */}
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={sourcing.label}>
                      <sourcing.icon className="h-4 w-4" />
                      <span>{sourcing.label}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {sourcing.children.map((child) => (
                        <SidebarMenuSubItem key={child.url}>
                          <SidebarMenuSubButton asChild isActive={isActive(child.url)}>
                            <Link to={child.url}>{child.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Stock Management */}
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={stock.label}>
                      <stock.icon className="h-4 w-4" />
                      <span>{stock.label}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {stock.children.map((child) => (
                        <SidebarMenuSubItem key={child.url}>
                          <SidebarMenuSubButton asChild isActive={isActive(child.url)}>
                            <Link to={child.url}>{child.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>



        {/* Admin links */}
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
