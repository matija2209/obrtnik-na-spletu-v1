import type { Block } from 'payload';


const Services: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Services Block',
    plural: 'Services Blocks',
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
      label: 'Naslov sekcije storitev',
      required: false,
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis sekcije storitev',
      localized: true,
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'selectedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Izbrane storitve',
      required: false,
      admin: {
        description: 'Izberite storitve, ki se prikažejo na domači strani. Vrstni red je pomemben.',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'serviceCta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: false,
      label: 'CTA gumb sekcije storitev',
      admin: {
        description: 'Izberite CTA gumb za sekcijo Storitve (neobvezno).',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    }
  ]
};

export default Services; 