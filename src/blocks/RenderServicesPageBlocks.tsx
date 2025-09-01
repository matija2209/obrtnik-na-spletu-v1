import React, { Fragment } from 'react'

import SubServicesBlock from '@/blocks/services/SubServices/components'
import CtaBlock from '@/blocks/general/Cta/components'
import HeroBlock from '@/blocks/general/Hero/components'
import ProjectHighlightsBlockComponent from './general/ProjectHighlights/components'

import { ServicePage } from '@payload-types'
import { Params } from 'next/dist/server/request/params'
import AboutProjectBlock from './projects/About/components'
import AboutBlock from './general/About/components'
import RelatedProjectsBlock from './projects/RelatedProjects/components'
import TestimonialsBlock from './general/Testimonials/components'
import GalleryBlock from './general/Gallery/components'
import FAQBlock from './general/FAQ/components'
import ContactBlock from './general/Contact/components'


const blockComponents = {
  // You must do it by the slug
  hero: HeroBlock,
  projectHighlights: ProjectHighlightsBlockComponent,
  cta_block: CtaBlock,
  gallery: GalleryBlock,
  faq: FAQBlock,
  contact: ContactBlock,
  about: AboutBlock,
  testimonials: TestimonialsBlock,
  aboutProject: AboutProjectBlock,
  relatedProjects: RelatedProjectsBlock,
  "sub-services": SubServicesBlock,
}

export const RenderServicesPageBlocks: React.FC<{
  pageType: ServicePage["pageType"],
  blocks: ServicePage["layout"],
  searchParams?: Record<string, string | string[] | undefined>
  params?: Params
}> = (props) => {
  const { blocks, pageType, searchParams, params } = props

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
                  <Block {...block} disableInnerContainer searchParams={searchParams} params={params} />
                </React.Fragment>
              )

              if (blockType === "gallery" || blockType === "projectHighlights") {
                return (
                  <div className="relative z-50" key={index}>
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