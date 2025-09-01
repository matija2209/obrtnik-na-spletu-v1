import type { HeroBlock } from "@payload-types"
import DefaultHeroBlock from "./default-hero-block"

import HeroSectionVariant7 from "./HeroSectionVariant7"
import { SearchParams } from "next/dist/server/request/search-params"
import { Params } from "next/dist/server/request/params"

const HeroBlockComponent = async ({ searchParams,params, ...block }: HeroBlock  & { searchParams?: SearchParams ,params?:Params}) => {
  switch (block.template) {
    case "default":
      return <DefaultHeroBlock {...block} />
    case "variant1":
      return <>Manjkajoča funkcionalnost1</>
    case "variant2":
      return <>Manjkajoča funkcionalnost2</>
    case "variant3":
      return <>Manjkajoča funkcionalnost3</>
    case "variant4":
      return <>Manjkajoča funkcionalnost4</>
    case "variant5":
      return <>Manjkajoča funkcionalnost5</>
    case "variant6":
      return <>Manjkajoča funkcionalnost6</>
    case "variant7":
      return <HeroSectionVariant7 {...block} />
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
