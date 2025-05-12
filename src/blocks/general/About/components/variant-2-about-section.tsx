import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { Media, Cta as CtaType } from '@payload-types'; 
import { getImageUrl } from '@/utilities/getImageUrl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Variant2AboutSectionProps {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null; // Corresponds to 'text' in your original code
  image?: Media;
  isInverted?: boolean | null;
  ctas?: CtaType[]
}

export default function Variant2AboutSection({
  title,
  subtitle,
  description,
  image,
  isInverted = false,
  ctas,
}: Variant2AboutSectionProps) {
  const imageSrc = image?.url ? getImageUrl(image) : undefined;
  const firstCta = ctas && ctas.length > 0 ? ctas[0] : null;

  let ctaHref = '#';
  let ctaTarget = '_self';

  if (firstCta && firstCta.link) {
    if (firstCta.link.type === 'external' && firstCta.link.externalUrl) {
      ctaHref = firstCta.link.externalUrl;
    } else if (firstCta.link.type === 'internal' && typeof firstCta.link.internalLink === 'object' && firstCta.link.internalLink?.slug) {
      ctaHref = `/${firstCta.link.internalLink.slug}`;
    }
    if (firstCta.link.newTab) {
      ctaTarget = '_blank';
    }
  }

  return (
    <ContainedSection verticalPadding="xl"> 
      <div className="flex flex-col md:flex-row gap-14 md:gap-36 h-full md:h-auto items-center min-h-[500px]"> {/* Adjusted md:h-[500px] to md:h-auto and added min-h for flexibility */}
        <div
          className={cn(
            "w-full h-full md:w-1/2 relative flex items-center",
            isInverted ? "md:order-last" : "md:order-first"
          )}
        >
          {imageSrc && (
            <div className="relative w-full md:w-3/4 h-64 md:h-2/3 mx-auto"> {/* Adjusted h-full to h-64 for mobile */}
              <div className="bg-primary hidden md:block md:absolute inset-0 z-0"></div>
              <Image
                alt={image?.alt || title || 'About section image'}
                className="relative md:absolute z-10 h-full w-full object-cover md:translate-x-10 md:-translate-y-10"
                src={imageSrc}
                fill
              />
            </div>
          )}
        </div>

        <div className={cn("w-full md:w-1/2 text-left")}>
          <SectionHeading className="items-start text-left mb-2">
            {subtitle && (
              <SectionHeading.Description className={cn("font-heading text-xl uppercase text-primary")}>
                {subtitle}
              </SectionHeading.Description>
            )}
            {title && <SectionHeading.Title className="text-primary">{title}</SectionHeading.Title>}
          </SectionHeading>
          {description && <p className="font-light text-slate-900 text-left mb-6">{description}</p>}
          {firstCta && firstCta.ctaText && (
            <Button asChild variant="outline">
              <Link href={ctaHref} target={ctaTarget}>
                {firstCta.ctaText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </ContainedSection>
  );
} 