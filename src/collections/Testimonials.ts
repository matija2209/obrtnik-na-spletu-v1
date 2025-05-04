import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

// Define access control
const anyone: Access = () => true;

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels:{
    singular: 'Mnenje',
    plural: 'Mnenja',
  },
  admin: {
    useAsTitle: 'name', // Use the person's name as the title in Admin UI
    defaultColumns: ['name', 'service', 'rating', 'createdAt'],
    description: 'Mnenja strank o naših storitvah.',
    group: 'Vsebina',
  },
  access: {
    read: anyone, // Anyone can read testimonials
    create: superAdminOrTenantAdminAccess, // Only logged-in users can create
    update: superAdminOrTenantAdminAccess, // Only logged-in users can update
    delete: superAdminOrTenantAdminAccess, // Only logged-in users can delete
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Ime stranke',
    },
    {
      name: 'testimonialDate',
      type: 'date',
      label: 'Datum mnenja',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
        description: 'Datum, ko je bilo mnenje podano.',
      }
    },
    {
      name: 'source',
      type: 'select',
      label: 'Vir mnenja',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Spletna stran', value: 'website' },
        { label: 'Ročni vnos', value: 'manual' },
      ],
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'location',
      type: 'text',
      label: 'Lokacija (Neobvezno)',
    },
    {
      name: 'service', // Service received, e.g., "Montaža klime"
      type: 'text',
      label: 'Prejeta storitev (Neobvezno)',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Vsebina mnenja',
      localized: true, // Content might need translation
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Ocena (1-5)',
      admin: {
        step: 1,
        description: 'Ocena stranke od 1 do 5 zvezdic.'
      }
    },
    // Optional: Add a field to link to the specific product/service if applicable
    // {
    //   name: 'relatedProduct',
    //   type: 'relationship',
    //   relationTo: 'products', 
    //   label: 'Povezan izdelek/storitev (Neobvezno)',
    // },
    {
      name: 'relatedItems',
      type: 'relationship',
      label: 'Povezana storitev ali projekt (Neobvezno)',
      relationTo: ['services', 'projects'], // Link to Services and Projects
      hasMany: true, // Allow linking multiple services or projects
      required: false,
      admin: {
        description: 'Povežite to mnenje s specifičnimi storitvami ali projekti.',
      }
    }
  ],
}; 