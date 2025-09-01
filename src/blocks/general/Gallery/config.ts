import backgroundColour from '@/fields/backgroundColour';
import colourSchema from '@/fields/colourSchema';
import isTransparent from '@/fields/isTransperant';
import type { Block } from 'payload';

const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Galerija (Splošni)',
    plural: 'Galerije (Splošni)',
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
        {
          label: 'Carousel Layout',
          value: 'variant1',
        },
        // Add more template options here
      ],
    },
    {
      name: 'autoSyncMedia',
      type: 'checkbox',
      label: 'Samodejno dodaj nove slike iz mape',
      defaultValue: false,
      admin: {
        description: 'Ko je omogočeno, se bodo nove naložene slike samodejno dodale v to galerijo',
      },
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
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'galleryCta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: false,
      label: 'CTA gumb galerije',
    },
    backgroundColour(),
    colourSchema(),
    isTransparent(),
    {
      name:"idHref",
      type:"text",
      defaultValue:"galerija"
    },
  ]
};

export default GalleryBlock; 