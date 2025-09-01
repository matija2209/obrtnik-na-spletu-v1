import React from "react";
import { NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { getNavItemTextClasses } from "@/utils/navbar-helpers";

interface CustomNavigationMenuTriggerProps 
  extends React.ComponentPropsWithoutRef<typeof NavigationMenuTrigger> {
  isScrolled: boolean;
  isTransparent?: boolean;
}

export const CustomNavigationMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuTrigger>,
  CustomNavigationMenuTriggerProps
>(({ className, isScrolled, isTransparent, children, ...props }, ref) => {
  return (
    <NavigationMenuTrigger
      isScrolled={isScrolled}
      ref={ref}
      className={cn(
        "text-sm font-medium px-0 py-1.5 border-0 bg-transparent hover:bg-transparent focus:bg-transparent transition-colors",
        getNavItemTextClasses(isScrolled, isTransparent || false),
        "border-b-2 border-transparent hover:border-current data-[state=open]:border-current",
        className
      )}
      {...props}
    >
      {children}
    </NavigationMenuTrigger>
  );
});

CustomNavigationMenuTrigger.displayName = "CustomNavigationMenuTrigger";