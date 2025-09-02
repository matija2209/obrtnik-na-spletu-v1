import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import { CtaBlock } from '@payload-types';
import { getBackgroundClass } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import { getCta, getCtas, getImage } from '@/lib/payload';
import { extractId, extractIds } from '@/utilities/extractIds';
import CtaButtons from '@/components/common/cta-buttons';

const CtaBlockVariant1: React.FC<CtaBlock> = async (props) => {
  const { 
    title, 
    cta:ctaId, 
    subtitle,
    bgc: backgroundColor,
    images,
    isTransparent,
    idHref
  } = props;

  if (!title) {
    return null; // Don't render if essential data is missing
  }

  const imageIds = extractIds(images || [])
  // Get color classes based on the selected scheme

  const backgroundClass = getBackgroundClass( backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;
  const backgroundImage = imageIds.length > 0 ? await getImage(imageIds[0]) : null

const cleanedCtaId = extractId(ctaId)

const cta = cleanedCtaId ? await getCta(cleanedCtaId) : null

  return (
    <ContainedSection
      id={idHref ?? "cta"}
      backgroundImage={backgroundImage}
      backgroundImagePreferredSize='tablet'
      backgroundImageSizes='100vw'
      backgroundImagePriority={true}
      overlayClassName={overlayClass}
      maxWidth="4xl"
      verticalPadding="xl"
      padding="lg"
    >
      <div className="text-center space-y-8">
        {/* Title with color-aware styling */}
        <h2 className={cn("w-full text-3xl font-bold", "text-primary")}>
          {title} 
          </h2>
        {subtitle && <div className={cn("w-full text-base max-md:max-w-full text-primary font-light")}>
            <p>{subtitle}</p>
          </div>}
        {cta && <CtaButtons variant='default' ctas={cta}></CtaButtons>}
      </div>
    </ContainedSection>
  );
};

export default CtaBlockVariant1;