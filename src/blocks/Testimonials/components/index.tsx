import DefaultTestimonialsSection from './default-testimonials-section';
import type { TestimonialsBlock as TestimonialsBlockType, Testimonial as PayloadTestimonial, Cta } from '@payload-types'; // Assuming TestimonialsBlock is the type name

// Helper to check if an item is a Testimonial object (not a number ID)
const isTestimonialObject = (item: number | PayloadTestimonial): item is PayloadTestimonial => 
  typeof item === 'object' && item !== null && 'name' in item && 'content' in item;

// Helper to check if an item is a Cta object (not a number or string ID)
// const isCtaObject = (item: number | Cta | undefined | null): item is Cta => 
//   typeof item === 'object' && item !== null; // Removed as CTA is not directly on the block type

const TestimonialsBlock = ({ ...block }: TestimonialsBlockType) => {
  // Assuming a template field might exist
  switch (block?.template) {
    case 'default':
    default: // Defaulting to render DefaultTestimonialsSection
      // Validate selectedTestimonials: ensure it's an array of PayloadTestimonial objects
      const validTestimonials = (block.selectedTestimonials ?? []) // Use selectedTestimonials
        .map((item: number | PayloadTestimonial) => isTestimonialObject(item) ? item : null) // Update map signature
        .filter((item: PayloadTestimonial | null): item is PayloadTestimonial => item !== null);

      // Validate CTA - Removed as CTA is not directly on the block type
      // const validCta = isCtaObject(block.cta) ? block.cta : undefined; 

      // DefaultTestimonialsSection requires testimonials, so maybe render nothing or a message if none are valid?
      if (validTestimonials.length === 0) {
        // Optionally return null or a placeholder if no testimonials
         return null; 
        // return <div>No testimonials available.</div>;
      }

      return (
        <DefaultTestimonialsSection
          title={block.title ?? undefined}
          testimonials={validTestimonials} // Pass validated testimonials
          // cta={validCta} // Removed prop
        />
      );
      // Add other cases for different templates if needed
  }

  // Fallback
  // return <div>Please select a template for the Testimonials block.</div>;
};

export default TestimonialsBlock;
