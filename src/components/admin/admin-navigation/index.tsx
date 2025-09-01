"use client"
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Image,
  FolderOpen,
  Wrench,
  MessageCircle,
  HelpCircle,
  Lightbulb,
  Truck,
  Clock,
  FileText,
  ArrowRight,
  MenuSquare,
  List,
  Layers,
  Receipt,
  Flag,
  Menu,
  FileInput,
  Send,
  Building,
  Navigation,
  Footprints,
  PlusCircle
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider
} from "@/components/ui/sidebar";

import Link from "next/link";

// Icon mapping for collections and globals
const iconMapping = {
  'tenants': Building,
  'users': Users,
  'media': Image,
  'services': Wrench,
  'testimonials': MessageCircle,
  'faq-items': HelpCircle,
  'ctas': Lightbulb,
  'opening-hours': Clock,
  'pages': FileText,
  'redirects': ArrowRight,
  'pricelists': Receipt,
  'banners': Flag,
  'menus': Menu,
  'forms': FileInput,
  'form-submissions': Send,
  'business-info': Building,
  'navbar': Navigation,
  'footer': Footprints
};

function AdminNavigation(props:any) {
  const collections = props?.visibleEntities?.collections || {};
  const globals = props?.visibleEntities?.globals || {};
  
  return (
    <SidebarProvider>
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <Layers className="size-5" />
                <span className="text-base font-semibold">Admin Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <PlusCircle />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <LayoutDashboard />
                  <Link href="/admin">
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Collections Menu */}
            {Object.keys(collections).length > 0 && (
              <div className="mt-2">
                <div className="px-4 mb-2 text-sm font-medium text-muted-foreground">Collections</div>
                <SidebarMenu>
                  {collections.map((key: string) => {
                    const Icon = iconMapping[key as keyof typeof iconMapping] || FolderOpen;
                    // Derive label from slug (e.g., "opening-hours" -> "Opening Hours")
                    const label = key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    return (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton tooltip={label}>
                          <Icon size={18} />
                          <Link href={`/admin/collections/${key}`}>
                            <span>{label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </div>
            )}

            {/* Globals Menu */}
            {Object.keys(globals).length > 0 && (
              <div className="mt-4">
                <div className="px-4 mb-2 text-sm font-medium text-muted-foreground">Globals</div>
                <SidebarMenu>
                  {globals.map((key: string) => {
                    const Icon = iconMapping[key as keyof typeof iconMapping] || FolderOpen;
                    // Derive label from slug (e.g., "business-info" -> "Business Info")
                    const label = key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    return (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton tooltip={label}>
                          <Icon size={18} />
                          <Link href={`/admin/globals/${key}`}>
                            <span>{label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
  
      </SidebarFooter>
    </Sidebar>
    </SidebarProvider>
  );
}

export default AdminNavigation