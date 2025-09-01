import React from 'react';
import PayloadImage from '@/components/ui/PayloadImage';
import { ContainedSection } from '@/components/layout/container-section';
import SectionHeading from '@/components/layout/section-heading';
import type { AboutBlock, Cta } from '@payload-types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getImageUrl } from '@/utilities/images/getImageUrl';
import getFirstImage from '@/utilities/images/getFirstImage';
import getImageAlt from '@/utilities/images/getImageAlt';
import RichText from '@/components/payload/RichText';
import CtaButtons from '@/components/common/cta-buttons';
import { ColorScheme, getBackgroundClass, getColorClasses } from '@/utilities/getColorClasses';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getCtasByIds, getImage } from '@/lib/payload';


export default async function DefaultAboutMeSection(props: AboutBlock) {
  const { title, subtitle, ctas, image, description, colourScheme, bgColor: backgroundColor, isTransparent, idHref } = props

  // Extract image IDs and fetch image data
  const imageIds = extractIdsFromNullable(image);
  const imageData = imageIds.length > 0 ? await Promise.all(imageIds.map(id => getImage(id))) : [];
  
  const firstImage = getFirstImage(imageData)
  const imageUrl = getImageUrl(firstImage)
  const imageAlt = getImageAlt(firstImage,title ?? "")

  // Process color classes
  const colorClasses = getColorClasses(colourScheme as ColorScheme);
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Extract IDs and fetch CTA data
  const ctaIds = extractIdsFromNullable(ctas);
  const ctaData = ctaIds.length > 0 ? await getCtasByIds(ctaIds) : [];

  return (
    <ContainedSection 
      id={idHref ?? "o-nas"} 
      backgroundImage={imageUrl}
      verticalPadding="xl"
      overlayClassName={overlayClass}
    >
      <div className='space-y-6'>
        <SectionHeading>
          <SectionHeading.Title className={`p-2 ${colorClasses.textClass}`}>{title}</SectionHeading.Title>
        </SectionHeading>
        <p className={`text-left md:text-center ${colorClasses.textClass}`}>
          {subtitle}
        </p>
       {description && <div className=''>
          <RichText data={description} className={colorClasses.textClass}></RichText>
        </div>}
       <CtaButtons ctas={ctaData}></CtaButtons>
      </div>
    </ContainedSection>
  );
} 