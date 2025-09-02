import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const CtaBlock: Block = {
  slug: 'cta_block',
  interfaceName: 'CtaBlock',
  labels: {
    singular: {
      sl: 'CTA odsek (Splošni)',
      de: 'CTA Abschnitt (Allgemein)',
      en: 'CTA Section (General)',
    },
    plural: {
      sl: 'CTA odseki (Splošni)',
      de: 'CTA Abschnitte (Allgemein)',
      en: 'CTA Sections (General)',
    },
  },
  imageURL: '/images/blocks/cta.png',
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
            sl: 'Privzeti način',
            de: 'Standard-Layout',
            en: 'Default Layout',
          },
          value: 'default',
        },
      ],
    },
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
    },
    {
      name:"images",
      relationTo:"media",
      type:"upload",
      hasMany:true,
    },
    {
      name:"subtitle",
      type:"text",
      label: {
        sl: 'Podnaslov',
        de: 'Untertitel',
        en: 'Subtitle',
      },
    },
    {
      name: 'cta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: true,
      label: {
        sl: 'CTA gumb',
        de: 'CTA Button',
        en: 'CTA Button',
      },
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    {
      name:"idHref",
      type:"text",
      defaultValue:"cta"
    },
  ]
};

export default CtaBlock; 