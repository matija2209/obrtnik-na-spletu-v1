

// Removed local CtaField definition

import { Block } from "payload";

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

        {
          label: 'Variant 2',
          value: 'variant-2',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Naslov (Title)',
      required: false,
      localized: true,
      defaultValue: '',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Podnaslov (Subtitle)',
      localized: true,
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis (Description/Text)',
      localized: true,
      defaultValue: '',
    },
    {
      name: 'image',
      label: 'Slika (Image)',
      type: 'upload',
      relationTo: 'media', 
      required: false,
    },
    {
      name: 'isInverted',
      label: 'Obrni postavitev (Invert Layout)',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'ctas',
      label: 'Gumbi (CTAs)',
      type: 'relationship',       // Changed type to relationship
      relationTo: 'ctas',       // Relates to the 'ctas' collection
      hasMany: true,             // Indicates it can have multiple CTAs
      required: false,
    },
    {
      name: 'benefits',
      type: 'array',
      required: false,
      label: 'Prednosti (Benefits)',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Naslov prednosti',
          localized: true,
          defaultValue: '',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Opis prednosti',
          localized: true,
          defaultValue: '',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Ikona prednosti',
          admin: {
            description: 'Ime ikone (npr. Star, Trophy, Clock)',
          },
        },
      ],
    },
  ],
};

export default About; 