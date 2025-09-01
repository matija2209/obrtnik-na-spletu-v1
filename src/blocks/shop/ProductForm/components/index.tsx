import { ProductFormBlock } from "@payload-types";
import DefaultProductFormComponent from "./DefaultProductFormComponent";
import { SearchParams } from "next/dist/server/request/search-params"
import { Params } from "next/dist/server/request/params";

const ProductFormBlockCoordinator = async ({ searchParams,params, ...block }: ProductFormBlock & { searchParams?: SearchParams ,params?:Params}) => {
  switch (block.template) {
    case 'default':
    default: // Defaulting to render DefaultServicesSection
      return (
        <DefaultProductFormComponent
          {...block}
          searchParams={searchParams}
        />
      );
  }
  // Fallback if template is somehow invalid (shouldn't happen with validation)
  // return <div>Invalid template selected for Services block.</div>;
};

export default ProductFormBlockCoordinator;
