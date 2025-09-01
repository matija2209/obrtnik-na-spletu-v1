import { SearchParams } from 'next/dist/server/request/search-params';
import DefaultFAQSection from './default-faq-section'; // Corrected import path
import type { FAQBlock as FaqBlockType, FaqItem as PayloadFaqItem } from '@payload-types'; // Corrected assumed type name and import Payload's FaqItem type


const FAQBlock = async ({ searchParams, ...block }: FaqBlockType & { searchParams?: SearchParams }) => {
  // Assuming a template field exists
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render DefaultFAQSection

      return (
        <DefaultFAQSection {...block}
        />
      );
      // Add other cases for different templates if needed
      // case 'accordion':
      //   return <AccordionFAQSection {...block} />;
  }

  // Fallback if no template matches
  // return <div>Please select a template for the FAQ block.</div>;
};

export default FAQBlock;
