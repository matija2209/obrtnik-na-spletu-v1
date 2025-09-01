import { SearchParams } from 'next/dist/server/request/search-params';
import DefaultTestimonialsSection from './default-testimonials-section';
import TestimonialsSectionVariant2 from './TestimonialsSectionVariant2';

import type { TestimonialsBlock } from '@payload-types';


const TestimonialsBlockComponent = async ({ searchParams, ...block }: TestimonialsBlock  & { searchParams?: SearchParams }  ) => {
  switch (block?.template) {

    case 'variant2':
      return <TestimonialsSectionVariant2 {...block} />
 
    case 'default':
    default: 
      return <DefaultTestimonialsSection {...block} />
  }
}

export default TestimonialsBlockComponent;
