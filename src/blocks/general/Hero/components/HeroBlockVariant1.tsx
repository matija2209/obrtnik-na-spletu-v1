import { ContainedSection } from '@/components/layout/container-section'
import FollowerIcons from '@/components/misc/follower-icons'
import type { Cta, HeroBlock, HighQualityMedia } from '@payload-types'
import { getBackgroundClass } from '@/utilities/getColorClasses'
import { cn } from '@/lib/utils'
import SectionHeading from '@/components/layout/section-heading'
import CtaButtons from '@/components/common/cta-buttons';


const HeroBlockVariant1: React.FC<HeroBlock> = async (props) => {
  const { ctas, kicker, title, subtitle, images, includeFollowersBadge,bgc:backgroundColor,isTransparent } = props
  
  // Extract IDs from potentially mixed arrays
  // const imageIds = extractIdsFromNullable(images)
  // const ctaIds = extractIdsFromNullable(ctasIds)
  
  // Fetch data based on IDs
  // const backgroundImage = imageIds.length > 0 ? await getImage(imageIds[0],"highQualityMedia") : null
  // const ctas = ctaIds.length > 0 ? await getCtas(ctaIds) : null
  const backgroundImage = images && images.length > 0 ? images[0] as HighQualityMedia : null

  // Process image

  // const colorClasses = getColorClasses(colourScheme as ColorScheme)
  // const backgroundClass = getBackgroundClass(colourScheme as ColorScheme,backgroundColor as any)

  
  const overlayClass = isTransparent ? 'bg-transparent' : getBackgroundClass(backgroundColor as any)
  // Return early only if essential content is missing
  // Make CTAs optional - hero can exist without CTAs
  if (!title && !subtitle) {
    return null
  }

  return (
    <>
    <ContainedSection 
      backgroundImage={backgroundImage}
      backgroundImagePreferredSize="hero-desktop"
      backgroundImageSizes="100vw"
      backgroundImagePriority={true}
      overlayClassName={overlayClass}
      verticalPadding='3xl'
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
{subtitle && <SectionHeading.Description className='text-primary text-left text-xl'>  
            {subtitle}

</SectionHeading.Description>}
  </SectionHeading>}
          {includeFollowersBadge && (
            <div className="mb-12">
              <p className="text-sm font-semibold mb-2 text-amber-500">Stotine zadovoljnih strank</p>
              <FollowerIcons />
            </div>
          )}
          {ctas && ctas.length > 0 && (
            <CtaButtons
              
              ctas={ctas as Cta[]}
              size='lg'
              heroContext={true}
            />
          )}
        </div>
      </div>
    </ContainedSection>
    </>
  )
}

export default HeroBlockVariant1