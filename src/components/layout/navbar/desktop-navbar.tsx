'use client';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
  } from "@/components/ui/navigation-menu";
import Link from "next/link";
import React from "react";
import CtaButtons from "@/components/common/cta-buttons";
import { getEffectiveScrolled } from "@/utils/navbar-helpers";
import type { DesktopNavProps } from "./types";
import { ListItem, NavLink, CustomNavigationMenuTrigger } from "./components";
import { Cta } from "@payload-types";


// Desktop Navigation Component with nested menu
const DesktopNav = ({ 
  isScrolled, 
  navItems,
  mainCta,
  forceBackground = false,
  isTransparent = false // Add isTransparent prop with default
}: DesktopNavProps) => {
  
  // Determine the effective scrolled state using utility
  const effectiveScrolled = getEffectiveScrolled(isScrolled, isTransparent) || forceBackground;

  return (
    <div className="hidden md:flex items-center space-x-8">
      <NavigationMenu className="!bg-transparent">
        <NavigationMenuList className="gap-6 !bg-transparent !border-0 !shadow-none">
          {navItems.map((item, index) => (
            <NavigationMenuItem key={`${item.title.replace(/\s+/g, '-').toLowerCase()}-${index}`}>
              {item.hasChildren ? (
                <>
                  <CustomNavigationMenuTrigger 
                    isScrolled={effectiveScrolled} 
                    isTransparent={isTransparent}
                  >
                    {item.title}
                  </CustomNavigationMenuTrigger>
                  <NavigationMenuContent className="!bg-transparent !border-0 !shadow-none !p-0 !m-0 !rounded-none data-[state=open]:!animate-none data-[motion^=from-]:!animate-none data-[motion^=to-]:!animate-none hover:bg-secondary/30">
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
                  <NavLink 
                    isScrolled={effectiveScrolled} 
                    isTransparent={isTransparent}
                  >
                    {item.title}
                  </NavLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {/* Use the new CtaButton component */}
      {
        mainCta && (
          <CtaButtons ctas={[mainCta] as Cta[]} />
        )
      }

    </div>
  );
};

export default DesktopNav;