import AboutSectionVariant2 from "./AboutSectionVariant2"
import AboutSectionVariant3 from "./AboutSectionVariant3"
  
import type { AboutBlock } from "@payload-types"
import DefaultAboutMeSection from "./default-about-section"
import { SearchParams } from "next/dist/server/request/search-params"
import { Params } from "next/dist/server/request/params"

const AboutBlockComponent = async ({ searchParams,...block }: AboutBlock & { searchParams?: SearchParams ,params?:Params}) => {
  switch (block?.template) {
    case "default":
      return <DefaultAboutMeSection {...block}/>
    case "variant-2":
      return <AboutSectionVariant2 {...block} />
    case "variant-3":
      return <>Manjkajoča funkcionalnost1</> // <AboutSectionVariant3 {...block} />
    case "variant-4":
      return <>Manjkajoča funkcionalnost4</>
    case "variant-5":
      return <>Manjkajoča funkcionalnost5</>
    default:
      return (
        <div>Please select a template for the About block.</div>
      )
  }
}

export default AboutBlockComponent
