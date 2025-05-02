import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';
import slugify from 'slugify';
import { Wrench } from 'lucide-react';
import { slugField } from '@/fields/slug';

// Define access control - allowing anyone to read, admin to create/update/delete
const anyone: Access = () => true;


export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Storitev',
    plural: 'Storitve',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'serviceId', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    slugField('title', {
      name: 'serviceId',
      label: 'Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova.',
        readOnly: true,
        position: 'sidebar',
      }
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
      required: true,
      localized: true,
    },
    {
      name: 'features',
      label: 'Značilnosti',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'featureText',
          type: 'text',
          label: 'Besedilo značilnosti',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Slika',
      required: false,
    },
    {
      name: 'link',
      type: 'text',
      label: 'URL povezava (npr. /storitve/klimatske-naprave)',
      required: false,
    },
  ],
}; 