import React from 'react';
import type { Service as PayloadService } from '@payload-types';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';

interface SimpleCardSectionProps {
  title?: string | null;
  description?: string | null;
  services: PayloadService[];
}

const SimpleCardSection: React.FC<SimpleCardSectionProps> = ({ title, description, services }) => {
  return (
    <ContainedSection>
      {(title || description) && (
        <SectionHeading className="mb-8">
          {title && <SectionHeading.Title>{title}</SectionHeading.Title>}
          {description && <SectionHeading.Description>{description}</SectionHeading.Description>}
        </SectionHeading>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="border p-4 rounded-lg shadow-sm">
            {/* TODO: Implement Simple Card layout using service data */}
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-sm text-muted-foreground">{/* Add description or excerpt */}</p>
            {/* Add image, link, etc. as needed */}
          </div>
        ))}
      </div>
    </ContainedSection>
  );
};

export default SimpleCardSection; 