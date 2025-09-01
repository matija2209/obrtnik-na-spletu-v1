import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
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
    hidden: true,
    description: 'Podatki o gradbeni mehanizaciji.',
    group: 'Dejavnost',
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess
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
      type: 'richText',
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