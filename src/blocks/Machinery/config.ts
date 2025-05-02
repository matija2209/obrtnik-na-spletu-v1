import type { Block } from 'payload';

const Machinery: Block = {
  slug: 'machinery',
  interfaceName: 'MachineryBlock',
  labels: {
    singular: 'Machinery Block',
    plural: 'Machinery Blocks',
  },
  fields: [
   
    {
      name: 'title',
      type: 'text',
      label: 'Naslov sekcije strojnega parka',
      required: false,
      localized: true,
      defaultValue: 'Naš Vozni Park',
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis sekcije strojnega parka (neobvezno)',
      localized: true,
      defaultValue: 'Ponudba gradbene mehanizacije za najem',
      admin: {
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
    {
      name: 'selectedMachinery',
      type: 'relationship',
      relationTo: 'machinery',
      hasMany: true,
      label: 'Izbrani stroji za prikaz',
      required: false,
      admin: {
        description: 'Izberite stroje, ki se prikažejo na domači strani. Vrstni red je pomemben.',
        condition: (data: any, siblingData: any) => !siblingData?.hideSection,
      },
    },
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
  ]
};

export default Machinery; 