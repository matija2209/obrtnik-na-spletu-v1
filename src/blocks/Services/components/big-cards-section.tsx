import React from 'react';
import type { Media, Service } from '@payload-types';
import SectionHeading from '@/components/layout/section-heading';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

// Helper to check if an object is a Media object
const isMediaObject = (item: string | number | Media | null | undefined): item is Media =>
  typeof item === 'object' && item !== null && 'url' in item;

// Define the props for the BigCardsSection
interface BigCardsSectionProps {
  title?: string | null;
  description?: string | null;
  services: Service[]; // Expecting an array of validated Service objects
  // Add other relevant props from ServicesBlock if needed (like serviceCta)
}

export const BigCardsSection: React.FC<BigCardsSectionProps> = ({
  title,
  description,
  services,
}) => {

  return (
    // <PaddedSection> Replaced with a div container
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20"> {/* Added padding */}
      <div className="mx-auto space-y-12 md:space-y-14"> {/* Adjusted spacing */}
        {(title || description) && (
          <SectionHeading>
            {title && <SectionHeading.Title>{title}</SectionHeading.Title>}
            {description && <SectionHeading.Description>{description}</SectionHeading.Description>}
          </SectionHeading>
        )}
        {/* Adjusted flex direction and gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"> 
          {services.map((service, index: number) => {
            const { title: serviceTitle, description: serviceDescription, images } = service;
            const firstImage = Array.isArray(images) && images.length > 0 ? images[0]?.image : null;
            const imageMedia = isMediaObject(firstImage) ? firstImage : null;
            const imageUrl = imageMedia?.url;
            const imageAlt = imageMedia?.alt || serviceTitle || '';

            return (
              <article
                key={service.id || index}
                className='relative flex flex-col w-full h-[400px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105' /* Adjusted styles */
              >
                {imageUrl && (
                  <div className='absolute inset-0 z-0'>
                    <Image
                      alt={imageAlt}
                      layout='fill'
                      objectFit='cover'
                      className="brightness-75" /* Added brightness */
                      src={imageUrl}
                      priority={index < 3} // Prioritize first few images
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                  </div>
                )}
                <div className='relative z-10 p-4 md:p-6 mt-auto space-y-3 md:space-y-4'> {/* Adjusted padding and spacing */}
                  <div className='space-y-1'>
                    <h6 className='text-white text-xl md:text-2xl lg:text-3xl font-semibold capitalize'>{serviceTitle}</h6> {/* Adjusted text size */}
                    {serviceDescription && <p className='text-white/90 text-sm md:text-base line-clamp-3'>{serviceDescription}</p>} {/* Adjusted text style and line clamp */}
                  </div>
                  {/* Removed per-card link, potentially add block CTA below grid */}
                </div>
              </article>
            );
          })}
        </div>
        {/* TODO: Add block-level CTA rendering logic here if needed, using block.serviceCta */}
      </div>
    </div>
  );
}

export default BigCardsSection; 