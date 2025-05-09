import DefaultTestimonialsSection from './default-testimonials-section';
import SingleTestimonialSection from './single-testimonial-section';
import SideCarouselSection from './side-carousel-section';
import ThreeCarouselSection from './three-carousel-section';
import type { TestimonialsBlock as TestimonialsBlockType, Testimonial as PayloadTestimonial, Cta } from '@payload-types'; // Assuming TestimonialsBlock is the type name

// Helper to check if an item is a Testimonial object (not a number ID)
const isTestimonialObject = (item: number | PayloadTestimonial): item is PayloadTestimonial => 
  typeof item === 'object' && item !== null && 'name' in item && 'content' in item;

// Helper to check if an item is a Cta object (not a number or string ID)
// const isCtaObject = (item: number | Cta | undefined | null): item is Cta => 
//   typeof item === 'object' && item !== null; // Removed as CTA is not directly on the block type

const TestimonialsBlock = ({ ...block }: TestimonialsBlockType) => {
  // Validate selectedTestimonials: ensure it's an array of PayloadTestimonial objects
  const validTestimonials = (block.selectedTestimonials ?? []) 
    .map((item: number | PayloadTestimonial) => isTestimonialObject(item) ? item : null) 
    .filter((item: PayloadTestimonial | null): item is PayloadTestimonial => item !== null);

  // Render nothing or a message if no testimonials are valid (unless a specific template handles this)
  if (validTestimonials.length === 0) {
    // In a real app, you might want to log this or show a placeholder in dev/preview
    return null; 
  }

  switch (block?.template) {
    case 'single-testimonial':
      return (
        <SingleTestimonialSection
          title={block.title}
          description={block.description} // Pass description
          testimonials={validTestimonials}
          // Assuming default bgColor is fine, or you might add a bgColor field to the block config
        />
      );
    case 'side-carousel':
      return (
        <SideCarouselSection
          title={block.title}
          description={block.description} // Pass description (though might not be used by template)
          testimonials={validTestimonials}
          // Assuming default bgColor ('bg-background') is desired for this template
        />
      );
    case 'three-carousel':
      return (
        <ThreeCarouselSection
          title={block.title}
          description={block.description} // Pass description (though might not be used by template)
          testimonials={validTestimonials}
          // Assuming default bgColor ('bg-secondary') is desired for this template
        />
      );
    case 'default':
    default: 
      return (
        <DefaultTestimonialsSection
          title={block.title ?? undefined}
          testimonials={validTestimonials} 
        />
      );
  }

  // Fallback
  // return <div>Please select a template for the Testimonials block.</div>;
};

export default TestimonialsBlock;
