import type { TextBlock } from "@payload-types"

import TextBlockVariant1 from "./TextBlockVariant1"
import { SearchParams } from "next/dist/server/request/search-params"


const TextBlockCoordinator = ({ searchParams, ...block }: TextBlock  & { searchParams?: SearchParams }) => {
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
