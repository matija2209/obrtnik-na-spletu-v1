import type { HeroBlock } from "@payload-types"
import DefaultHeroBlock from "./default-hero-block"
import OneHeroSection from "./one-hero-section"
import { getImageUrl } from "@/utilities/getImageUrl"
import type { Cta } from "@payload-types"

const HeroBlockComponent = ({ ...block }: HeroBlock) => {
  
  switch (block?.template) {
    case "default":
      return <DefaultHeroBlock {...block} />
    case "one-hero-section":
      const validCtas = Array.isArray(block.ctas)
        ? block.ctas.filter((cta): cta is Cta => typeof cta === 'object' && cta !== null)
        : undefined;

      const imageUrl = typeof block.image === 'object' && block.image !== null
        ? getImageUrl(block.image)
        : undefined;

      const title = block.title ?? undefined;
      const subtitle = block.subtitle ?? undefined;

      return <OneHeroSection ctas={validCtas} imageUrl={imageUrl} title={title} subtitle={subtitle} />
    default:
      return (
        <>Please select a template</>
      )
  }
}

export default HeroBlockComponent
