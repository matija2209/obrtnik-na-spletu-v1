import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';
import slugify from 'slugify';
import { Wrench } from 'lucide-react';

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
  hooks: {
    beforeValidate: [
      (args) => {
        const { data } = args;
        if (data?.title && typeof data.title === 'string') {
          // Generate slug only if title exists and is a string
          const slug = slugify(data.title, { 
            lower: true, 
            strict: true, // remove special characters
            locale: 'sl' // Assuming Slovenian locale, adjust if needed
          });
          return { ...data, serviceId: slug };
        }
        return data; // Return original data if title is not present or not a string
      },
    ],
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'serviceId',
      type: 'text',
      label: 'Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova.',
        readOnly: true,
        position: 'sidebar',
      }
    },
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