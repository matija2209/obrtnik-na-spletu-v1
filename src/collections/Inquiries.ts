import { CollectionConfig, Access } from 'payload';

// Define access control - allowing anyone to create, admin to read/update/delete
const anyone: Access = () => true;
const isAdmin: Access = ({ req }) => {
  if (!req.user) return false;
  return req.user.roles?.includes('admin') ?? false;
};

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: {
    singular: 'Povpraševanje',
    plural: 'Povpraševanja',
  },
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'lastName', 'email', 'service', 'createdAt'],
  },
  access: {
    // Anyone can create an inquiry
    create: anyone,
    // Only admins can read, update, or delete inquiries
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
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
  ],
}; 