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
import CtaBlock from './general/Cta/components'
import FormBlock from './general/Form/components'
import HowToBlockCoordinator from './general/HowTo/components'
import { Page, ProductPage } from '@payload-types'
import FeaturedProductsCoordinator from './general/FeaturedProducts/components'
import ProductFormBlockCoordinator from './shop/ProductForm/components'
import { SearchParams } from 'next/dist/server/request/search-params'

const blockComponents = {
  product_form: ProductFormBlockCoordinator,
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
  cta_block:CtaBlock,
  formBlock: FormBlock,
  howto: HowToBlockCoordinator, // This is the correct name for the howto block
  featured_products: FeaturedProductsCoordinator
}

export const RenderProductPageBlocks: React.FC<{
  pageType: ProductPage["pageType"],
  blocks: ProductPage["layout"],
  searchParams?: SearchParams
}> = (props) => {
  const { blocks, pageType, searchParams } = props

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
                  <Block {...block} disableInnerContainer searchParams={searchParams} />
                </React.Fragment>
              )

              if (blockType === "gallery") {
                return (
                  <div className="" key={index}>
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