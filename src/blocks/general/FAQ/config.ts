import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ odsek (Splošni)',
    plural: 'FAQ odseki (Splošni)',
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
      defaultValue: '',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      localized: true,
      defaultValue: '',
    },
    {
      name: 'selectedFaqs',
      type: 'relationship',
      relationTo: 'faq-items',
      hasMany: true,
      label: 'Izbrana vprašanja',
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
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    {
      name:"idHref",
      type:"text",
      defaultValue:"faq"
    },
  ]
};

export default FaqBlock; 