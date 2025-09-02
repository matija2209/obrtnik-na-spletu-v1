import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cta } from '@payload-types';
import * as LucideIcons from 'lucide-react';
import { type ColorScheme } from '@/utilities/getColorClasses';
import { getIconComponent } from '@/utilities/getIcon';

// Type for button variants matching shadcn/ui button variants
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

interface CtaComponentProps {
  ctas: Cta | Cta[]
  className?: string;
  variant?: ButtonVariant;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  colorScheme?: ColorScheme;
  /**
   * Set to true when buttons are rendered over dark backgrounds (e.g., in hero sections)
   * This automatically applies appropriate contrast styling
   */
  heroContext?: boolean;
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

  
  if (cta.link?.url) {
    return cta.link.url;
  }
  
  return '#';
};

// Helper function to get hero-appropriate button styling
const getHeroButtonClasses = (variant: ButtonVariant): string => {
  const heroVariantClasses = {
    default: '', // Default variant already works well on dark backgrounds
    outline: ' border-white border bg-transparent text-primary hover:bg-white hover:text-primary-foreground',
    ghost: 'text-white hover:bg-white/10 hover:text-white',
    link: 'text-white hover:text-white/80',
    secondary: '', // Secondary variant works well
    destructive: '', // Destructive variant works well
  };
  
  return heroVariantClasses[variant] || '';
};

// Single CTA renderer
const SingleCta: React.FC<{
  cta: Cta;
  size?: 'default' | 'sm' | 'lg' | 'icon' ;
  ctaIndex?: number;
  heroContext?: boolean;
  className?: string;
  variant?: ButtonVariant;
}> = ({ cta, size = 'lg', ctaIndex, heroContext = false, variant, className }) => {
  const url = getCtaUrl(cta);
  const shouldOpenInNewTab = cta.link?.newTab || false;
  const isExternal = cta.link?.url?.includes("http")
  const isIcon = cta.icon ? true : false;
  // Determine the button variant with color scheme awareness
  
  // Get the icon component if specified
  const IconComponent = cta.icon ? getIconComponent(cta.icon) : null;
  
  // Determine if this is an icon-only button
  const isIconOnly = isIcon || size === 'icon';
  
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
  
  // Get the button variant, prioritizing CTA's own variant
  const buttonVariant = (variant ?? cta.bv ?? "default") as ButtonVariant;
  
  // Apply hero context styling if needed
  const heroClasses = heroContext ? getHeroButtonClasses(buttonVariant) : '';
  
  const buttonClassName = cn(
    // "w-min flex items-center justify-center",
    heroClasses,
    className
  );
  
  // For external links or links that should open in new tab
  if (isExternal || shouldOpenInNewTab) {
    if (isIcon) {
      return (
        <Link href={url} className={cn(buttonClassName)}>
          <IconComponent className={cn("h-4 w-4")} />
        </Link>
      )
    } else {
      return (
        <Button
          variant={buttonVariant}
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
  }

  if (isIcon) {
    return (
      <Link href={url} className={cn(buttonClassName)}>
        <IconComponent className={cn("h-4 w-4")} />
      </Link>
    )
  }
  // For internal links
  return (
    <Button
      variant={buttonVariant}
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
  heroContext = false,
}) => {

  if (!ctas || typeof ctas === 'number' || typeof ctas === 'string') {
    return null;
  }
  
  if (!Array.isArray(ctas)) {
    return (
      <SingleCta 
        cta={ctas} 
        size={size} 
        className={className}
        variant={variant}
        ctaIndex={0}
        heroContext={heroContext}
      />
    );
  }
  
  
  // Handle multiple CTAs
  if (ctas.length === 0) {
    return null;
  }

  if (ctas.length === 1 && typeof ctas[0] === 'object') {
    if (ctas[0].icon) {
      return (
        <Link href={getCtaUrl(ctas[0])} className={cn(className, "flex items-center justify-center")}>
          <LucideIcons.ArrowRight className={cn("h-4 w-4")} />
        </Link>
      )
    }
    return (
      <SingleCta 
        cta={ctas[0]} 
        size={size} 
        className={className}
        ctaIndex={0}
        variant={variant}
        heroContext={heroContext}
      />
    );
  }
  
  // Multiple CTAs - render in a container with index-aware variants
  return (
    <div className={cn("flex flex-wrap gap-2")}>
      {ctas.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).map((cta, index) => {
        if (typeof cta === 'number') {
          return null;
        }
        return (
          <SingleCta
            key={cta.id || `cta-${index}`}
            cta={cta}
            className={className}
            size={size}
            ctaIndex={index}
            heroContext={heroContext}
            variant={variant}
          />
        )
      })}
    </div>
  );
};

// Export default
export default CtaButtons;