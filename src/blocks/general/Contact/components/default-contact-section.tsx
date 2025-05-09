import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import { ContactForm } from '@/components/contact-form';
import SectionHeading from '@/components/layout/section-heading';
import { Cta, type Form as PayloadFormType } from '@payload-types';

interface ContactSectionProps {
  title?: string;
  description?: string;
  cta?: Cta[];
  imageUrl?: string;
  form?: PayloadFormType | null | number;
}

export default function DefaultContactSection({
  title,
  description,
  form,
}: ContactSectionProps) {
  return (
    <ContainedSection
      id="kontakt"
      bgColor="bg-secondary"
      verticalPadding="xl"
    >
        {/* Left Column - Contact Information and Hours */}
      <div className="text-white">
      <SectionHeading >
          <SectionHeading.Title className='text-white'>{title}</SectionHeading.Title>
          <SectionHeading.Description className='text-white'>
              {description}
          </SectionHeading.Description>
        </SectionHeading>
      </div>
      <div className=" rounded-lg ">
        {form && typeof form === 'object' ? (
          <ContactForm form={form} />
        ) : (
          <p className="text-white">No form selected or form data is invalid.</p>
        )}
      </div>

    </ContainedSection>
  );
}
