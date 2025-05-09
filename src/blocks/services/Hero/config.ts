import type { Block } from 'payload';

const Hero: Block = {
  slug: 'servicesHero',
  interfaceName: 'ServicesHeroBlock',
  labels: {
    singular: 'Services Hero Block',
    plural: 'Services Hero Blocks',
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
      defaultValue: '',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Podnaslov',
      localized: true,
      defaultValue: '',
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
    }
  ]
};

export default Hero; 