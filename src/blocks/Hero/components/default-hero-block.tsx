import TitleSubtitle from '@/components/headings/title-subtitle'
import { ContainedSection } from '@/components/layout/container-section'
import FollowerIcons from '@/components/misc/follower-icons'
import { Button } from '@/components/ui/button'
import type { Cta, HeroBlock } from '@payload-types'
import Link from 'next/link'

type DefaultHeroBlockProps = {
  title: string;
  subtitle: string;
  ctas: Cta[];
  imageUrl: string;
}

function DefaultHeroBlock({title, subtitle, ctas, imageUrl}: DefaultHeroBlockProps) {

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
          preTitle="+27 LET IZKUŠENJ"
          title="Profesionalno Rezanje in Vrtanje Betona po Sloveniji"
          subtitle="Zanesljive in natančne rešitve za vaše gradbene projekte"
          ctas={ctas}
        />
        <div className="mt-8">
          <p className="text-sm font-semibold mb-2 text-amber-500">Stotine zadovoljnih strank</p>
          <FollowerIcons />
        </div>
      </div>
    </div>
  </ContainedSection>
  )
}

export default DefaultHeroBlock