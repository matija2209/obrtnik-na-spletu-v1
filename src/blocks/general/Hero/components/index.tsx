import type { HeroBlock } from "@payload-types"
import HeroBlockVariant1 from "./HeroBlockVariant1"
import HeroBlockVariant2 from "./HeroBlockVariant2"


const HeroBlockComponent = ({ ...block }: HeroBlock) => {
  switch (block.template) {
    case "default":
      return <HeroBlockVariant1 {...block} />
    case "variant1":
      return <HeroBlockVariant2 {...block} />
      default:
      return (
        <>
          Please select a template or ensure all required fields for the selected
          template are filled.
        </>
      )
  }
}

export default HeroBlockComponent
