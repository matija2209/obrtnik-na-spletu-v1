import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContainedSection } from '@/components/layout/container-section';
import type { Cta } from '@payload-types';

interface ServiceHeroSectionProps {
  title: string;
  subtitle: string;
  ctas: Cta[];
}

function DefaultServiceHeroBlock({ title, subtitle, ctas }: ServiceHeroSectionProps) {
  const primaryCta = ctas?.[0];
  const secondaryCta = ctas?.[1];

  return (
    <ContainedSection
      bgColor="bg-primary" // Use primary background as requested
      verticalPadding="3xl" // Maps to py-20 md:py-24, similar to original py-16 md:py-24
      padding="md" // Maps to px-4 sm:px-6 lg:px-8, includes original px-4
      sectionClassName="text-white" // Apply text color to the section
      className="grid md:grid-cols-2 gap-8 items-center" // Apply grid layout to the inner container
    >
      {/* Left side: Title and CTAs */}
      <div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-4">
          {title}
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          {primaryCta && (
            <Button
              key={primaryCta.id || "primary"}
              variant="default" // Assuming default is the white background style
              className="bg-white text-[#006064] hover:bg-gray-200" // Style for primary CTA
              size="lg"
              asChild
            >
              <Link href={primaryCta.link?.externalUrl || primaryCta.link?.internalLink ? 
                (primaryCta.link.type === 'external' ? primaryCta.link.externalUrl || '#' : `/pages/${primaryCta.link.internalLink}`) : 
                '#'}>
                {primaryCta.ctaText}
              </Link>
            </Button>
          )}
          {secondaryCta && (
            <Button
              key={secondaryCta.id || "secondary"}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#006064]" // Style for secondary CTA
              size="lg"
              asChild
            >
              <Link href={secondaryCta.link?.externalUrl || secondaryCta.link?.internalLink ? 
                (secondaryCta.link.type === 'external' ? secondaryCta.link.externalUrl || '#' : `/pages/${secondaryCta.link.internalLink}`) : 
                '#'}>
                {secondaryCta.ctaText}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Right side: Subtitle */}
      <div className="flex flex-col items-start gap-6">
        <p className="text-base md:text-lg font-light">
          {subtitle}
        </p>
      </div>
    </ContainedSection>
  );
}

export default DefaultServiceHeroBlock; 