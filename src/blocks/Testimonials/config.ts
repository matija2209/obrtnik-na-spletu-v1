import type { Block } from 'payload';


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
        // Add more template options here
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: false,
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'selectedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Izbrana mnenja',
      required: false,
      admin: {
        description: 'Izberite mnenja strank, ki bodo prikazana na domači strani. Vrstni red je pomemben.',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    }
  ]
};

export default Testimonials; 