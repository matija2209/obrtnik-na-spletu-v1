import type { Block } from 'payload';
import type { TestimonialsBlock } from '@payload-types';


const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimonials Block',
    plural: 'Testimonials Blocks',
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
          label: 'Single Testimonial Carousel',
          value: 'single-testimonial',
        },
        {
          label: 'Side Carousel',
          value: 'side-carousel',
        },
        {
          label: 'Three Column Carousel',
          value: 'three-carousel',
        },
        {
          label: 'Three Column Carousel (Recycled)',
          value: 'three-column-carousel-recycled',
        },
        // Add more template options here
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
    {
      name: 'selectedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Izbrana mnenja',
      required: false,
    },
    // Add googleReviewCta field based on recycled code
    {
      name: 'googleReviewCta',
      label: 'Google Review CTA',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false, // Allow only one CTA
      admin: {
        condition: (_, siblingData: Partial<TestimonialsBlock>) => siblingData.template === 'three-column-carousel-recycled',
      }
    }
  ]
};

export default Testimonials; 