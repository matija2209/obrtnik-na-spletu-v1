import type { Block } from 'payload';

const CTA: Block = {
  slug: 'servicesCta',
  interfaceName: 'ServicesCtaBlock',
  labels: {
    singular: 'Services CTA Block',
    plural: 'Services CTA Blocks',
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
        // Add more template options as needed
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: true,
      localized: true,
    },
    {
      name: 'cta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: true,
      label: 'CTA gumb',
    }
  ]
};

export default CTA; 