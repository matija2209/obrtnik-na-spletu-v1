import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

const anyone: Access = () => true;

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  labels:{
    singular: 'Pogosta vprašanja',
    plural: 'Vprašanja in odgovori',
  },
  
  admin: {
    useAsTitle: 'question', // Use the question as the title in Admin UI
    defaultColumns: ['question', 'updatedAt'],
    description: 'Pogosta vprašanja in odgovori.',
    group: 'Vsebina', // Grouping in admin UI
  },
  access: {
    read: anyone, // Anyone can read FAQs
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      label: 'Kategorija (Neobvezno)',
      options: [
        // Add your predefined categories here
        { label: 'Splošno', value: 'general' },
        { label: 'Montaža', value: 'installation' },
        { label: 'Vzdrževanje', value: 'maintenance' },
        { label: 'Plačila', value: 'billing' },
        // ... add more as needed
      ],
      required: false,
      admin: {
        position: 'sidebar',
        description: 'Izberite kategorijo za lažje filtriranje.',
      }
    },
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Vprašanje',
      localized: true, // Questions might need translation
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: 'Odgovor',
      localized: true,
    },
    {
      name: 'relatedService',
      type: 'relationship',
      relationTo: 'services',
      hasMany: false, // An FAQ usually relates to one primary service
      label: 'Povezana storitev (Neobvezno)',
      required: false,
      admin: {
        description: 'Povežite to vprašanje s specifično storitvijo, če je relevantno.'
      }
    }
  ],
}; 