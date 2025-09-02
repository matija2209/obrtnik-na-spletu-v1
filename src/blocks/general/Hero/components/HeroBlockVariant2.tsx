import TitleSubtitle from '@/components/headings/title-subtitle'
import { ContainedSection } from '@/components/layout/container-section'
import FollowerIcons from '@/components/misc/follower-icons'
import type { Cta, HeroBlock, HighQualityMedia } from '@payload-types'
import { getBackgroundClass } from '@/utilities/getColorClasses'
import { cn } from '@/lib/utils'
import SectionHeading from '@/components/layout/section-heading'
import CtaButtons from '@/components/common/cta-buttons';
// import { getCtas, getImage } from '@/lib/payload'
// import { extractIdsFromNullable } from '@/utilities/extractIds'

const HeroBlockVariant2: React.FC<HeroBlock> = async (props) => {
  const { ctas, kicker, title, subtitle, images, includeFollowersBadge,bgc:backgroundColor,isTransparent } = props

  // With depth: 2, these are now populated objects, not IDs
  const backgroundImage = images && images.length > 0 ? images[0] as HighQualityMedia : null
  // CTAs are already populated objects
  const ctaObjects = ctas as Cta[] // Type assertion since TS still thinks it could be IDs
  // const colorClasses = getColorClasses(colourScheme as ColorScheme)
  // const backgroundClass = getBackgroundClass(colourScheme as ColorScheme,backgroundColor as any)

  
  const overlayClass = isTransparent ? 'bg-transparent' : getBackgroundClass(backgroundColor as any)
  // Return early only if essential content is missing
  // Make CTAs optional - hero can exist without CTAs
  if (!title && !subtitle) {
    return null
  }

  return (
    <ContainedSection 
      backgroundImage={backgroundImage}
      backgroundImagePreferredSize="hero-desktop-narrow"
      backgroundImageSizes="100vw"
      backgroundImagePriority={true}
      overlayClassName={overlayClass}
      // Because of the transparent navbar, we need to add padding to the top of the hero section
      verticalPadding='lg'
      sectionClassName="min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh]"
    >
      {/* Hero Section */}
      <div
        className="relative text-white flex items-center w-full md:w-2/3 min-h-[40vh] md:min-h-[50vh]"
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

{(title || subtitle) && <SectionHeading>
{title && <SectionHeading.Title size='hero' className='text-primary text-left mb-4' >
            {title}
</SectionHeading.Title>}
{subtitle && <SectionHeading.Description className='text-primary text-left '>  
            {subtitle}

</SectionHeading.Description>}
  </SectionHeading>}
          {includeFollowersBadge && (
            <div className="mb-12">
              <p className="text-sm font-semibold mb-2 text-amber-500">Stotine zadovoljnih strank</p>
              <FollowerIcons />
            </div>
          )}
          {ctaObjects && ctaObjects.length > 0 && (
            <CtaButtons
            ctas={ctaObjects}
            heroContext={true}
            variant='default'
            size='lg'
            />
          )}
        </div>
      </div>
    </ContainedSection>
  )
}

export default HeroBlockVariant2