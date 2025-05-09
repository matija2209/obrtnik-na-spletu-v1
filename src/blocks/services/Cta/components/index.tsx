import React from 'react';

import type { Cta } from '@payload-types';
import DefaultServiceCtaSection from './default-service-cta-section';

// Define the interface for the block since it might not be in payload-types yet
interface ServicesCtaBlock {
  id?: string | null;
  blockType: 'servicesCta';
  blockName?: string | null;
  template?: 'default';
  title?: string | null;
  cta?: number | Cta | null;
}

// Interface to pass to the component after processing
interface ServicePageCtaSection {
  title: string;
  cta: {
    label: string;
    url: string;
  };
}

// Custom MissingFieldsAlert component as fallback
const MissingFieldsAlert: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
    <p>{message}</p>
  </div>
);

// Custom function to validate CTAs
const validateCtaObject = (cta: any): { label: string; url: string } | null => {
  if (!cta) return null;
  
  // If it's just a number reference, we can't use it directly
  if (typeof cta === 'number') return null;
  
  // For payload CTA objects, extract the necessary info
  let label = '';
  let url = '';
  
  // Try to get the label from ctaText
  if (cta.ctaText) {
    label = cta.ctaText;
  }
  
  // Try to get URL from link object
  if (cta.link) {
    if (cta.link.type === 'external' && cta.link.externalUrl) {
      url = cta.link.externalUrl;
    }
    // Handle internal links as needed
  }
  
  if (label && url) {
    return { label, url };
  }
  
  return null;
};

const ServicesCtaBlock = ({ ...block }: ServicesCtaBlock) => {
  const { template = 'default', title, cta } = block;

  switch (template) {
    case 'default':
    default:
      // Validate the CTA
      const validatedCta = validateCtaObject(cta);

      // Check if all required fields are present
      if (!title || !validatedCta) {
        return (
          <MissingFieldsAlert 
            message="This CTA block requires a title and a valid CTA button."
          />
        );
      }

      const processedData: ServicePageCtaSection = {
        title,
        cta: validatedCta
      };

      return (
        <DefaultServiceCtaSection 
          data={processedData} 
        />
      );
  }
};

export default ServicesCtaBlock; 