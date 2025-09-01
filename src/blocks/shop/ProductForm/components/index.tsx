import { ProductFormBlock } from "@payload-types";
import DefaultProductFormComponent from "./DefaultProductFormComponent";
import { SearchParams } from "next/dist/server/request/search-params";

const ProductFormBlockCoordinator = async ({ searchParams, ...block }: ProductFormBlock & { searchParams?: SearchParams }) => {
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
