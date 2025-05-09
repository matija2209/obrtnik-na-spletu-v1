import type { Block } from 'payload';

const Presentation: Block = {
  slug: 'sPresentation',
  interfaceName: 'ServicesPresentationBlock',
  labels: {
    singular: 'Services Presentation Block',
    plural: 'Services Presentation Blocks',
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
        // Add more template options as needed
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'Storitve',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Naslov',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Opis',
          required: true,
        },
        {
          name: 'order',
          type: 'select',
          label: 'Vrstni red prikaza',
          options: [
            {
              label: 'Slika na levi, besedilo na desni',
              value: 'normal',
            },
            {
              label: 'Besedilo na levi, slika na desni',
              value: 'inverse',
            },
          ],
          defaultValue: 'normal',
          required: true,
        },
        {
          name: 'points',
          type: 'array',
          label: 'Poudarjene točke',
          fields: [
            {
              name: 'point',
              type: 'text',
              label: 'Točka',
              required: true,
            },
          ]
        },
        {
          name: 'images',
          type: 'array',
          label: 'Slike',
          minRows: 1,
          maxRows: 3,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Slika',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alternativni tekst',
              required: true,
            }
          ]
        }
      ]
    }
  ]
};

export default Presentation; 