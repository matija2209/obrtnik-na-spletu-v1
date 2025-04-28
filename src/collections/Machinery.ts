import { CollectionConfig, Access } from 'payload';

export const Machinery: CollectionConfig = {
  slug: 'machinery',
  labels: {
    singular: 'Stroj',
    plural: 'Stroji',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'updatedAt'],
    description: 'Podatki o gradbeni mehanizaciji.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'tabName',
      label: 'Ime zavihka',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      label: 'Ime stroja (Model)',
      type: 'text',
      required: true,
      admin: {
        description: 'Npr. Volvo EL70, Komatsu PC210',
      },
    },
    {
      name: 'description',
      label: 'Splošni opis stroja',
      type: 'textarea',
      required: false,
    },
    {
      name: 'image',
      label: 'Slika stroja',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'specifications',
      label: 'Specifikacije / Poudarki',
      type: 'array',
      minRows: 0,
      fields: [
        {
          name: 'specName',
          label: 'Naziv specifikacije',
          type: 'text',
          required: true,
        },
        {
          name: 'specDetails',
          label: 'Podrobnosti',
          type: 'array',
          minRows: 0,
          fields: [
            {
              name: 'detail',
              label: 'Podrobnost',
              type: 'text',
              required: true,
            }
          ],
          required: true,
        },
      ],
      admin: {
        description: 'Dodajte ključne specifikacije.',
      }
    },
    {
      name: 'notes',
      label: 'Dodatne opombe',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Npr. Premik stroja na kolesih za krajše razdalje (do 40km)',
      }
    },
  ],
}; 