import backgroundColour from '@/fields/backgroundColour';
import textColour from '@/fields/textColour';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: {
      sl: 'FAQ odsek (Splošni)',
      de: 'FAQ Abschnitt (Allgemein)',
      en: 'FAQ Section (General)',
    },
    plural: {
      sl: 'FAQ odseki (Splošni)',
      de: 'FAQ Abschnitte (Allgemein)',
      en: 'FAQ Sections (General)',
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
            sl: 'Privzeti način',
            de: 'Standard-Layout',
            en: 'Default Layout',
          },
          value: 'default',
        },
        // Add more template options here
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
      required: false,
      
      defaultValue: '',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: {
        sl: 'Podnaslov',
        de: 'Untertitel',
        en: 'Subtitle',
      },
      defaultValue: '',
    },
    {
      name: 'selectedFaqs',
      type: 'relationship',
      relationTo: 'faq-items',
      hasMany: true,
      label: {
        sl: 'Izbrana vprašanja',
        de: 'Ausgewählte Fragen',
        en: 'Selected Questions',
      },
      required: false,
    },
    {
      name: 'faqCta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: false,
      label: 'CTA gumb sekcije FAQ',
    },
    backgroundColour(),textColour.titleColor(),
    textColour.subtitleColor(),
    textColour.descriptionColor(),

    
    isTransparent(),
    {
      name:"idHref",
      type:"text",
      defaultValue:"faq"
    },
  ]
};

export default FaqBlock; 