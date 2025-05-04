import { ContainedSection } from '@/components/layout/container-section'
import { Button } from '@/components/ui/button'
import type { Cta, HeroBlock } from '@payload-types'
import Link from 'next/link'

type DefaultHeroBlockProps = {
  title: string;
  subtitle: string;
  ctas: Cta[];
}

function DefaultHeroBlock({title, subtitle, ctas}: DefaultHeroBlockProps) {

  return (
    <ContainedSection>

    </ContainedSection>
  )
}

export default DefaultHeroBlock