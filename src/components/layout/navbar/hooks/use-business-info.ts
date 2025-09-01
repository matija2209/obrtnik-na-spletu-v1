import { useMemo } from 'react';
import type { BusinessInfo, Media } from '@payload-types';
import type { BusinessInfoData } from '../types';

/**
 * Custom hook to extract and process business info data
 */
export const useBusinessInfo = (businessInfoData: BusinessInfo): BusinessInfoData => {
  return useMemo(() => {
    const companyName = businessInfoData?.companyName || '';
    const phoneNumber = businessInfoData?.phoneNumber || '';
    const email = businessInfoData?.email || '';
    const location = businessInfoData?.location || '';

    // Extract logo Media objects from business info
    const logoDark = typeof businessInfoData?.logo === 'object' && businessInfoData?.logo
      ? businessInfoData.logo 
      : null;
    const logoLight = typeof businessInfoData?.logoLight === 'object' && businessInfoData?.logoLight
      ? businessInfoData.logoLight 
      : logoDark; // Fallback to dark logo if light logo not available

    return {
      companyName,
      phoneNumber,
      email,
      location,
      logoDark,
      logoLight,
    };
  }, [businessInfoData]);
};