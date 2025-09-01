import type { Menu, Media } from '@payload-types';
import type { NavItem } from '@/components/layout/navbar/types';

/**
 * Transform Payload menu items to NavItem format
 */
export const transformMenuItems = (mainMenuItems: NonNullable<Menu['menuItems']> | null): NavItem[] => {
  if (!mainMenuItems) return [];
  
  return mainMenuItems.map((item: NonNullable<Menu['menuItems']>[number]) => ({
    title: item.title,
    href: item.href || '#',
    hasChildren: Boolean(item.hasChildren),
    children: item.children?.map((child: NonNullable<NonNullable<Menu['menuItems']>[number]['children']>[number]) => ({
      title: child.title,
      href: child.href,
      description: child.description ?? '',
      icon: child.icon ?? ''
    }))
  }));
};

/**
 * Select current logo based on scroll/transparency state
 */
export const selectCurrentLogo = (
  effectiveScrolled: boolean,
  logoDark: Media | null,
  logoLight: Media | null
): Media | null => {
  return effectiveScrolled ? logoDark : logoLight;
};

/**
 * Calculate effective scrolled state based on scroll and transparency
 */
export const getEffectiveScrolled = (isScrolled: boolean, isTransparent: boolean): boolean => {
  return isScrolled || !isTransparent;
};

/**
 * Generate dynamic navbar classes based on state
 */
export const getNavbarClasses = (isFixed: boolean, effectiveScrolled: boolean): string => {
  return `${isFixed ? 'fixed' : 'relative'} top-0 w-full z-50 transition-all duration-300 ${
    effectiveScrolled 
      ? 'bg-white/90 shadow-sm backdrop-blur-sm' 
      : 'bg-transparent'
  }`;
};

/**
 * Generate dynamic text color classes for nav items
 */
export const getNavItemTextClasses = (isScrolled: boolean, isTransparent: boolean): string => {
  return isScrolled || !isTransparent ? "text-dark" : "text-primary-foreground";
};