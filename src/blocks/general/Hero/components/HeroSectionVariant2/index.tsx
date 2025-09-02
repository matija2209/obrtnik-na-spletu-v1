import React from 'react';
import { Cta, HeroBlock } from '@payload-types';
import { ContainedSection } from '@/components/layout/container-section';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { extractIdsFromNullable } from '@/utilities/extractIds';
import { getImage } from '@/lib/payload';
import { getImageUrl } from '@/utilities/images/getImageUrl';
import CtaButtons from '@/components/common/cta-buttons';

const HeroSectionVariant2: React.FC<HeroBlock> = async (props) => {
  const {
    title,
    subtitle,
    ctas,
    colourScheme,
    image,
    bgColor: backgroundColor,
    isTransparent,
    idHref,
  } = props;

  // Extract image IDs and fetch image data
  const imageIds = extractIdsFromNullable(image);
  const heroImages = imageIds.length > 0 ? await Promise.all(
    imageIds.slice(0, 6).map(id => getImage(id))
  ) : [];

  // Get color classes using the utility
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'dark');
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : 'bg-[#e9fbfe]';

  return (
    <ContainedSection
      id={idHref || 'hero'}
      overlayClassName={overlayClass}
      maxWidth="7xl"
      className='mt-16'
      verticalPadding="xl"
      padding="none"
    >
      <div className="box-border content-stretch flex flex-col gap-20 items-center justify-start px-16 py-0 relative w-full">
        <div className="basis-0 content-stretch flex grow items-center justify-start min-h-px min-w-px relative shrink-0 w-full">
          <div className="basis-0 box-border content-stretch flex flex-col gap-10 grow h-full items-start justify-center min-h-px min-w-px pl-0 pr-20 py-0 relative shrink-0">
            <div className="content-stretch flex flex-col gap-5 items-start justify-start leading-[0] relative shrink-0 w-full">
              {title && (
                <div className="font-bold relative shrink-0 text-[#1d2020] text-4xl lg:text-6xl w-full">
                  <p className="leading-tight">{title}</p>
                </div>
              )}
              {subtitle && (
                <div className="font-light italic relative shrink-0 text-[#555555] text-lg w-full">
                  <p className="leading-relaxed">{subtitle}</p>
                </div>
              )}
            </div>
            {ctas && ctas.length > 0 && (
              <div className="box-border content-stretch flex gap-4 items-start justify-start pb-0 pt-4 px-0 relative shrink-0">
                <CtaButtons
                  ctas={ctas as Cta[]}
                  size='lg'
                  variant='default'
                />
              </div>
            )}
          </div>
          
          {/* Image Gallery */}
          {heroImages.length > 0 && (
            <div className="basis-0 content-stretch flex gap-4 grow h-[700px] items-start justify-start min-h-px min-w-px relative shrink-0">
              <div className="absolute content-stretch flex flex-col gap-4 h-[1052px] items-start justify-start left-[51.37%] right-0 top-0">
                {heroImages.slice(0, 3).map((img, index) => (
                  <div 
                    key={index}
                    className="bg-center bg-cover bg-no-repeat h-[340px] rounded-[8px] shrink-0 w-full"
                    style={{ 
                      backgroundImage: `url('${img ? getImageUrl(img, 'tablet') : ''}')` 
                    }}
                  />
                ))}
              </div>
              <div className="absolute content-stretch flex flex-col gap-4 h-[1052px] items-start justify-start left-0 right-[51.37%] top-[-152px]">
                {heroImages.slice(3, 6).map((img, index) => (
                  <div 
                    key={index + 3}
                    className="bg-center bg-cover bg-no-repeat h-[340px] rounded-[8px] shrink-0 w-full"
                    style={{ 
                      backgroundImage: `url('${img ? getImageUrl(img, 'tablet') : ''}')` 
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ContainedSection>
  );
};

export default HeroSectionVariant2;