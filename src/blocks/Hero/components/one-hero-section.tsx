import React from 'react';
import { ContainedSection } from '@/components/layout/container-section';
import FollowerIcons from '@/components/misc/follower-icons';
import TitleSubtitle from '@/components/headings/title-subtitle';
import { Cta, Media } from '@payload-types';

import Image from 'next/image';

const reviewLink = "https://search.google.com/local/writereview?placeid=ChIJq2Y3G3QyZUcRfDWJZ6f8-KI";

interface HeroProps {
  ctaHref?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctas?:Cta[];
  kicker?: string;
  includeFollowersBadge: boolean;
}

const OneHeroSection: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctas,
  imageUrl,
  kicker,
  includeFollowersBadge,
}) => {

  
  return (
    <ContainedSection 
      backgroundImage={imageUrl} 
      verticalPadding='3xl'
      contentBgColor="bg-white" // This controls the left side's background
      halfWidthImageOnDesktop={true}
    >
      {/* Hero Section */}
      <div
        className="relative flex items-center"
      >
        {/* Content */}
    <div className='w-full md:w-1/2'>

          <TitleSubtitle
            preTitle={kicker}
            title={title}
            subtitle={subtitle}
            ctas={ctas}
          />
          {includeFollowersBadge && (
            <div className="mt-8">
              <p className="text-sm font-semibold mb-2 text-amber-500">Stotine zadovoljnih strank</p>
              <FollowerIcons />
            </div>
          )}
    </div>
      </div>
      {
        imageUrl && (
          <Image className='block md:hidden mt-8 rounded-lg' src={imageUrl} alt={title ?? "Kopac izkopavanja"} width={1000} height={1000} />
        )
      }
    </ContainedSection>
  );
};

export default OneHeroSection;