import type { TextBlock } from "@payload-types"

import TextBlockVariant1 from "./TextBlockVariant1"
import { SearchParams } from "next/dist/server/request/search-params"
import { Params } from "next/dist/server/request/params"


const TextBlockCoordinator = ({ searchParams,params, ...block }: TextBlock  & { searchParams?: SearchParams ,params?:Params}) => {
  switch (block?.template) {
    case "default":
      return <TextBlockVariant1 {...block} />
    default:
      return (
        <div>Please select a template for the About block.</div>
      )
  }
}

export default TextBlockCoordinator
