import type { Block } from 'payload';

const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Gallery Block',
    plural: 'Gallery Blocks',
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
      name: 'galleryImages',
      type: 'array',
      required: false,
      label: 'Slike galerije',
    
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Slika',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Napis (neobvezno)',
          required: false,
          localized: true,
          defaultValue: '',
        }
      ]
    },
    {
      name: 'galleryCta',
      type: 'relationship',
      relationTo: 'ctas',
      hasMany: false,
      required: false,
      label: 'CTA gumb galerije',
     
    }
  ]
};

export default Gallery; 