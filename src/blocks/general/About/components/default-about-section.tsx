import React from 'react';
import Image from 'next/image';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { Cta } from '@payload-types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface AboutMeSectionProps {
  title?: string;
  subtitle?: string;
  ctas?: Cta[];
  imageUrl?: string;
}

export default function DefaultAboutMeSection({
  title,
  subtitle,

  ctas,
  imageUrl,

}: AboutMeSectionProps) {
  return (
    <ContainedSection 
      id="o-meni" 
      bgColor="bg-white"
      backgroundImage={imageUrl}
      verticalPadding="xl"
      overlayClassName="bg-white/80"
    >
            <div className='space-y-6'>
          <SectionHeading>
            <SectionHeading.Title className='bg-primary p-2'>{title}</SectionHeading.Title>
          </SectionHeading>
          <p className='text-left md:text-center'>
          {subtitle}
          </p>
          {ctas && ctas.map((cta) => {
            // Determine href based on link type
            const href = cta.link?.type === 'external' 
              ? cta.link.externalUrl || '#' 
              : (typeof cta.link?.internalLink === 'object' && cta.link.internalLink?.slug ? `/${cta.link.internalLink.slug}` : '/'); // Basic internal link handling
            
            // Determine target based on newTab setting
            const target = cta.link?.newTab ? '_blank' : '_self';
            
            return (
              <Button key={cta.id} asChild>
                <Link href={href} target={target}>{cta.ctaText}</Link>
              </Button>
            );
          })}

      </div>
     
    </ContainedSection>
  );
} 