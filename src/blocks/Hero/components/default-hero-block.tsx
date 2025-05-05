import TitleSubtitle from '@/components/headings/title-subtitle'
import { ContainedSection } from '@/components/layout/container-section'
import FollowerIcons from '@/components/misc/follower-icons'
import type { Cta, HeroBlock } from '@payload-types'


type DefaultHeroBlockProps = {
  title: string;
  subtitle: string;
  ctas: Cta[];
  imageUrl: string;
  kicker?: string;
  includeFollowersBadge: boolean;
}

function DefaultHeroBlock({title, subtitle, ctas, imageUrl, kicker, includeFollowersBadge}: DefaultHeroBlockProps) {

  return (
    <ContainedSection 
    backgroundImage={imageUrl} 
    verticalPadding='3xl'
    overlayClassName="bg-gradient-to-r from-black/60 via-black/30 to-transparent"
  >
    {/* Hero Section */}
    <div
      className="relative text-white flex items-center"
    >
      {/* Content */}
      <div className="container animate-fade-in mx-auto px-4 max-w-7xl relative z-10">
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
  </ContainedSection>
  )
}

export default DefaultHeroBlock