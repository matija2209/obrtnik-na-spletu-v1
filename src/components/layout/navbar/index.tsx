'use client';
import React,{ useState, useEffect } from 'react';

import DesktopNav from './desktop-navbar';
import MobileNav from './mobile-navbar';
import Logo from '@/components/common/logo';

import type { Cta, Navbar as NavbarType } from '@payload-types';


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

// Define the props for the Navbar component
interface NavbarProps {
  navbarData: NavbarType;
  logoLightUrl: string;
  logoDarkUrl: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  location: string;
}

// Main Navbar Component
const Navbar = ({ 
  navbarData, 
  logoLightUrl, 
  logoDarkUrl,
  companyName,
  phoneNumber,
  email,
  location 
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate effective scrolled state, hardcoding forceBackground to true
  const effectiveScrolled = isScrolled || true; // Force background

  // Map navbarData to the expected NavItem format
  const dynamicNavItems: NavItem[] = navbarData.navItems?.map(item => ({
    title: item.title,
    href: item.href || '#',
    hasChildren: Boolean(item.hasChildren),
    children: item.children?.map((child: any) => ({
      title: child.title,
      href: child.href,
      description: child.description ?? '',
    }))
  })) || [];

  // Determine which logo to use based on effective scroll state
  const currentLogoSrc = effectiveScrolled ? logoDarkUrl : logoLightUrl;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${effectiveScrolled ? 'bg-white/90 shadow-sm backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo title={navbarData?.title ?? ''} logoSrc={currentLogoSrc} isScrolled={effectiveScrolled} location="navbar" />

          {/* Desktop Navigation */}
          <DesktopNav mainCta={navbarData?.mainCta as Cta} forceBackground={true} isScrolled={isScrolled} navItems={dynamicNavItems} />

          {/* Mobile Navigation - Pass business info props down */}
          <MobileNav 
            currentLogoSrc={currentLogoSrc} 
            isScrolled={effectiveScrolled} 
            navItems={dynamicNavItems} 
            mainCta={navbarData?.mainCta as Cta}
            companyName={companyName}
            phoneNumber={phoneNumber}
            email={email}
            location={location}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;