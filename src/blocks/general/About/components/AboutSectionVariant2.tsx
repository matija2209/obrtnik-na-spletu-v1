import React from 'react';
import PayloadImage from '@/components/ui/PayloadImage';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import type { AboutBlock, Media, Cta as CtaType } from '@payload-types'; 
import { getImageUrl } from '@/utilities/images/getImageUrl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import RichText from '@/components/payload/RichText';
import getImageAlt from '@/utilities/images/getImageAlt';
import getFirstImage from '@/utilities/images/getFirstImage';
import { getBackgroundClass } from '@/utilities/getColorClasses';
import CtaButtons from '@/components/common/cta-buttons';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getImage } from '@/lib/payload';

export default async function AboutSectionVariant2(props: AboutBlock) {
  const { 
    title, 
    subtitle, 
    description, 
    image, 
    isInverted, 
    ctas,
    bgColor: backgroundColor,
    isTransparent,
    idHref 
  } = props;

  // Extract image IDs and fetch image data
  const imageIds = extractIdsFromNullable(image);
  const firstImage = imageIds.length > 0 ? await getImage(imageIds[0]) : null;
  const imageSrc = firstImage ? getImageUrl(firstImage) : undefined;
  const imageAlt = firstImage ? getImageAlt(firstImage, title ?? "") : "";
  
  // Get background image URL for ContainedSection (if you want the second image as background)
  const backgroundImageUrl = imageIds.length > 1 ? 
    await getImage(imageIds[1]).then(img => img ? getImageUrl(img) : undefined) : 
    undefined;

  // Get color classes based on the selected scheme
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection 
      id={idHref ?? "o-nas"}
      verticalPadding="xl"
      overlayClassName={backgroundImageUrl ? overlayClass : overlayClass}
      backgroundImage={backgroundImageUrl ? { url: backgroundImageUrl } as any : undefined}
      maxWidth="7xl"
      padding="lg"
    > 
      <div className="flex flex-col md:flex-row gap-14 h-full">
        <div
          className={cn(
            "w-full h-full md:w-1/2 relative flex items-center",
            isInverted ? "md:order-last" : "md:order-first"
          )}
        >
          {imageSrc && firstImage && (
            <div className="relative w-full mx-auto">
              <PayloadImage
                image={firstImage}
                alt={imageAlt}
                className="w-full h-auto object-cover rounded-lg"
                context="card"
                priority={true}
              />
            </div>
          )}
        </div>

        <div className={cn("w-full md:w-1/2 space-y-6")}>
          <SectionHeading className="items-start mb-2">
            {subtitle && (
              <SectionHeading.Description 
                className={cn(
                  "text-left text-md text-primary tracking-wider mb-2 uppercase", 
                )}
              >
                {subtitle}
              </SectionHeading.Description>
            )}
            {title && (
              <SectionHeading.Title 
                className={cn("text-left")}
              >
                {title}
              </SectionHeading.Title>
            )}
          </SectionHeading>
          
          {description && (
            <div className={cn("prose max-w-none")}>
              <RichText 
                enableProse={false} 
                data={description} 
              />
            </div>
          )}
          
          {ctas && ctas.length > 0 && (
            <CtaButtons ctas={ctas}></CtaButtons>
          )}
        </div>
      </div>
    </ContainedSection>
  );
}