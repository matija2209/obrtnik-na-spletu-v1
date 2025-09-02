import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section';
import type { ServicesBlock, Service, Media } from '@payload-types';
import { Button } from '@/components/ui/button';
import RichText from '@/components/payload/RichText';
import { getImageUrl } from '@/utilities/images/getImageUrl';
import getFirstImage from '@/utilities/images/getFirstImage';
import getImageAlt from '@/utilities/images/getImageAlt';
import { getIconComponent } from '@/utilities/getIcon';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SectionHeading from '@/components/layout/section-heading';
import OptimizedImage from '@/components/OptimizedImage';
import CtaButtons from '@/components/common/cta-buttons';
import { ArrowRightIcon } from 'lucide-react';
import { getServices } from '@/lib/payload';
import { extractIdsFromNullable } from '@/utilities/extractIds';

const ServicesGrid: React.FC<{ 
  selectedServices: Service[]; 
  colorClasses?: ReturnType<typeof getColorClasses> 
}> = ({ selectedServices, colorClasses }) => {
  if (!selectedServices || selectedServices.length === 0) return null;

  return (
    <div className="w-full max-md:max-w-full">
      {/* Services List */}
      {selectedServices.length > 0 && (
        <div className="w-full space-y-32  md:space-y-16 lg:space-y-32">
          {selectedServices.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).map((service, index) => {
            // Alternate layout on desktop, stack on mobile
            const isEven = index % 2 === 0;
            const desktopOrder = isEven ? 'md:flex-row' : 'md:flex-row-reverse';
            
            return (
              <div key={service.id || index} className={`flex flex-col ${desktopOrder} items-center gap-4 md:gap-8 lg:gap-12`}>
                {/* Image Grid Section */}
                <div className='w-full md:w-2/5 relative px-4 md:px-0'>
                  <div className='grid grid-cols-12 gap-1 md:gap-2'>
                    <OptimizedImage 
                      className='col-span-8' 
                      image={service.images?.[0] as Media} 
                      alt={getImageAlt(service.images?.[0] as Media)} 
                    />
                    <OptimizedImage 
                      className='col-span-4 row-span-1' 
                      image={service.images?.[1] as Media} 
                      alt={getImageAlt(service.images?.[1] as Media)} 
                    />
                  </div>
                  
                  {/* Overlapping image - positioned absolutely */}
                  <div className='absolute -bottom-8 right-0 z-10 w-1/2'>
                  <OptimizedImage 
      className='  border-t-10 border-l-10 border-white' 
      image={service.images?.[2] as Media} 
      alt={getImageAlt(service.images?.[2] as Media)} 
                    />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className='w-full md:w-3/5 px-4 md:px-0 mt-8 md:mt-0'>
                <div className='uppercase mb-3 text-accent font-bold text-xs'>
                Unsere Leistungen
                </div>
                  <div className='space-y-4 md:space-y-6'>
                    {service.title && service.excerpt && <SectionHeading>
                      {service.title && <SectionHeading.Title size='small' className='text-left'> {service.title} </SectionHeading.Title>}
                      {service.excerpt && <SectionHeading.Description className='text-left'> {service.excerpt} </SectionHeading.Description>}
                    </SectionHeading>}
                    <Link href={`/leistungen/${service.slug}`}>
                      <Button className='bg-black text-accent'>
                        {service.ctaText}
                      <ArrowRightIcon className='w-4 h-4' />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Main Component
export default async function ServicesBlockVariant1(props: ServicesBlock) {
  const { 
    selectedServices: selectedServiceIds, 
    title, 
    description, 
    idHref,
    bgc: backgroundColor,
    isTransparent
  } = props;

  // Extract IDs and fetch services
  const serviceIds = extractIdsFromNullable(selectedServiceIds);
  const selectedServices = serviceIds.length > 0 ? await getServices(serviceIds) : [];

  // Get color classes and background styling
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection 
      id={idHref ?? "services"}
      overlayClassName={overlayClass}
      verticalPadding="2xl"
    >
      <SectionHeading>
        <SectionHeading.Title >
          {title}
        </SectionHeading.Title>
        <SectionHeading.Description>
          {description}
        </SectionHeading.Description>
      </SectionHeading>
      <ServicesGrid selectedServices={selectedServices as Service[]} />
      {/* <BenefitsList benefits={benefits} /> */}
    </ContainedSection>
  );
}