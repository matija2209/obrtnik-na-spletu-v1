import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContainedSection } from '@/components/layout/container-section';
import type { AboutBlock, Media, Cta as CtaType, Cta } from '@payload-types'; 
import { getImageUrl } from '@/utilities/images/getImageUrl';
import { Button } from '@/components/ui/button';
import RichText from '@/components/payload/RichText';
import * as LucideIcons from 'lucide-react';
import getFirstImage from '@/utilities/images/getFirstImage';
import { getBackgroundClass, getColorClasses, type ColorScheme } from '@/utilities/getColorClasses';
import { cn } from '@/lib/utils';
import CtaButtons from '@/components/common/cta-buttons';
import { getCtas, getImage } from '@/lib/payload';

const BenefitItem: React.FC<NonNullable<AboutBlock['benefits']>[number]> = ({ 
  title, 
  description, 
  icon, 
}) => {
  // Dynamically get the icon component
  const IconComponent = icon && (LucideIcons as any)[icon] ? (LucideIcons as any)[icon] : null;

  return (
    <article className="flex flex-col flex-1 shrink px-8 rounded-3xl basis-0 min-w-60 max-md:px-5 max-sm:justify-center max-sm:items-center">
      {IconComponent && (
        <div className="flex justify-center mb-4  text-primary">
          <IconComponent className={cn("w-10 h-10")} />
        </div>
      )}
      <h3 className={cn("mt-4 w-full text-center text-lg leading-tight  text-primary")}>
        {title}
      </h3>
      {description && (
        <p className={cn("mt-2 text-center text-sm opacity-80  text-primary" )}>
          {description}
        </p>
      )}
    </article>
  );
};

const BenefitsList: React.FC<Pick<AboutBlock, 'benefits'>> = ({ 
  benefits, 

}) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center mt-12">
      {benefits.map((benefit, index) => (
        <BenefitItem
          key={index}
          title={benefit.title}
          description={benefit.description}
          icon={benefit.icon}

        />
      ))}
    </section>
  );
};

const AboutContent: React.FC<Pick<AboutBlock, 'kicker' | 'title' | 'description' | 'benefits'> & {ctas: CtaType[] | null}> = ({ 
  kicker, 
  title, 
  description, 
  benefits, 
  ctas,
}) => {
  return (
    <div className="flex relative flex-col justify-center items-center">
      <section className="flex flex-col items-center w-full text-center">
        <header className="flex flex-col w-full font-semibold">
          {kicker && (
            <p className={cn("self-center text-base text-accent")}>
              {kicker}
            </p>
          )}
          {title && (
            <h1 className={cn(
              "mt-2 text-5xl leading-tight max-md:max-w-full max-md:text-4xl max-sm:text-3xl text-primary",

            )}>
              {title}
            </h1>
          )}
        </header>
        {description && (
          <div className={cn(
            "mt-8 w-full text-lg leading-7 max-md:max-w-full max-sm:text-base  text-primary",

          )}>
            <RichText 
              enableProse={false} 
              data={description} 
              className={cn("prose", )} 
            />
          </div>
        )}
        <BenefitsList benefits={benefits} />
      </section>
      <div className='mt-12'>
        {ctas && <CtaButtons heroContext={true} ctas={ctas} />}
      </div>
    </div>
  );
};

// Main About Section Component
export default async function AboutBlockVariant1(props: AboutBlock) {
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


  const backgroundImage = image && image.length > 0 ? image[0] as Media : null


  

  // Get color classes based on the selected scheme

  const backgroundClass = getBackgroundClass(backgroundColor as any);
  const overlayClass = isTransparent ? 'bg-transparent' : backgroundClass;

  // Get background image for ContainedSection


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

      />
    </ContainedSection>
  );
}