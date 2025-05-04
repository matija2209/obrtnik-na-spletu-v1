import React, { Fragment } from 'react'
import AboutBlock from '@/blocks/About/components'
import ContactBlock from '@/blocks/Contact/components'
import FAQBlock from '@/blocks/FAQ/components'
import GalleryBlock from '@/blocks/Gallery/components'
import HeroBlock from '@/blocks/Hero/components'
import MachineryBlock from '@/blocks/Machinery/components'
import ProjectHighlightsBlock from '@/blocks/ProjectHighlights/components'
import ServiceAreaBlock from '@/blocks/ServiceArea/components'
import ServicesBlock from '@/blocks/Services/components'
import TestimonialsBlock from '@/blocks/Testimonials/components'
import { Page } from '@payload-types'

const blockComponents = {
  about: AboutBlock,
  contact: ContactBlock,
  faq: FAQBlock,
  gallery: GalleryBlock,
  hero: HeroBlock,
  machinery: MachineryBlock,
  projectHighlights: ProjectHighlightsBlock,
  serviceArea: ServiceAreaBlock,
  services: ServicesBlock,
  testimonials: TestimonialsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page["layout"]
}> = (props) => {
  const { blocks } = props


  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <React.Fragment key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </React.Fragment>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}