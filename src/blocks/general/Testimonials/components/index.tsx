import { SearchParams } from 'next/dist/server/request/search-params';
import { Params } from 'next/dist/server/request/params';
import DefaultTestimonialsSection from './default-testimonials-section';
import TestimonialsSectionVariant2 from './TestimonialsSectionVariant2';

import type { TestimonialsBlock } from '@payload-types';


const TestimonialsBlockComponent = async ({ searchParams,params, ...block }: TestimonialsBlock  & { searchParams?: SearchParams, params?: Params }  ) => {
  switch (block?.template) {

    case 'variant2':
      return <TestimonialsSectionVariant2 {...block} />
 
    case 'default':
    default: 
      return <DefaultTestimonialsSection {...block} />
  }
}

export default TestimonialsBlockComponent;
