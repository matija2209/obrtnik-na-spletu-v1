import type { HeroBlock } from "@payload-types"
import DefaultHeroBlock from "./default-hero-block"

import HeroSectionVariant1 from "./HeroSectionVariant1"
import HeroSectionVariant2 from "./HeroSectionVariant2"
import { SearchParams } from "next/dist/server/request/search-params"
import { Params } from "next/dist/server/request/params"

const HeroBlockComponent = async ({ searchParams,params, ...block }: HeroBlock  & { searchParams?: SearchParams ,params?:Params}) => {
  switch (block.template) {
    case "default":
      return <DefaultHeroBlock {...block} />
    case "variant1":
      return <HeroSectionVariant1 {...block} />
    case "variant2":
      return <HeroSectionVariant2 {...block} />
    case "variant3":
      return <>Manjkajoča funkcionalnost3</>
    case "variant4":
      return <>Manjkajoča funkcionalnost4</>
    case "variant5":
      return <>Manjkajoča funkcionalnost5</>
    case "variant6":
      return <>Manjkajoča funkcionalnost6</>
    case "variant7":
      return <>Manjkajoča funkcionalnost7</>
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
