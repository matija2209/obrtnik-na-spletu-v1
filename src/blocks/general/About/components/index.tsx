import DefaultAboutMeSection from "./default-about-section"
import Variant2AboutSection from "./variant-2-about-section"
import type { AboutBlock as AboutBlockType, Cta, Media } from "@payload-types"

const AboutBlock = ({ ...block }: AboutBlockType) => {
  
  switch (block?.template) {
    case "default":
      return (
        <DefaultAboutMeSection 
          title={block.title ?? undefined}
          subtitle={block.description ?? undefined}
        />
      )
    case "variant-2":
      return (
        <Variant2AboutSection
          title={block.title ?? undefined}
          subtitle={block.description ?? undefined}
          description={block.description ?? undefined}
          image={block.image as Media ?? undefined}
          isInverted={block.isInverted ?? undefined}
          ctas={block.ctas as Cta[] ?? undefined}
        />
      )
    default:
      return (
        <div>Please select a template for the About block.</div>
      )
  }
}

export default AboutBlock
