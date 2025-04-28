'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Phone, Mail, LucideProps } from 'lucide-react';
import FacebookIcon from '@/components/common/icons/facebook-icon';
import GoogleIcon from '@/components/common/icons/google-icon';
import { Cta } from "@payload-types";
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from './button';

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

  if (mainCta.ctaHref.startsWith('mailto:')) {
    IconComponent = Mail;
  } else if (mainCta.ctaHref.includes('facebook.com')) {
    IconComponent = FacebookIcon;
  } else if (mainCta.ctaHref.includes('google.com')) {
    IconComponent = GoogleIcon;
  } else if (mainCta.ctaHref.startsWith('tel:')) {
    IconComponent = Phone;
  }

  return (
    <Link href={mainCta.ctaHref}>
      {/* Use the mapped buttonVariant */}
      <Button className="flex items-center gap-1 w-full sm:w-auto" variant={buttonVariant}> 
        <IconComponent className="mr-2 h-4 w-4" />
        {mainCta.ctaText}
      </Button>
    </Link>
  );
};

export default CtaButton; 