import * as LucideIcons from 'lucide-react';
import ExcavatorIcon from './icons/excavator';
import BagerIcon from './icons/bager';
import WreckingBall from './icons/wrecking-ball';

/**
 * Gets a Lucide icon component by name with fallback
 * @param {string} iconName - The name of the Lucide icon
 * @param {React.ComponentType} fallbackIcon - Fallback icon component (default: HelpCircle)
 * @returns {React.ComponentType|null} The icon component or null
 */
export const getIconComponent = (iconName: string|null|undefined, fallbackIcon?: React.ComponentType | undefined) => {
  if (!iconName) return fallbackIcon;
  
  // Check if the icon exists in LucideIcons
  const IconComponent = (LucideIcons as any)[iconName];
  if (iconName === 'excavator') {
    return ExcavatorIcon;
  } else if (iconName === 'bager') {
    return BagerIcon;
  } else if (iconName === 'wrecking-ball') {
    return WreckingBall;
  }
  return IconComponent || fallbackIcon;
};

// Usage example with your benefits mapping:
/*
{benefits?.map((benefit, index) => {
  const IconComponent = getIconComponent(benefit.icon);
  
  return (
    <div key={index} className='flex flex-col items-start justify-start gap-2 px-4 py-2 rounded-md'>
      <div className='flex items-center justify-start gap-2 w-full'>
        {IconComponent && <IconComponent className='w-4 h-4 text-white' />}
        <p className='text-primary-foreground text-nowrap text-sm'>{benefit.title}</p>
      </div>
    </div>
  );
})}
*/

// Alternative version with custom fallback per call:
export const getIconWithCustomFallback = (iconName: string, customFallback: React.ComponentType) => {
  if (!iconName) return customFallback || LucideIcons.HelpCircle;
  
  const IconComponent = (LucideIcons as any)[iconName];
  
  return IconComponent || customFallback || LucideIcons.HelpCircle;
};

// Version that returns null if no icon found (no fallback):
export const getIconOrNull = (iconName: string) => {
  if (!iconName) return null;
  
  return (LucideIcons as any)[iconName] || null;
};