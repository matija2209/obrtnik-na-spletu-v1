import TestimonialsBlockVariant1 from './TestimonialsBlockVariant1';
import type { TestimonialsBlock } from '@payload-types';

const TestimonialsBlockComponent = ({ ...block }: TestimonialsBlock) => {
  switch (block?.template) {

    case 'default':
    default: 
      return <TestimonialsBlockVariant1 {...block} />
  }
}

export default TestimonialsBlockComponent;
