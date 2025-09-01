import { FeaturedProductsBlock } from "@payload-types";
import DefaultFeaturedProduct from "./default-featured-product";
import { SearchParams } from "next/dist/server/request/search-params";
import { Params } from "next/dist/server/request/params";




const FeaturedProductsCoordinator = async ({ searchParams,params, ...block }: FeaturedProductsBlock & { searchParams?: SearchParams ,params?:Params}) => {
  // Assuming a template field exists
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render DefaultFAQSection

      return (
        <DefaultFeaturedProduct {...block}
        />
      );
      // Add other cases for different templates if needed
      // case 'accordion':
      //   return <AccordionFAQSection {...block} />;
  }

  // Fallback if no template matches
  // return <div>Please select a template for the FAQ block.</div>;
};

export default FeaturedProductsCoordinator;
