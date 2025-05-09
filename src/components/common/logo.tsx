'use client';
import Image from 'next/image';
import Link from 'next/link';
// Remove BusinessInfo import if no longer needed elsewhere in the file
// import type { BusinessInfo } from '@payload-types'; 
// Remove getLogoUrl import
// import { getLogoUrl } from '@/lib/payload';

// Define props interface - remove businessData, add logoSrc
interface LogoProps {
  isScrolled?: boolean;
  location?: 'navbar' | 'footer' | 'mobile-menu';
  logoSrc?: string; // Add this prop
  title?: string;
  // businessData?: BusinessInfo; // Remove this prop
}

// Logo Component - update props destructuring
const Logo = ({ title,isScrolled = false, location, logoSrc }: LogoProps) => {
  // Determine text color based on location and scroll state
  const getTextColor = () => {
    if (location === 'footer') {
      return 'text-primary';
    }
    if (location === 'mobile-menu') {
      return 'text-secondary';
    }
    // Default to navbar logic
    return isScrolled ? 'text-secondary' : 'text-primary-foreground';
  };

  // Remove the logic for determining logoVariant and calling getLogoUrl
  // const logoVariant = location === 'footer' || location === 'mobile-menu' || (isScrolled && location === 'navbar') 
  //   ? 'dark' 
  //   : 'light';
  // const logoSrc = getLogoUrl(businessData, logoVariant as 'dark' | 'light');

  return (
    <Link href="/" className="flex items-center">
      {logoSrc && <Image
        src={logoSrc} // Use the passed prop directly
        alt="Rezanje in vrtanje betona Logo"
        width={55}
        height={20}
        className="h-auto w-auto mr-2"
      />}
      {title && <span className={`hidden md:block text-2xl font-bold ${getTextColor()}`}>{title}</span>}
    </Link>
  );
};

export default Logo; 