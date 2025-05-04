import DefaultFAQSection from './default-faq-section'; // Corrected import path
import type { FAQBlock as FaqBlockType, FaqItem as PayloadFaqItem } from '@payload-types'; // Corrected assumed type name and import Payload's FaqItem type

// Define a type for individual FAQ items for internal use if needed, or just use PayloadFaqItem
// Let's use PayloadFaqItem directly for consistency
// type FAQItem = {
//   id?: string | null;
//   question: string;
//   answer: any; // Assuming answer might be rich text or similar
// };

// Helper to check if an item is a FAQ object (not a number ID)
const isFaqObject = (item: number | PayloadFaqItem): item is PayloadFaqItem => 
  typeof item === 'object' && item !== null && 'question' in item && 'answer' in item;

const FAQBlock = ({ ...block }: FaqBlockType) => {
  // Assuming a template field exists
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render DefaultFAQSection
      // Validate selectedFaqs: ensure it's an array of PayloadFaqItem objects
      const validFaqItems = (block.selectedFaqs ?? []) // Use selectedFaqs
        .map((item: number | PayloadFaqItem) => isFaqObject(item) ? item : null) // Corrected type annotation
        .filter((item: PayloadFaqItem | null): item is PayloadFaqItem => item !== null);

      return (
        <DefaultFAQSection
          title={block.title ?? undefined}
          description={block.description ?? undefined}
          faqData={validFaqItems} // Pass the validated FAQ items to faqData prop
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
