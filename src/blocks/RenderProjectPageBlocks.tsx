import React, { Fragment } from 'react'
import AboutBlock from '@/blocks/general/About/components'
import ContactBlock from '@/blocks/general/Contact/components'
import FAQBlock from '@/blocks/general/FAQ/components'
import GalleryBlock from '@/blocks/general/Gallery/components'
import HeroBlock from '@/blocks/general/Hero/components'
import TestimonialsBlock from '@/blocks/general/Testimonials/components'
import AboutProjectBlock from '@/blocks/projects/About/components'
import RelatedProjectsBlock from '@/blocks/projects/RelatedProjects/components'
import CtaBlock from './general/Cta/components'

import { ProjectPage } from '@payload-types'
import { Params } from 'next/dist/server/request/params'

const blockComponents = {
  hero: HeroBlock,
  gallery: GalleryBlock,
  faq: FAQBlock,
  contact: ContactBlock,
  about: AboutBlock,
  testimonials: TestimonialsBlock,
  aboutProject: AboutProjectBlock,
  relatedProjects: RelatedProjectsBlock,
  cta_block: CtaBlock
}

export const RenderProjectPageBlocks: React.FC<{
  pageType: ProjectPage["pageType"],
  blocks: ProjectPage["layout"],
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

              if (blockType === "gallery") {
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