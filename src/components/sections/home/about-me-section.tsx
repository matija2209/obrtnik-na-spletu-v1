import React from 'react';
import Image from 'next/image';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import { Cta } from '@payload-types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface AboutMeSectionProps {
  title: string;
  description?: string;
  content: string;
  cta?: Cta;
  imageUrl?: string;
}

export default function AboutMeSection({
  title,
  description,
  content,
  cta,
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
            {/* <SectionHeading.Description>{description}</SectionHeading.Description> */}
          </SectionHeading>
          <p className='text-left md:text-center'>
          {content}
          </p>
          {cta && (
            <Button>
              <Link href={cta.ctaHref}>{cta.ctaText}</Link>
            </Button>
          )}

      </div>
     
    </ContainedSection>
  );
} 