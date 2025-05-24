
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

import { CollectionConfig } from 'payload';
import { Access } from 'payload';

// Define access control
const anyoneRead: Access = () => true;

export const SubServices: CollectionConfig = {
  slug: 'sub_services',
  labels: {
    singular: 'Podstoritev',
    plural: 'Podstoritve',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'parentService', 'updatedAt', 'publishedAt'],
    group: 'Dejavnost', // Group with main Services or a relevant group
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
  },
  access: {
    read: anyoneRead,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {

    // Consider adding hooks to revalidate parent service pages if a sub-service changes.
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Naslov podstoritve',
      required: true,
      localized: true,
    },
    {
      name: 'parentService',
      type: 'relationship',
      relationTo: 'services', // Slug of your main Services collection
      label: 'Nadrejena storitev',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Opis podstoritve',
      localized: true,
    },
    {
      name: 'bulletPoints',
      label: 'Ključne točke',
      type: 'array',
      localized: true,
      minRows: 0,
      fields: [
        {
          name: 'point',
          type: 'text',
          label: 'Točka',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'images',
      label: 'Slike podstoritve',
      type: 'array',
      minRows: 0,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media', // Slug of your Media collection
          label: 'Slika',
          required: true,
        },
      ],
    },
    {
      name: 'price',
      type: 'text', // Using text for flexibility (e.g., "Na zahtevo", "Od X EUR")
      label: 'Cena',
      localized: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Datum objave',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    
  ],
};

export default SubServices; 