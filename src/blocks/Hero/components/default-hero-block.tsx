import { ContainedSection } from '@/components/layout/container-section'
import { Button } from '@/components/ui/button'
import type { Cta, HeroBlock } from '@payload-types'
import Link from 'next/link'

function DefaultHeroBlock({...block}: HeroBlock) {
  const {title, subtitle, ctas} = block
  return (
    <ContainedSection>
      <h1>{block.title}</h1>
      <p>{block.subtitle}</p>
      
    </ContainedSection>
  )
}

export default DefaultHeroBlock