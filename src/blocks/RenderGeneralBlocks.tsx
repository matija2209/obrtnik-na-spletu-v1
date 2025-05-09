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

export const RenderGeneralBlocks: React.FC<{
  pageType: Page["pageType"],
  blocks: Page["layout"] 
}> = (props) => {
  const { blocks, pageType } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              const blockContent = (
                <React.Fragment key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </React.Fragment>
              )

              if (blockType === "gallery" || blockType === "projectHighlights") {
                return (
                  <div className=" relative z-50" key={index}>
                    {blockContent}
                  </div>
                )
              } else {
                return blockContent
              }
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}