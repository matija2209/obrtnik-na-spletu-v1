import React from 'react';
import type { Service } from '@payload-types'; // Adjusted type imports
import { SimpleListServiceCard } from './simple-list-service-card';
// import SectionContainer from '@/components/layout/SectionContainer'; // Removed SectionContainer import
import SectionHeading from '@/components/layout/section-heading'; // Corrected path

// Define the props for the ServicesListSection
interface ServicesListSectionProps {
  title?: string | null;
  description?: string | null;
  services: Service[]; // Expecting an array of validated Service objects
  // Add other relevant props from ServicesBlock if needed
}

export const ServicesListSection: React.FC<ServicesListSectionProps> = ({
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden"> {/* Adjusted max-width */}
        {services.map((service, index) => (
          <SimpleListServiceCard
            key={service.id || index}
            service={service}
          />
        ))}
      </div>
      {/* Add block-level CTA rendering logic here if needed, using block.serviceCta */}
    {/* </SectionContainer> */}
    </div>
  );
};

export default ServicesListSection; 