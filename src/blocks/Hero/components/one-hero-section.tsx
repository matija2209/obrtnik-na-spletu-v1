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
  ctas?:Cta[]
}

const OneHeroSection: React.FC<HeroProps> = ({
  title,
  subtitle,
  ctas,
  imageUrl
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
            title={title}
            subtitle={subtitle}
            ctas={ctas}
          />
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