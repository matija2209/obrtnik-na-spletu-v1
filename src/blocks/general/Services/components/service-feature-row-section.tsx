import React from 'react';
import type { Service as PayloadService, Media } from '@payload-types';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import Image from 'next/image';
import { getImageUrl } from '@/utilities/getImageUrl';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Interface for the Feature Block component adapted for services
interface ServiceFeatureRowProps {
  service: PayloadService;
  inverted?: boolean;
}

const ServiceFeatureRow: React.FC<ServiceFeatureRowProps> = ({
  service,
  inverted = false,
}) => {
  // Use the first image from the 'images' array as the featured image
  const firstImage = service.images?.[0]?.image;
  const imageUrl = getImageUrl(firstImage as Media | undefined);
  // Use 'serviceId' for the slug in the URL
  const serviceUrl = `/storitve/${service.serviceId}`; 

  if (!imageUrl) {
    // Handle missing image if necessary
    // Optionally render a placeholder or return null
    console.warn(`Missing image for service: ${service.title} (ID: ${service.id})`);
    // For now, let's render the text content even without an image
    // return null; 
  }

  return (
    <div className="relative">
      <div className={cn(
        "flex flex-col gap-8 items-center",
        inverted ? 'md:flex-row-reverse' : 'md:flex-row'
      )}>
        {imageUrl && (
          <div className="w-full md:w-1/2">
            <Image
              src={imageUrl}
              className="w-full h-auto rounded-lg shadow-md aspect-video object-cover"
              alt={service.title}
              width={500}
              height={300} // Adjust height as needed
            />
          </div>
        )}

        <div className={cn("w-full", imageUrl ? "md:w-1/2" : "md:w-full")} >
          {/* Optional: Kicker if you add it to the Service collection */}
          {/* <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">
            {service.kicker}
          </p> */}

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {service.title}
          </h3>

          {/* Use 'description' field instead of 'excerpt' */}
          {service.description && (
            <p className="text-lg text-gray-600 mb-4">
              {service.description} 
            </p>
          )}

          <Link href={serviceUrl} className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 group">
            Preberi več
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};


// Main section component
interface ServiceFeatureRowSectionProps {
  title?: string | null;
  description?: string | null;
  services: PayloadService[];
}

const ServiceFeatureRowSection: React.FC<ServiceFeatureRowSectionProps> = ({ title, description, services }) => {
  return (
    // Use 'lg' for vertical padding
    <ContainedSection verticalPadding='lg'>
      {(title || description) && (
        <SectionHeading className="mb-12">
          {title && <SectionHeading.Title>{title}</SectionHeading.Title>}
          {description && <SectionHeading.Description>{description}</SectionHeading.Description>}
        </SectionHeading>
      )}

      <div className="space-y-24 md:space-y-36">
        {services.map((service, index) => (
          <ServiceFeatureRow 
            key={service.id} 
            service={service} 
            inverted={index % 2 !== 0} // Alternate layout
          />
        ))}
      </div>
    </ContainedSection>
  );
};

export default ServiceFeatureRowSection; 