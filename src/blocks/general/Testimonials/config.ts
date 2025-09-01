import type { Block } from 'payload';
import type { TestimonialsBlock } from '@payload-types';
import isTransparent from '@/fields/isTransperant';
import colourSchema from '@/fields/colourSchema';
import backgroundColour from '@/fields/backgroundColour';

const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Mnenja odsek (Splošni)',
    plural: 'Mnenja odseki (Splošni)',
  },
  fields: [
    {
      name: 'template',
      label: 'Template',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: 'Default Layout',
          value: 'default',
        },
        {
          label: 'Variant 1',
          value: 'variant1',
        },
        {
          label: 'Variant 2',
          value: 'variant2',
        },
        {
          label: 'Variant 3',
          value: 'variant3',
        },
        {
          label: 'Variant 4',
          value: 'variant4',
        },
        {
          label: 'Variant 5',
          value: 'variant5',
        }
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: false,
      localized: true,
      defaultValue: '',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      localized: true,
      defaultValue: '',
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    
    {
      name: 'googleReviewCta',
      label: 'Google Review CTA',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false, // Allow only one CTA
      admin: {
        // condition: (_, siblingData: Partial<TestimonialsBlock>) => siblingData.template === 'variant-3',
      }
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"mnenja"
    },
    {
      name: 'selectedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Izbrana mnenja',
      required: false,
    },
    // Add googleReviewCta field based on recycled code
   
  ]
};

export default TestimonialsBlock; 