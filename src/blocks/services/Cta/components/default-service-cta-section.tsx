import React from 'react';
import SectionHeading from '@/components/layout/section-heading';
import { ContainedSection } from '@/components/layout/container-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ServicePageCtaSection {
  title: string;
  cta: {
    label: string;
    url: string;
  };
}

interface ServiceCtaSectionProps {
  data: ServicePageCtaSection;
}

const DefaultServiceCtaSection: React.FC<ServiceCtaSectionProps> = ({ data }) => {
  const { title, cta } = data;

  if (!title || !cta) {
    return null; // Don't render if essential data is missing
  }

  return (
    <ContainedSection
      sectionClassName="bg-primary text-white" // Dark teal background, white text
      containerClassName="text-center" // Center align container content
      verticalPadding="lg" // Corresponds to py-16 md:py-20 (approximately)
      padding="md" // Corresponds to px-4
      maxWidth="7xl" // Standard container max-width
    >
      <SectionHeading>
        <SectionHeading.Title size='small' className='text-primary-foreground font-light'>{title}</SectionHeading.Title>
      </SectionHeading>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8" 
        size="lg"
        variant="outline"
        asChild
      >
        <Link href={cta.url}>{cta.label}</Link>
      </Button>
    </ContainedSection>
  );
};

export default DefaultServiceCtaSection; 