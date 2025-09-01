import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cta } from '@payload-types';
import * as LucideIcons from 'lucide-react';
import { type ColorScheme } from '@/utilities/getColorClasses';

// Type for button variants matching shadcn/ui button variants
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

interface CtaComponentProps {
  ctas: Cta | Cta[] | null | undefined | number | (number | Cta)[];
  className?: string;
  variant?: ButtonVariant;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  containerClassName?: string;
  colorScheme?: ColorScheme; // New prop for color scheme support
}

// Helper function to get Lucide icon component
const getLucideIcon = (iconName: string) => {
  if (!iconName) return null;
  
  // Convert iconName to PascalCase if needed
  const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  
  // @ts-ignore - Dynamic icon access
  const IconComponent = LucideIcons[formattedIconName] || LucideIcons[iconName];
  
  return IconComponent || null;
};

// Helper function to get the link URL from CTA
const getCtaUrl = (cta: Cta): string => {
  if (cta.link?.type === 'external' && cta.link.externalUrl) {
    return cta.link.externalUrl;
  }
  
  if (cta.link?.type === 'internal' && cta.link.internalLink) {
    // Assuming the page has a slug field
    const page = cta.link.internalLink as any;
    return `/${page.slug || page.id}`;
  }
  
  return '#';
};

// Single CTA renderer
const SingleCta: React.FC<{
  cta: Cta;
  variant?: ButtonVariant;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  colorScheme?: ColorScheme;
  ctaIndex?: number;
}> = ({ cta, variant, size = 'default', className, colorScheme, ctaIndex }) => {
  const url = getCtaUrl(cta);
  const shouldOpenInNewTab = cta.link?.newTab || false;
  const isExternal = cta.link?.type === 'external';
  
  // Determine the button variant with color scheme awareness
  
  // Get the icon component if specified
  const IconComponent = cta.icon ? getLucideIcon(cta.icon) : null;
  
  // Determine if this is an icon-only button
  const isIconOnly = cta.ctaType === 'icon' || size === 'icon';
  
  const buttonContent = (
    <>
      {IconComponent && (
        <IconComponent 
          className={cn(
            "h-4 w-4",
            !isIconOnly && cta.ctaText && "mr-2"
          )} 
        />
      )}
      {!isIconOnly && cta.ctaText}
    </>
  );
  
  const buttonClassName = cn(
    cta.ctaClassname,
    className
  );
  
  // For external links or links that should open in new tab
  if (isExternal || shouldOpenInNewTab) {
    return (
      <Button
        variant={variant}
        size={size}
        className={buttonClassName}
        asChild
      >
        <a
          href={url}
          target={shouldOpenInNewTab ? '_blank' : '_self'}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {buttonContent}
        </a>
      </Button>
    );
  }
  
  // For internal links
  return (
    <Button
      variant={variant}
      size={size}
      className={buttonClassName}
      asChild
    >
      <Link href={url}>
        {buttonContent}
      </Link>
    </Button>
  );
};

// Main CTA Component
export const CtaButtons: React.FC<CtaComponentProps> = ({
  ctas,
  className,
  variant,
  size = 'default',
  containerClassName,
  colorScheme
}) => {
  // Handle single CTA
  if (!ctas || typeof ctas === 'number' || typeof ctas === 'string') {
    return null;
  }

  if (!Array.isArray(ctas)) {
    return (
      <SingleCta 
        cta={ctas} 
        variant={variant} 
        size={size} 
        className={className} 
        colorScheme={colorScheme}
        ctaIndex={0}
      />
    );
  }
  
  // Handle multiple CTAs
  if (ctas.length === 0) {
    return null;
  }
  
  if (ctas.length === 1 && typeof ctas[0] === 'object') {
    return (
      <SingleCta 
        cta={ctas[0]} 
        variant={variant} 
        size={size} 
        className={className} 
        colorScheme={colorScheme}
        ctaIndex={0}
      />
    );
  }
  
  // Multiple CTAs - render in a container with index-aware variants
  return (
    <div className={cn("flex flex-wrap gap-2", containerClassName)}>
      {ctas.map((cta, index) => {
        if (typeof cta === 'number') {
          return null;
        }
        return (
          <SingleCta
            key={cta.id || `cta-${index}`}
            cta={cta}
            variant={variant}
            size={size}
            className={className}
            colorScheme={colorScheme}
            ctaIndex={index}
          />
        )
      })}
    </div>
  );
};

// Export default
export default CtaButtons;