import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import type { Service as PayloadService, Page as PayloadPage, Media as PayloadMedia } from '@payload-types';
import { getImageUrl } from '@/utilities/getImageUrl';

interface RoundedServiceCardProps {
  imageSrc: string | null | undefined;
  imageAlt: string | undefined;
  title: string | undefined;
  description: string | null | undefined;
  href: string;
}

function RoundedServiceCard({ imageSrc, imageAlt, title, description, href }: RoundedServiceCardProps) {
  return (
    <div className="relative w-full max-w-md h-[500px]">
      {imageSrc && (
        <div className="absolute inset-x-0 top-0 h-[270px] overflow-hidden rounded-t-[20px]">
          <Image
            src={imageSrc}
            alt={imageAlt || title || 'Service Image'}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="absolute right-0 top-[230px] w-[90%] p-6 flex flex-col gap-2 bg-[#F5F9FF] shadow-sm rounded-[20px_0_20px_20px] min-h-[280px]">
        <h3 className="font-bold text-2xl text-black line-clamp-2">{title || 'Service Title'}</h3>
        <p className="font-light text-lg text-gray-800 line-clamp-4">{description || 'Service description unavailable.'}</p>
        <div className="mt-auto pt-4">
          <Link 
            href={href}
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md inline-block text-center w-full transition-colors"
          >
            Več informacij
          </Link>
        </div>
      </div>
    </div>
  );
} 

// Helper to check if dedicatedPage is a populated Page object
const isPageObject = (page: number | PayloadPage | null | undefined): page is PayloadPage => 
  typeof page === 'object' && page !== null && 'slug' in page;

// Helper to check if image relation is a populated Media object
const isMediaObject = (media: number | PayloadMedia | null | undefined): media is PayloadMedia => 
  typeof media === 'object' && media !== null && 'url' in media;

interface RoundedCardsSectionProps {
  title?: string;
  description?: string;
  services: PayloadService[];
}

export default function RoundedCardsSection({ title, description, services }: RoundedCardsSectionProps) {
  // Basic validation for title and description
  const displayTitle = title || 'Storitve'; // Default title
  const displayDescription = description;

  return (
    <ContainedSection 
      id="storitve-rounded" 
      bgColor="bg-background"
      verticalPadding="xl"
    >
      <div className="flex flex-col items-center">
        <SectionHeading>
          <SectionHeading.Title>{displayTitle}</SectionHeading.Title>
          {displayDescription && (
            <SectionHeading.Description>{displayDescription}</SectionHeading.Description>
          )}
        </SectionHeading>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24 w-full justify-items-center">
          {services.map((service) => {
            // Get the first image from the 'images' array, if it exists and is populated
            const firstImageRelation = service.images?.[0]?.image;
            const imageObject = isMediaObject(firstImageRelation) ? firstImageRelation : undefined; // Ensure we have a Media object or undefined
            const imageAlt = imageObject ? imageObject.alt : service.title; // Use alt text from object or fallback to title
            const imageUrl = getImageUrl(imageObject); // Pass the Media object or undefined
            
            // Get the slug from the dedicatedPage relation, if it exists and is populated
            const pageRelation = service.dedicatedPage;
            const slug = isPageObject(pageRelation) ? pageRelation.slug : null;
            const serviceHref = slug ? `/storitve/${slug}` : `/storitve#${service.serviceId || service.id}`; // Fallback link

            return (
              <RoundedServiceCard
                key={service.id}
                imageSrc={imageUrl}
                imageAlt={imageAlt ?? 'Service Image'}
                title={service.title}
                description={service.description} // Use the main description field
                href={serviceHref}
              />
            );
          })}
        </div>
      </div>
    </ContainedSection>
  );
} 