import DefaultAboutMeSection from "./default-about-section"
import type { AboutBlock as AboutBlockType } from "@payload-types"

const AboutBlock = ({ ...block }: AboutBlockType) => {
  
  switch (block?.template) {
    case "default":
      return (
        <DefaultAboutMeSection 
          title={block.title ?? undefined}
          subtitle={block.description ?? undefined}
        />
      )
    default:
      return (
        <div>Please select a template for the About block.</div>
      )
  }
}

export default AboutBlock
