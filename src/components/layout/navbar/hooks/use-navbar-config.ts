import { useMemo } from 'react';
import type { Navbar } from '@payload-types';
import type { NavbarConfig } from '../types';

/**
 * Custom hook to extract and compute navbar configuration
 */
export const useNavbarConfig = (navbarData: Navbar, isHome: boolean): NavbarConfig => {
  return useMemo(() => ({
    isTransparent: navbarData?.isTransparent || isHome,
    isFixed: navbarData?.isFixed ?? true,
    showLogoImage: navbarData?.showLogoImage ?? true,
    showLogoText: navbarData?.showLogoText ?? true,
  }), [navbarData, isHome]);
};