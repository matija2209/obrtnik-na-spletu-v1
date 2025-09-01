import React from 'react';
import { Cta, HeroBlock } from '@payload-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ChevronRight, Home } from 'lucide-react';
import BreadcrumbComponent from './breadcrumb';
import CtaButton from '@/components/ui/cta-button';
import CtaButtons from '@/components/common/cta-buttons';
import { ContainedSection } from '@/components/layout/container-section';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import getFirstImage from '@/utilities/images/getFirstImage';
import { getImageUrl } from '@/utilities/images/getImageUrl';
import SectionHeading from '@/components/layout/section-heading';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getImage } from '@/lib/payload';

const HeroSectionVariant7: React.FC<HeroBlock> = async (props) => {
  const {
    kicker,
    title,
    subtitle,
    ctas,
    colourScheme,
    image,
    features,
    includeFollowersBadge,
    bgColor:backgroundColor,
    isTransparent,
    idHref,
  } = props;

  // Extract image IDs and fetch image data
  const imageIds = extractIdsFromNullable(image);
  const backgroundImage = imageIds.length > 0 ? await getImage(imageIds[0]) : null;
  const backgroundImageUrl = backgroundImage ? getImageUrl(backgroundImage, 'tablet') : undefined;

  // Get color classes using the utility
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'dark');
  const backgroundClass = getBackgroundClass(backgroundColor as any)
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass

  return (
    <ContainedSection
      id={idHref || 'hero'}
      backgroundImage={backgroundImage}
      backgroundImagePreferredSize="tablet"
      backgroundImageSizes="100vw"
      backgroundImagePriority={true}
      overlayClassName={overlayClass}
      maxWidth="7xl"
      className='mt-16'
      verticalPadding="xl"
      padding="none"
      // sectionClassName="min-h-[60vh] flex flex-col justify-center"
    >
      <div className='w-full md:w-2/3'>

      
      {/* Breadcrumb Navigation */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2">
         <BreadcrumbComponent  />
        </div>
      </nav>

      <div className="space-y-2">
        {/* Followers Badge */}
        {includeFollowersBadge && (
          <div>
            <Badge 
              variant="secondary" 
              className={cn(
                "px-3 py-1 text-xs font-medium backdrop-blur-sm",
              )}
            >
              <Users className="w-3 h-3 mr-1" />
              1000+ Completed Projects
            </Badge>
          </div>
        )}

        {/* Kicker */}
        {kicker && (
          <p className={cn(
            "font-semibold text-sm tracking-wider uppercase",
            "text-primary",
          )}>
            {kicker}
          </p>
        )}

<SectionHeading>
<SectionHeading.Title className='text-primary-foreground text-left' >
            {title}
</SectionHeading.Title>
<SectionHeading.Description className='text-primary-foreground text-left'>  
            {subtitle}

</SectionHeading.Description>
</SectionHeading>
        {/* Features */}
        {features && features.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center space-x-2 backdrop-blur-sm rounded-lg px-4 py-2",

                )}
              >
                <span className={cn(
                  "font-bold",

                )}>
                  {feature.iconText}
                </span>
                {feature.text && (
                  <span className={cn(
                    "text-sm font-medium",

                  )}>
                    {feature.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        {ctas && ctas.length > 0 && (
          <CtaButtons
            ctas={ctas as Cta[]}
            size='lg'
            variant='default'
          />
        )}
      </div>
      </div>
    </ContainedSection>
  );
};

export default HeroSectionVariant7;