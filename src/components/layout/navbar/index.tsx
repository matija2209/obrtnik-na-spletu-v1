'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import DesktopNav from './desktop-navbar';
import MobileNav from './mobile-navbar';
import Logo from '@/components/common/logo';
import { useScrollState, useNavbarConfig, useBusinessInfo } from './hooks';
import { transformMenuItems, selectCurrentLogo, getNavbarClasses } from '@/utils/navbar-helpers';
import type { NavbarProps } from './types';
import type { Cta } from '@payload-types';

const Navbar = ({ 
  navbarData, 
  businessInfoData
}: Omit<NavbarProps, 'footerData'>) => {
  const isHome = usePathname() === '/';
  const isScrolled = useScrollState();
  const navbarConfig = useNavbarConfig(navbarData, isHome);
  const businessInfo = useBusinessInfo(businessInfoData);

  // Calculate effective scrolled state based on transparency setting
  const effectiveScrolled = isScrolled || !navbarConfig.isTransparent;

  // Extract and transform menu items
  const mainMenuItems = (typeof navbarData?.mainMenu === 'object' && navbarData?.mainMenu?.menuItems) 
    ? navbarData.mainMenu.menuItems 
    : null;
  const dynamicNavItems = transformMenuItems(mainMenuItems);

  // Determine which logo to use based on effective scroll state
  const currentLogo = selectCurrentLogo(effectiveScrolled, businessInfo.logoDark, businessInfo.logoLight);
  
  // Determine what to show for logo based on settings
  const shouldShowLogoImage = navbarConfig.showLogoImage && currentLogo;
  const shouldShowLogoText = navbarConfig.showLogoText;

  return (
    <nav className={getNavbarClasses(navbarConfig.isFixed, effectiveScrolled)}>
      <div className="mx-auto max-w-7xl px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo - conditionally render based on settings */}
          {(shouldShowLogoImage || shouldShowLogoText) && (
            <Logo 
              title={shouldShowLogoText ? businessInfo.companyName : ''} 
              logo={shouldShowLogoImage ? currentLogo : null} 
            />
          )}
          
          {/* Desktop Navigation */}
          <DesktopNav 
            mainCta={navbarData?.mainCta as Cta} 
            forceBackground={!navbarConfig.isTransparent} 
            isScrolled={isScrolled} 
            navItems={dynamicNavItems}
            isTransparent={navbarConfig.isTransparent}
          />

          {/* Mobile Navigation - Pass business info props down */}
          <MobileNav 
            currentLogo={shouldShowLogoImage ? currentLogo : null} 
            isScrolled={isScrolled} 
            navItems={dynamicNavItems} 
            mainCta={navbarData?.mainCta as Cta}
            companyName={businessInfo.companyName}
            phoneNumber={businessInfo.phoneNumber}
            email={businessInfo.email}
            location={businessInfo.location}
            showLogoImage={navbarConfig.showLogoImage}
            showLogoText={navbarConfig.showLogoText}
            isTransparent={navbarConfig.isTransparent}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;