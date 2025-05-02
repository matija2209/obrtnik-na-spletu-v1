import type { Block } from 'payload';


const About: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    singular: 'About Block',
    plural: 'About Blocks',
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
      name: 'benefits',
      type: 'array',
      required: false,
      label: 'Prednosti',
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Naslov prednosti',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Opis prednosti',
          localized: true,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Ikona prednosti',
          admin: {
            description: 'Ime ikone (npr. Star, Trophy, Clock)',
          },
        },
      ]
    },
  ]
};

export default About; 