import { ContainedSection } from '@/components/layout/container-section'
import { Button } from '@/components/ui/button'
import type { Cta, HeroBlock } from '@payload-types'
import Link from 'next/link'

function DefaultHeroBlock({block}: {block: HeroBlock}) {
  return (
    <ContainedSection>
      <h1>{block.title}</h1>
      <p>{block.subtitle}</p>
      {block.ctas && block.ctas.map((cta:Cta,index:number)=>{
        return (
            <Button key={index} href={cta.ctaHref} variant={cta.ctaType ?? "default"}>
<Link href={cta.ctaHref}>{cta.ctaText}</Link>
            </Button>
        )
      }) }
    </ContainedSection>
  )
}

export default DefaultHeroBlock