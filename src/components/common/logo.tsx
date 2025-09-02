'use client';
import Link from 'next/link';
import PayloadImage from '@/components/PayloadImage';
import type { Media } from '@payload-types';
// Remove BusinessInfo import if no longer needed elsewhere in the file
// import type { BusinessInfo } from '@payload-types'; 
// Remove getLogoUrl import
// import { getLogoUrl } from '@/lib/payload';

// Define props interface
interface LogoProps {
  isScrolled?: boolean;
  location?: 'navbar' | 'footer' | 'mobile-menu';
  logo?: Media | null; // Changed from logoSrc to logo (Media object)
  title?: string;
}

// Logo Component
const Logo = ({ title, isScrolled = false, location, logo }: LogoProps) => {
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

  // Define size constraints based on location
  const getSizeConstraints = () => {
    switch (location) {
      case 'navbar':
        return {
          className: 'h-8 w-auto max-w-[120px] sm:h-10 sm:max-w-[150px]',
          context: 'thumbnail' as const
        };
      case 'footer':
        return {
          className: 'h-12 w-auto max-w-[180px]',
          context: 'card' as const
        };
      case 'mobile-menu':
        return {
          className: 'h-8 w-auto max-w-[120px]',
          context: 'thumbnail' as const
        };
      default:
        return {
          className: 'h-10 w-auto max-w-[150px]',
          context: 'thumbnail' as const
        };
    }
  };

  const sizeConstraints = getSizeConstraints();

  return (
    <Link href="/" className="flex items-center space-x-2">
      {logo && (
        <PayloadImage
          image={logo}
          alt={title ? `${title} Logo` : 'Logo'}
          className={`${sizeConstraints.className} object-contain`}
          context={sizeConstraints.context}
          objectFit="contain"
          priority={location === 'navbar'} // Priority for navbar logos
        />
      )}
      {title && (
        <span className={`text-lg font-bold ${getTextColor()} hidden sm:block truncate max-w-[200px]`}>
          {title}
        </span>
      )}
    </Link>
  );
};

export default Logo; 