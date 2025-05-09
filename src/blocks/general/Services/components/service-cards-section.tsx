import React from 'react';
import type { Service } from '@payload-types'; // Adjusted type imports
import { BasicServiceCard } from './basic-service-card';
import { twMerge } from 'tailwind-merge';
// import SectionContainer from '@/components/layout/SectionContainer'; // Removed SectionContainer import
import SectionHeading from '@/components/layout/section-heading'; // Corrected path

// Define the props for the ServiceCardsSection
interface ServiceCardsSectionProps {
  title?: string | null;
  description?: string | null;
  services: Service[]; // Expecting an array of validated Service objects
  // Add other relevant props from ServicesBlock if needed
}

export const ServiceCardsSection: React.FC<ServiceCardsSectionProps> = ({
  title,
  description,
  services,
  // Add other destructured props here
}) => {
  // No need to check for empty services here, dispatcher should handle it.

  return (
    // <SectionContainer> Replaced with a div
    <div className="container mx-auto px-4 py-8 md:py-12"> {/* Basic container styling */}
      {(title || description) && (
        <SectionHeading className="mb-8">
          {title && <SectionHeading.Title>{title}</SectionHeading.Title>}
          {description && <SectionHeading.Description>{description}</SectionHeading.Description>}
        </SectionHeading>
      )}
      <div
        className={twMerge(
          'service-cards-grid grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3' // Responsive grid columns
        )}
      >
        {services.map((service, index) => (
          <BasicServiceCard
            key={service.id || index}
            service={service}
            // Pass other props to BasicServiceCard if needed
          />
        ))}
      </div>
      {/* Add block-level CTA rendering logic here if needed, using block.serviceCta */}
    {/* </SectionContainer> */}
    </div>
  );
};

export default ServiceCardsSection; 