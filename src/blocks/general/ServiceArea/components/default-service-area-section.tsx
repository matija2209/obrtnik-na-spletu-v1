import React from 'react';
import Image from 'next/image';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';

import { Media, ServiceAreaBlock } from '@payload-types';
import MapWithCircleOverlay from '@/components/misc/map-with-circle-overlay';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { getBusinessInfo, getTenantIdBySlug } from '@/lib/payload';
import { cookies } from 'next/headers';

export default async function DefaultServiceAreaSection(props: ServiceAreaBlock) {
  const {
    title,
    subtitle,
    locations,
    showMap,
    blockType,
    idHref,
    id,
    template,
    bgc: backgroundColor,
    isTransparent
  } = props;
  const cookieStore = await cookies()
  const tenantId = cookieStore.get('current-tenant')?.value

  // Get color classes and background styling

  const backgroundClass = getBackgroundClass( backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;
  const tenantIdNumber = await getTenantIdBySlug(tenantId as string)
  const businessInfo = await getBusinessInfo(tenantIdNumber as number)

  // Process the image URL
  return (
    <ContainedSection 
      id="obmocje-delovanja" 
      overlayClassName={overlayClass}
      verticalPadding="xl"
    >

        {/* Use SectionHeading component for title and description */}
        <SectionHeading>
            <SectionHeading.Title>{title}</SectionHeading.Title>
            {/* Description removed from here as it's rendered below */}
        </SectionHeading>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start w-full mt-8">
          {/* Map Image */}
          <MapWithCircleOverlay lat={businessInfo?.coordinates.latitude} lng={businessInfo?.coordinates.longitude} radius={businessInfo?.radius} disableDefaultUI={true}></MapWithCircleOverlay>

          {/* Content */}
          <div className="flex flex-col gap-6">
              {subtitle && (
            <p className={cn("text-lg leading-relaxed")}>
              {subtitle}
            </p>
              )}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
              {locations && locations.map((location, index) => {
                if (typeof location === 'number') return null;
                return (
                  (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 text-primary">
                        <div className={cn("flex items-center justify-center rounded-full w-6 h-6")}> 
                          <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4 ")} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <span className={cn("font-light")}>{location.name}</span>
                    </div>
                  )
                )
              })}
            </div>
          </div>
        </div>

    </ContainedSection>
  );
}
