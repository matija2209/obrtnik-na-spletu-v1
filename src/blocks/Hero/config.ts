import type { Block } from 'payload';

const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero Block',
    plural: 'Hero Blocks',
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
      name: 'subtitle',
      type: 'textarea',
      label: 'Podnaslov',
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'ctas',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: true,
      required: false,
      label: 'CTA gumbe',
      minRows: 0,
      maxRows: 2,
      admin: {
        description: 'Izberite CTA gumbe za naslovno sekcijo. Vrstni red je pomemben.',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slika ozadja',
      required: false,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'features',
      type: 'array',
      required: false,
      label: 'Značilnosti',
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
      fields: [
        {
          name: 'iconText',
          type: 'text',
          label: 'Ikona ali besedilo (npr. 10+, ✓)',
        },
        {
          name: 'text',
          type: 'text',
          label: 'Besedilo značilnosti',
          required: false,
          localized: true,
        }
      ]
    },
  ]
};

export default Hero; 