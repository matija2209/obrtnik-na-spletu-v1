import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const FeaturedProductsBlock: Block = {
  slug: 'featured_products',
  interfaceName: 'FeaturedProductsBlock',
  labels: {
    singular: 'Izbrane izdelke',
    plural: 'Izbrane izdelke',
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
          label: 'Privzeti',
          value: 'default',
        },
      ],
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    
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
        name:"products",
        type:"relationship",
        relationTo:"products",
        hasMany:true,
        required:true,
        label:"Izdelki"
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"izdelki"
    },
  ]
};

export default FeaturedProductsBlock; 