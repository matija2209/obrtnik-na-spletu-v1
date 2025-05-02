import type { Block } from 'payload';

const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ Block',
    plural: 'FAQ Blocks',
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
      name: 'selectedFaqs',
      type: 'relationship',
      relationTo: 'faq-items',
      hasMany: true,
      label: 'Izbrana vprašanja',
      required: false,
      admin: {
        description: 'Izberite vprašanja, ki bodo prikazana na domači strani. Vrstni red je pomemben.',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'faqCta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: false,
      label: 'CTA gumb sekcije FAQ',
      admin: {
        description: 'Izberite CTA gumb za sekcijo FAQ (neobvezno).',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    }
  ]
};

export default FAQ; 