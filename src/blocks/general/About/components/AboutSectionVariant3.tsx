import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section';
import type { AboutBlock, Media, Cta as CtaType } from '@payload-types'; 
import { getImageUrl } from '@/utilities/images/getImageUrl';
import { Button } from '@/components/ui/button';
import RichText from '@/components/payload/RichText';
import * as LucideIcons from 'lucide-react';
import getFirstImage from '@/utilities/images/getFirstImage';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import CtaButtons from '@/components/common/cta-buttons';

const BenefitItem: React.FC<NonNullable<AboutBlock['benefits']>[number] & { colorClasses: ReturnType<typeof getColorClasses> }> = ({ 
  title, 
  description, 
  icon, 
  colorClasses 
}) => {
  // Dynamically get the icon component
  const IconComponent = icon && (LucideIcons as any)[icon] ? (LucideIcons as any)[icon] : null;

  return (
    <article className="flex flex-col flex-1 shrink px-8 rounded-3xl basis-0 min-w-60 max-md:px-5 max-sm:justify-center max-sm:items-center">
      {IconComponent && (
        <div className="flex justify-center mb-4">
          <IconComponent className={cn("w-10 h-10", colorClasses.accentClass)} />
        </div>
      )}
      <h3 className={cn("mt-4 w-full text-center text-lg leading-tight", colorClasses.textClass)}>
        {title}
      </h3>
      {description && (
        <p className={cn("mt-2 text-center text-sm opacity-80", colorClasses.textClass)}>
          {description}
        </p>
      )}
    </article>
  );
};

const BenefitsList: React.FC<Pick<AboutBlock, 'benefits'> & { colorClasses: ReturnType<typeof getColorClasses> }> = ({ 
  benefits, 
  colorClasses 
}) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="grid grid-cols-4 gap-4 mt-12">
      {benefits.map((benefit, index) => (
        <BenefitItem
          key={index}
          title={benefit.title}
          description={benefit.description}
          icon={benefit.icon}
          colorClasses={colorClasses}
        />
      ))}
    </section>
  );
};

const AboutContent: React.FC<Pick<AboutBlock, 'subtitle' | 'title' | 'description' | 'benefits' | 'ctas'> & { 
  colorClasses: ReturnType<typeof getColorClasses> 
}> = ({ 
  subtitle, 
  title, 
  description, 
  benefits, 
  ctas,
  colorClasses 
}) => {
  return (
    <div className="flex relative flex-col justify-center items-center">
      <section className="flex flex-col items-center w-full text-center">
        <header className="flex flex-col w-full font-semibold">
          {subtitle && (
            <p className={cn("self-center text-base", colorClasses.accentClass)}>
              {subtitle}
            </p>
          )}
          {title && (
            <h1 className={cn(
              "mt-2 text-5xl leading-tight max-md:max-w-full max-md:text-4xl max-sm:text-3xl",
              colorClasses.textClass
            )}>
              {title}
            </h1>
          )}
        </header>
        {description && (
          <div className={cn(
            "mt-8 w-full text-lg leading-7 max-md:max-w-full max-sm:text-base",
            colorClasses.textClass
          )}>
            <RichText 
              enableProse={false} 
              data={description} 
              className={cn("prose", colorClasses.textClass)} 
            />
          </div>
        )}
        <BenefitsList benefits={benefits} colorClasses={colorClasses} />
      </section>
      <CtaButtons className='mt-8' ctas={ctas}></CtaButtons>
    </div>
  );
};

// Main About Section Component
export default function AboutSectionVariant3(props: AboutBlock) {
  const { 
    title, 
    subtitle, 
    description, 
    image, 
    benefits, 
    ctas, 
    idHref,
    colourScheme,
    bgColor: backgroundColor,
    isTransparent
  } = props;

  // Get color classes based on the selected scheme
  const colorClasses = getColorClasses((colourScheme as ColorScheme) || 'primary');
  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Get background image for ContainedSection
  const backgroundImage = image && image.length > 0 ? getImageUrl(getFirstImage(image)) : undefined;

  return (
    <ContainedSection
      id={idHref ?? "o-nas"}
      overlayClassName={backgroundImage ? overlayClass : overlayClass}
      backgroundImage={backgroundImage}
      verticalPadding="xl"
      padding="lg"
      maxWidth="7xl"
    >
      <AboutContent 
        subtitle={subtitle}
        title={title}
        description={description}
        benefits={benefits}
        ctas={ctas}
        colorClasses={colorClasses}
      />
    </ContainedSection>
  );
}