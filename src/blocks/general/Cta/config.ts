import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const CtaBlock: Block = {
  slug: 'cta_block',
  interfaceName: 'CtaBlock',
  labels: {
    singular: 'CTA odsek (Splošni)',
    plural: 'CTA odseki (Splošni)',
  },
  imageURL: '/images/blocks/cta.png',
  fields: [
    {
      name: 'template',
      label: 'Template',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
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
      name:"description",
      type:"richText",
      label:"Opis",
      required:false,
    },
    {
      name: 'cta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: true,
      label: 'CTA gumb',
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    {
      name:"idHref",
      type:"text",
      defaultValue:"cta"
    },
  ]
};

export default CtaBlock; 