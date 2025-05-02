import { ContainedSection } from "@/components/layout/container-section"
import type { HeroBlock } from "@payload-types"
import DefaultHeroBlock from "./default-hero-block"

const HeroBlock = ({ block }: { block: HeroBlock }) => {
  switch (block?.template) {
    case "default":
      return <DefaultHeroBlock block={block} />
    default:
      return (
        <>Please select a template</>
      )
  }
}

export default HeroBlock
