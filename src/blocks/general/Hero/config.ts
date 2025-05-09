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
        {
          label: 'One Hero Section',
          value: 'one-hero-section',
        },
        {
          label: 'Two Column Hero',
          value: 'two-column-hero',
        },
      ],
    },
    {
      name: 'kicker',
      type: 'text',
      label: 'Kicker',
      required: false,
      localized: true,
      defaultValue: '',
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
      name: 'includeFollowersBadge',
      label: 'Include Followers Badge',
      type: 'checkbox',
      defaultValue: false,
      required: false,
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
 
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slika ozadja',
      required: false,
      hasMany: true,
      minRows: 1,
    },
    {
      name: 'features',
      type: 'array',
      required: false,
      label: 'Značilnosti',
      admin: {
        initCollapsed: true,
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
          defaultValue: '',
        }
      ]
    },
  ]
};

export default Hero; 