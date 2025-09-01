

// Removed local CtaField definition

import backgroundColour from "@/fields/backgroundColour";
import colourSchema from "@/fields/colourSchema";
import isTransparent from "@/fields/isTransperant";
import { Block } from "payload";

const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    singular: 'O nas odsek (Splošni)',
    plural: 'O nas odseki (Splošni)',
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
        {
          label: 'Variant 3',
          value: 'variant-3',
        },
        {
          label: 'Variant 4',
          value: 'variant-4',
        },
        {
          label: 'Variant 5',
          value: 'variant-5',
        },
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
      type: 'text',
      label: 'Podnaslov',
      localized: true,
      required: false,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis',
      localized: true,
    },
    {
      name: 'image',
      label: 'Slika',
      type: 'upload',
      relationTo: 'media', 
      hasMany: true,
      required: false,
    },
    {
      name: 'isInverted',
      label: 'Obrni postavitev',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"o-nas"
    },
    {
      name: 'ctas',
      label: 'Gumbi',
      type: 'relationship',       // Changed type to relationship
      relationTo: 'ctas',       // Relates to the 'ctas' collection
      hasMany: true,             // Indicates it can have multiple CTAs
      required: false,
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    
    {
      name: 'benefits',
      type: 'array',
      required: false,
      label: 'Prednosti',
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

export default AboutBlock; 