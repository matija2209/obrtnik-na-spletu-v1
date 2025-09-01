import type { Cta, Navbar, Menu, BusinessInfo, Footer, Media } from '@payload-types';

// Unified NavItem interface
export interface NavItem {
  title: string;
  href: string;
  hasChildren?: boolean;
  children?: NavItemChild[];
  description?: string;
}

export interface NavItemChild {
  title: string;
  href: string;
  description: string;
  icon?: string;
}

// Main navbar props
export interface NavbarProps {
  navbarData: Navbar;
  businessInfoData: BusinessInfo;
  footerData: Footer;
}

// Desktop navbar props
export interface DesktopNavProps {
  isScrolled: boolean;
  navItems: NavItem[];
  forceBackground?: boolean;
  mainCta?: Cta;
  isTransparent?: boolean;
}

// Mobile navbar props
export interface MobileNavProps {
  isScrolled: boolean;
  navItems: NavItem[];
  currentLogo?: Media | null;
  mainCta?: Cta;
  companyName?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
  showLogoImage?: boolean;
  showLogoText?: boolean;
  isTransparent?: boolean;
}

// Navbar configuration
export interface NavbarConfig {
  isTransparent: boolean;
  isFixed: boolean;
  showLogoImage: boolean;
  showLogoText: boolean;
}

// Business info extracted data
export interface BusinessInfoData {
  companyName: string;
  phoneNumber: string;
  email: string;
  location: string;
  logoDark: Media | null;
  logoLight: Media | null;
}