import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section';
import type { AboutBlock, Media, Cta as CtaType, HighQualityMedia, Cta } from '@payload-types'; 
import { getImageUrl } from '@/utilities/images/getImageUrl';
import { Button } from '@/components/ui/button';
import RichText from '@/components/payload/RichText';
import * as LucideIcons from 'lucide-react';
import getFirstImage from '@/utilities/images/getFirstImage';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import CtaButtons from '@/components/common/cta-buttons';
import OptimizedImage from '@/components/OptimizedImage';
import SectionHeading from '@/components/layout/section-heading';
import { getCtas, getImage } from '@/lib/payload';
import { extractIdsFromNullable } from '@/utilities/extractIds';

const BenefitItem: React.FC<NonNullable<AboutBlock['benefits']>[number]> = ({ 
  title, 
  description, 
  icon, 
}) => {
  // Dynamically get the icon component
  const IconComponent = LucideIcons["Check"]

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex-shrink-0">
        <div className="flex items-center justify-center rounded-full bg-accent w-5 h-5">
          {IconComponent ? (
            <IconComponent className="w-3 h-3 text-white" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-md">{title}</h3>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};

const BenefitsList: React.FC<Pick<AboutBlock, 'benefits'>> = ({ 
  benefits, 
}) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      {benefits.map((benefit, index) => (
        <BenefitItem
          key={index}
          title={benefit.title}
          description={benefit.description}
          icon={benefit.icon}
        />
      ))}
    </div>
  );
};

const AboutContent: React.FC<Pick<AboutBlock, 'kicker' | 'title' | 'description' | 'benefits'> & {
  ctas: CtaType[] | null;
  image: Media | HighQualityMedia | null;
}> = ({ 
  kicker, 
  title, 
  description, 
  benefits, 
  ctas,
  image
}) => {
  // Image is already fetched and passed as prop
  const displayImage = image


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <OptimizedImage
image={displayImage}
alt={displayImage?.alt || title || 'About image'}
className="object-cover object-center"
priority></OptimizedImage>

      {/* Content Column */}
      <div className={cn("flex flex-col")}>
        <div className={cn("flex flex-col")}>
          {kicker && (
            <p className={cn("text-base font-semibold text-accent uppercase")}>
              {kicker}
            </p>
          )}
          <SectionHeading className='mb-4'>
            <SectionHeading.Title  className='mb-0 text-left'>
              {title}
            </SectionHeading.Title>
          </SectionHeading>
          {description && (
            <div className={cn(
              "text-lg leading-7 text-gray-600 max-md:text-base"
            )}>
              <RichText 
                enableProse={false} 
                data={description} 
                className={cn("prose prose-gray")} 
              />
            </div>
          )}
        </div>
        
        <BenefitsList benefits={benefits} />
        
        {ctas && ctas.length > 0 && (
          <div className='mt-12'>
            <CtaButtons ctas={ctas} />
          </div>
        )}
      </div>
    </div>
  );
};

// Main About Section Component
export default async function AboutBlockVariant2(props: AboutBlock) {
  const { 
    title, 
    kicker,
    subtitle, 
    description, 
    image, 
    benefits, 
    ctas, 
    idHref,
    bgc: backgroundColor,
    isTransparent
  } = props;
  
  // Fetch data based on IDs - use regular media collection to match type
  const fetchedImage = image && image.length > 0 ? image[0] as Media : null

  // Get color classes based on the selected scheme
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // For this design, we don't use the image as background but as content
  // So we pass undefined for backgroundImage
  const backgroundImage = undefined;

  return (
    <ContainedSection
      id={idHref ?? "o-nas"}
      overlayClassName={overlayClass}
      backgroundImage={backgroundImage}
      verticalPadding="xl"
      padding="lg"
      maxWidth="7xl"
    >
      <AboutContent 
        kicker={kicker}
        title={title}
        description={description}
        benefits={benefits}
        ctas={ctas as Cta[]}
        image={fetchedImage}
      />
    </ContainedSection>
  );
}