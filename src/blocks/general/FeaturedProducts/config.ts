import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const FeaturedProductsBlock: Block = {
  slug: 'featured_products',
  interfaceName: 'FeaturedProductsBlock',
  labels: {
    singular: {
      sl: 'Izbrane izdelke',
      de: 'Ausgewählte Produkte',
      en: 'Featured Products',
    },
    plural: {
      sl: 'Izbrane izdelke',
      de: 'Ausgewählte Produkte',
      en: 'Featured Products',
    },
  },
  fields: [
    {
      name: 'template',
      label: {
        sl: 'Predloga',
        de: 'Vorlage',
        en: 'Template',
      },
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: {
            sl: 'Privzeti',
            de: 'Standard',
            en: 'Default',
          },
          value: 'default',
        },
      ],
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    
    {
      name: 'kicker',
      type: 'text',
      label: {
        sl: 'Kicker',
        de: 'Kicker',
        en: 'Kicker',
      },
      defaultValue: '',
    },
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov',
        de: 'Titel',
        en: 'Title',
      },
      required: false,
      
      defaultValue: '',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: {
        sl: 'Podnaslov',
        de: 'Untertitel',
        en: 'Subtitle',
      },
      
      defaultValue: '',
    },
    {
      name: 'ctas',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: true,
      required: false,
      label: {
        sl: 'CTA gumbe',
        de: 'CTA Buttons',
        en: 'CTA Buttons',
      },
      minRows: 0,
      maxRows: 2,
 
    },
    {
        name:"products",
        type:"relationship",
        relationTo:"products",
        hasMany:true,
        required:true,
        label: {
          sl: 'Izdelki',
          de: 'Produkte',
          en: 'Products',
        },
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"izdelki"
    },
  ]
};

export default FeaturedProductsBlock; 