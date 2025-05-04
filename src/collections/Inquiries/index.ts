import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';


import { sendNotification } from './hooks/sendNotification';
import { CollectionConfig } from 'payload';
import { Access, FieldAccess } from 'payload';


// Define access control - allowing anyone to create
const anyone: Access = () => true;

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: {
    singular: 'Povpraševanje',
    plural: 'Povpraševanja',
  },
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['inquiryType', 'firstName', 'lastName', 'email', 'service', 'status', 'createdAt'],
    group: 'Management',
  },
  access: {
    read: superAdminOrTenantAdminAccess,
    create: anyone,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [sendNotification],
  },
  fields: [
    {
      name: 'inquiryType',
      type: 'select',
      label: 'Tip povpraševanja',
      options: [
        { label: 'Splošno vprašanje', value: 'general' },
        { label: 'Zahteva za ponudbo', value: 'quote' },
        { label: 'Podpora', value: 'support' },
        { label: 'Drugo', value: 'other' },
      ],
      defaultValue: 'general',
      required: false,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'Ime',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Priimek',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-pošta',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
      required: false,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Sporočilo',
      required: true,
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Storitev',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
      label: 'Lokacija',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        {
          label: 'Novo',
          value: 'new',
        },
        {
          label: 'V obdelavi',
          value: 'in-progress',
        },
        {
          label: 'Zaključeno',
          value: 'completed',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'consent',
      type: 'checkbox',
      label: 'Strinjam se z obdelavo podatkov za namen povpraševanja.',
      required: true,
      validate: (val: boolean | null | undefined) => val === true ? true : 'Morate se strinjati z obdelavo podatkov.',
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes (Internal)',
    },
  ],
}; 