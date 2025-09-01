'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Phone, Mail, LucideProps } from 'lucide-react';
import FacebookIcon from '@/components/common/icons/facebook-icon';
import GoogleIcon from '@/components/common/icons/google-icon';
import { Cta } from "@payload-types";
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

// Define a type that can hold both Lucide icons and our custom icon component
type IconType = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> | React.FC<React.SVGProps<SVGSVGElement>>;

// Define the button variant type based on the actual variants used by the Button component
type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

interface CtaButtonProps {
  // Use the original Cta type, we will handle the mapping inside the component
  mainCta?: Cta; 
}

const CtaButton: React.FC<CtaButtonProps> = ({ mainCta }) => {
  if (!mainCta) {
    return null;
  }

  // Determine href and target from the link object
  const linkData = mainCta.link;
  let href = '#'; // Default href
  if (linkData) {
    if (linkData.type === 'external') {
      href = linkData.externalUrl || '#';
    } else if (linkData.type === 'internal') {
      // Handle potential object or ID for internalLink
      const internalLink = linkData.internalLink;
      if (typeof internalLink === 'object' && internalLink?.slug) {
        href = `/${internalLink.slug}`;
      } else {
        // Fallback if internalLink is just an ID or slug is missing (might need adjustment based on actual data)
        href = '/'; 
      }
    }
  }
  const target = linkData?.newTab ? '_blank' : '_self';

  // Map Cta type to Button variant
  let buttonVariant: ButtonVariant = 'default'; // Default to 'default'
  if (mainCta.ctaType && mainCta.ctaType !== 'primary' && mainCta.ctaType !== 'icon') {
    // Assign if it's a valid ButtonVariant (excluding 'primary' and 'icon')
    buttonVariant = mainCta.ctaType as ButtonVariant;
  } else if (mainCta.ctaType === 'primary') {
    // Map 'primary' from Cta to 'default' for Button
    buttonVariant = 'default';
  }
  // Note: 'icon' type from Cta is not directly mapped to a Button variant style here,
  // it defaults to 'default'. If specific 'icon' styling is needed, Button component variants would need update.

  let IconComponent: IconType = Phone;

  // Update icon logic to use the derived href
  if (href.startsWith('mailto:')) {
    IconComponent = Mail;
  } else if (href.includes('facebook.com')) {
    IconComponent = FacebookIcon;
  } else if (href.includes('google.com')) {
    IconComponent = GoogleIcon;
  } else if (href.startsWith('tel:')) {
    IconComponent = Phone;
  }
  // TODO: Add logic for selecting icon based on mainCta.icon field if needed

  return (
    <Link href={href} target={target} passHref>
      {/* Use the mapped buttonVariant */}
      <Button className="flex items-center gap-1 w-full sm:w-auto" variant={buttonVariant}> 
        <IconComponent className="mr-2 h-4 w-4" />
        {mainCta.ctaText}
      </Button>
    </Link>
  );
};

export default CtaButton; 