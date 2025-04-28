import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import { ContactForm } from '@/components/contact-form';
import SectionHeading from '@/components/layout/section-heading';

export default function ContactSection() {
  return (
    <ContainedSection
      id="kontakt"
      bgColor="bg-secondary"
      verticalPadding="xl"
    >
        {/* Left Column - Contact Information and Hours */}
      <div className="text-white">
      <SectionHeading >
          <SectionHeading.Title className='text-white'>Kontaktirajte nas</SectionHeading.Title>
          <SectionHeading.Description className='text-white'>
              Če imate kakršno koli vprašanje ali potrebo po pomoči, smo tu za vas.
          </SectionHeading.Description>
        </SectionHeading>
      </div>
      <div className=" rounded-lg ">
        <ContactForm />
      </div>

    </ContainedSection>
  );
}
