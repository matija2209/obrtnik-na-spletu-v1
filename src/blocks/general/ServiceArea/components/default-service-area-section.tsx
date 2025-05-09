import React from 'react';
import Image from 'next/image';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';

import { Media } from '@payload-types';
import MapWithCircleOverlay from '@/components/misc/map-with-circle-overlay';

interface LocationItem {
  name: string;
}

interface ServiceAreaSectionProps {
  title?: string;
  description?: string;
  mapImage?: Media;
  locations?: LocationItem[];
  additionalInfo?: string;
}

export default function DefaultServiceAreaSection({
  title = 'Območje Delovanja',
  description = 'Naše storitve diamantnega rezanja in vrtanja betona so vam na voljo širom Slovenije. Z veseljem se odzovemo na povpraševanja iz vseh slovenskih regij, pri čemer trenutno ne pokrivamo le območja Štajerske.',
  mapImage,
  locations = [
    { name: 'Osrednji Sloveniji (Ljubljana z okolico)' },
    { name: 'Gorenjska' },
    { name: 'Primorska' },
    { name: 'Notranjska' },
    { name: 'Dolenjska' },
    { name: '... ter drugod po Sloveniji (izven Štajerske)' }
  ],
  additionalInfo = 'Ne glede na vašo lokacijo, nas kontaktirajte za ponudbo!'
}: ServiceAreaSectionProps) {
  // Function to render text with parts wrapped in bold based on ** markers
  const renderWithBold = (text: string) => {
    // Split the text by ** markers
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove the ** markers and wrap in a strong tag
        const boldText = part.slice(2, -2);
        return <strong key={index}>{boldText}</strong>;
      }
      return part; // Return plain text parts as is
    });
  };

  // Process the image URL
  return (
    <ContainedSection 
      id="obmocje-delovanja" 
      bgColor="bg-background"
      verticalPadding="xl"
    >

        {/* Use SectionHeading component for title and description */}
        <SectionHeading>
            <SectionHeading.Title>{title}</SectionHeading.Title>
            {/* Description removed from here as it's rendered below */}
        </SectionHeading>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start w-full mt-8">
          {/* Map Image */}
          <MapWithCircleOverlay disableDefaultUI={true}></MapWithCircleOverlay>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed">
              {renderWithBold(description)}
            </p>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center rounded-full bg-orange-500 w-6 h-6"> 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">{location.name}</span>
                </div>
              ))}
            </div>
            
            <p className="mt-8 text-lg text-gray-800">
              {additionalInfo && renderWithBold(additionalInfo)}
            </p>
          </div>
        </div>

    </ContainedSection>
  );
}
