import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import { ContactForm } from '@/components/contact-form';
import SectionHeading from '@/components/layout/section-heading';
import type { ContactBlock, Form as PayloadFormType } from '@payload-types';
import { ColorScheme, getBackgroundClass, getColorClasses } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { extractId } from '@/utilities/extractIds';
import { getForm } from '@/lib/payload';

export default async function DefaultContactSection(props: ContactBlock) {
  const { title, description, form, colourScheme, bgColor: backgroundColor, isTransparent, idHref } = props

  // Process color classes
  const colorClasses = getColorClasses(colourScheme as ColorScheme);
  const backgroundClass = getBackgroundClass(backgroundColor ?? "");
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Extract form ID and fetch form data
  const formId = form ? extractId(form) : null;
  const formData = formId ? await getForm(formId) : null;

  return (
    <ContainedSection
      id={idHref ?? "kontakt"}
      overlayClassName={overlayClass}
      verticalPadding="xl"
    >
      {/* Left Column - Contact Information and Hours */}
      <div>
       {(title || description) && <SectionHeading >
          {title && <SectionHeading.Title  className='text-white'>{title}</SectionHeading.Title>}
          {description && <SectionHeading.Description className='text-white'>
            {description}
          </SectionHeading.Description>}
        </SectionHeading>}
      </div>
      <div className="mt-12 bg-white p-10 rounded-3xl shadow-sm">
      {formData ? (
          <ContactForm form={formData} />
        ) : (
          <p className={colorClasses.textClass}>No form selected or form data is invalid.</p>
        )}
      </div>
    </ContainedSection>
  );
}
