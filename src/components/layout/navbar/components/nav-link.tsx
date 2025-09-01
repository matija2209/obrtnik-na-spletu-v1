import React from "react";
import { cn } from "@/lib/utils";
import { getNavItemTextClasses } from "@/utils/navbar-helpers";

interface NavLinkProps extends React.ComponentPropsWithoutRef<"span"> {
  isScrolled: boolean;
  isTransparent?: boolean;
}

export const NavLink = React.forwardRef<
  React.ElementRef<"span">,
  NavLinkProps
>(({ className, isScrolled, isTransparent, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "text-sm font-medium px-0 py-1.5 border-0 bg-transparent hover:bg-transparent focus:bg-transparent transition-colors",
        getNavItemTextClasses(isScrolled, isTransparent || false),
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