import React, { Fragment } from 'react'
import AboutBlock from '@/blocks/general/About/components'
import ContactBlock from '@/blocks/general/Contact/components'
import FAQBlock from '@/blocks/general/FAQ/components'
import GalleryBlock from '@/blocks/general/Gallery/components'
import HeroBlock from '@/blocks/general/Hero/components'
import MachineryBlock from '@/blocks/general/Machinery/components'
import ProjectHighlightsBlock from '@/blocks/general/ProjectHighlights/components'
import ServiceAreaBlock from '@/blocks/general/ServiceArea/components'
import ServicesBlock from '@/blocks/general/Services/components'
import TestimonialsBlock from '@/blocks/general/Testimonials/components'
import ServicesHeroBlock from '@/blocks/services/Hero/components'
import ServicesPresentationBlock from '@/blocks/services/Presentation/components'
import ServicesCtaBlock from '@/blocks/services/Cta/components'
import { Page, ServicePage } from '@payload-types'

const blockComponents = {

  servicesHero: ServicesHeroBlock,
  servicesPresentation: ServicesPresentationBlock,
  servicesCta: ServicesCtaBlock,
}

export const RenderServicesPageBlocks: React.FC<{
  pageType: ServicePage["pageType"],
  blocks: ServicePage["layout"]
}> = (props) => {
  const { blocks, pageType } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]
            if (Block) {
              const blockContent = (
                <React.Fragment key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} />
                </React.Fragment>
              )
              return blockContent
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}