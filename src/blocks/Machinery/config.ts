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
    
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis sekcije strojnega parka (neobvezno)',
      localized: true,
      defaultValue: 'Ponudba gradbene mehanizacije za najem',
      
    },
    {
      name: 'selectedMachinery',
      type: 'relationship',
      relationTo: 'machinery',
      hasMany: true,
      label: 'Izbrani stroji za prikaz',
      required: false,
 
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