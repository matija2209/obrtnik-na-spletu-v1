import React from 'react'
import Link from 'next/link'

import getFirstImage from '@/utilities/images/getFirstImage'
import { getImageUrl } from '@/utilities/images/getImageUrl'
import { HeroBlock } from '@payload-types'
import { ContainedSection } from '@/components/layout/container-section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import CtaButtons from '@/components/common/cta-buttons'
import { getBackgroundClass } from '@/utilities/getColorClasses'
import { cn } from '@/lib/utils'
import SectionHeading from '@/components/layout/section-heading'
import { extractIdsFromNullable } from '@/utilities/extractIds'
import { getImage } from '@/lib/payload'

const FollowerIcons = () => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
      >
        {String.fromCharCode(65 + i)}
      </div>
    ))}
  </div>
)

const DefaultHeroBlock: React.FC<HeroBlock> = async (props) => {
  const { ctas, kicker, title, subtitle, image, includeFollowersBadge, bgColor: backgroundColor, isTransparent } = props

  // Extract image IDs and fetch image data
  const imageIds = extractIdsFromNullable(image);
  const backgroundImage = imageIds.length > 0 ? await getImage(imageIds[0]) : null;
  const backgroundImageUrl = backgroundImage ? getImageUrl(backgroundImage, 'tablet') : undefined;

  const overlayClass = isTransparent ? 'bg-transparent' : getBackgroundClass(backgroundColor as any)
  
  // Return early only if essential content is missing
  // Make CTAs optional - hero can exist without CTAs
  if (!title && !subtitle) {
    return null
  }

  return (
    <ContainedSection 
      backgroundImage={backgroundImage}
      backgroundImagePreferredSize="tablet"
      backgroundImageSizes="100vw"
      backgroundImagePriority={true}
      overlayClassName={overlayClass}
      verticalPadding='3xl'
    >
      {/* Hero Section */}
      <div
        className="relative text-white flex items-center w-full md:w-2/3"
      >
        {/* Content */}
        <div className="animate-fade-in relative z-10 w-full">
        {kicker && (
          <p className={cn(
            "font-semibold text-sm tracking-wider uppercase",
            "text-primary",
            "mb-2"
          )}>
            {kicker}
          </p>
        )}

<SectionHeading>
<SectionHeading.Title size='hero' className='text-primary-foreground text-left mb-4' >
            {title}
</SectionHeading.Title>
<SectionHeading.Description className='text-primary-foreground text-left text-xl'>  
            {subtitle}

</SectionHeading.Description>
</SectionHeading>
          {includeFollowersBadge && (
            <div className="mt-8">
              <p className="text-sm font-semibold mb-2 text-amber-500">Stotine zadovoljnih strank</p>
              <FollowerIcons />
            </div>
          )}
          {ctas && ctas.length > 0 && (
            <CtaButtons
            variant={"default"}
            className='text-lg'
            ctas={ctas}
            size='lg'
            />
          )}
        </div>
      </div>
    </ContainedSection>
  )
}

export default DefaultHeroBlock