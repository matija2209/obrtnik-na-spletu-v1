import React from 'react';

import type { Media } from '@payload-types';
import { getImageUrl } from '@/utilities/getImageUrl';
import DefaultServicePresentationSection from './default-service-presentation-section';

// Define the interface for the block since it might not be in payload-types yet
interface ServicesPresentationBlock {
  id?: string | null;
  blockType: 'servicesPresentation';
  blockName?: string | null;
  template?: 'default';
  services?: ServiceItem[] | null;
}

interface ServiceItem {
  title: string;
  description: string;
  order: 'normal' | 'inverse';
  bulletPoints?: { point: string }[] | null;
  images?: ServiceItemImage[] | null;
}

interface ServiceItemImage {
  image: Media | number;
  alt: string;
}

// Interface to pass to the component after processing
interface ProcessedServiceItem {
  title: string;
  description: string;
  order: 'normal' | 'inverse';
  bulletPoints: string[];
  images: {
    src: string;
    alt: string;
  }[];
}

const ServicesPresentationBlock = ({ ...block }: ServicesPresentationBlock) => {
  const { template = 'default', services = [] } = block;

  switch (template) {
    case 'default':
    default:
      // Process services to get correct format
      const processedServices: ProcessedServiceItem[] = (services || []).map((service) => {
        // Extract bullet points as string array
        const bulletPoints = (service.bulletPoints || [])
          .map(item => item.point)
          .filter(Boolean);

        // Process images
        const images = (service.images || [])
          .map(item => {
            const imageUrl = getImageUrl(
              typeof item.image === 'object' ? item.image : undefined
            );
            
            if (!imageUrl) return null;

            return {
              src: imageUrl,
              alt: item.alt || '',
            };
          })
          .filter(Boolean) as { src: string; alt: string }[];

        return {
          title: service.title,
          description: service.description,
          order: service.order || 'normal',
          bulletPoints,
          images
        };
      });

      return (
        <DefaultServicePresentationSection 
          services={processedServices}
        />
      );
  }
};

export default ServicesPresentationBlock; 