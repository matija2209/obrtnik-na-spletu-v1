import React from "react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { getIconComponent } from "@/utilities/getIcon";


interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  icon?: string;
}

export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  ListItemProps
>(({ className, title, children, icon, ...props }, ref) => {
  const IconComponent = getIconComponent(icon);

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "bg-transparent hover:bg-secondary/30 focus:bg-secondary/30",
            "group",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className="h-4 w-4 transition-colors group-hover:text-secondary-foreground" />}
            <span className="text-sm font-medium leading-none text-foreground/80 transition-all group-hover:text-secondary-foreground duration-300">
              {title}
            </span>
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