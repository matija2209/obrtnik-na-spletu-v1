
import type { AboutBlock } from "@payload-types"

import HeroBlockVariant1 from "../../Hero/components/HeroBlockVariant1"
import AboutBlockVariant1 from "./AboutBlockVariant1"
import AboutBlockVariant2 from "./AboutBlockVariant2"

const AboutBlockComponent = ({ ...block }: AboutBlock) => {
  switch (block?.template) {
    case "default":
      return <AboutBlockVariant1 {...block} />
    case "variant1":
      return <AboutBlockVariant2 {...block} />
    default:
      return (
        <div>Please select a template for the About block.</div>
      )
  }
}

export default AboutBlockComponent
