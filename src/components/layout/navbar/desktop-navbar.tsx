'use client';
import { Button } from "@/components/ui/button";
import CtaButton from "@/components/ui/cta-button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Sparkles, Zap, Droplet, Hand, Footprints, Paintbrush, LucideIcon, Phone } from "lucide-react";
import { Cta } from "@payload-types";
// Icon mapping object
const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Zap,
  Drop: Droplet,
  Hands: Hand,
  Footprints,
  Paintbrush
};

// Define the NavItem interface
interface NavItem {
  title: string;
  href: string;
  hasChildren?: boolean;
  children?: {
    title: string;
    href: string;
    description: string;
    icon?: string | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[];
  description?: string;
}

// Update props interface for DesktopNav
interface DesktopNavProps {
  isScrolled: boolean;
  navItems: NavItem[];
  forceBackground?: boolean; // Add optional forceBackground prop
  mainCta?: Cta;
}

// Custom List Item Component for Navigation Menu
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: string | React.ComponentType<React.SVGProps<SVGSVGElement>> }
>(({ className, title, children, icon, ...props }, ref) => {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;
  
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "bg-transparent hover:bg-secondary focus:bg-secondary",
            "group",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className="h-4 w-4 transition-colors group-hover:text-secondary-foreground" />}
            <span className="text-sm font-medium leading-none text-foreground/80 transition-all group-hover:text-secondary-foreground group-hover:font-semibold">{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1 transition-colors group-hover:text-secondary-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const NavLink = React.forwardRef<
  React.ElementRef<"span">,
  React.ComponentPropsWithoutRef<"span"> & { isScrolled: boolean }
>(({ className, isScrolled, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "text-sm font-medium px-0 py-1.5 border-0 bg-transparent hover:bg-transparent focus:bg-transparent transition-colors",
        isScrolled ? "text-secondary" : "text-primary-foreground",
        "border-b-2 border-transparent hover:border-current",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
NavLink.displayName = "NavLink";

// Desktop Navigation Component with nested menu
const   DesktopNav = ({ 
  isScrolled, 
  navItems,
  mainCta,
  forceBackground = false // Destructure forceBackground, default to false
}: DesktopNavProps) => { // Use the new props interface
  
  // Determine the effective scrolled state
  const effectiveScrolled = isScrolled || forceBackground;

  return (
    <div className="hidden md:flex items-center space-x-8">
      <NavigationMenu className="!bg-transparent">
        <NavigationMenuList className="gap-6 !bg-transparent !border-0 !shadow-none">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              {item.hasChildren ? (
                <>
                  <NavigationMenuTrigger isScrolled={effectiveScrolled} className={cn( // Use effectiveScrolled
                   
                  )}>
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="!bg-transparent !border-0 !shadow-none !p-0 !m-0 !rounded-none data-[state=open]:!animate-none data-[motion^=from-]:!animate-none data-[motion^=to-]:!animate-none hover:bg-secondary">
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] !bg-transparent">
                      {item.children?.map((child) => (
                        <ListItem
                          key={child.title}
                          title={child.title}
                          href={child.href}
                          icon={child.icon}
                        >
                          {child.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={item.href}>
                  {/* Pass effectiveScrolled to NavLink's isScrolled prop */}
                  <NavLink isScrolled={effectiveScrolled}>{item.title}</NavLink> 
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {/* Use the new CtaButton component */}
      <CtaButton mainCta={mainCta} />
    </div>
  );
};

export default DesktopNav;