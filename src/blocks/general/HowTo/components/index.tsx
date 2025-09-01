import type {  HowToBlock } from "@payload-types"
import DefaultHowToBlock from "./default-howto-block"
import { SearchParams } from "next/dist/server/request/search-params"

const HowToBlockCoordinator = ({ searchParams, ...block }: HowToBlock  & { searchParams?: SearchParams }) => {
  switch (block.template) {
    case "default":
      return <DefaultHowToBlock {...block} />
    default:
      return (
        <>
          Please select a template or ensure all required fields for the selected
          template are filled.
        </>
      )
  }
}

export default HowToBlockCoordinator
