import React from 'react';
import SectionHeading from '@/components/layout/section-heading';
import { ContainedSection } from '@/components/layout/container-section';
import { CtaBlock } from '@payload-types';
import RichText from '@/components/payload/RichText';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import CtaButtons from '@/components/common/cta-buttons';
import { extractId } from '@/utilities/extractIds';
import { getCta } from '@/lib/payload';

const DefaultServiceCtaSection: React.FC<CtaBlock> = async (props) => {
  const { 
    title, 
    cta, 
    description, 
    colourScheme,
    bgColor: backgroundColor,
    isTransparent,
    idHref
  } = props;

  if (!title || !cta) {
    return null; // Don't render if essential data is missing
  }

  // Extract CTA ID and fetch CTA data
  const ctaId = extractId(cta);
  const ctaData = ctaId ? await getCta(ctaId) : null;

  if (!ctaData) {
    return null;
  }

  // Get color classes based on the selected scheme
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  return (
    <ContainedSection
      id={idHref ?? "cta"}
      overlayClassName={overlayClass}
      maxWidth="4xl"
      verticalPadding="xl"
      padding="lg"
    >
      <div className="text-center space-y-8">
        {/* Title with color-aware styling */}
        <h2 className={cn("w-full text-3xl font-bold", "text-primary-foreground")}>
          {title} 
        </h2>
        {description && <div className={cn("w-full text-base max-md:max-w-full text-primary-foreground")}>
            <RichText enableProse={false} data={description} />
          </div>}
        <CtaButtons variant='secondary' ctas={[ctaData]}></CtaButtons>
      </div>
    </ContainedSection>
  );
};

export default DefaultServiceCtaSection;