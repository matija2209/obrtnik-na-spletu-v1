import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';



const anyone: Access = () => true;

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  labels:{
    singular: 'Pogosta vprašanja',
    plural: 'Pogosta vprašanja',
  },
  
  admin: {
    useAsTitle: 'question', // Use the question as the title in Admin UI
    defaultColumns: ['question', 'updatedAt'],
    description: 'Pogosta vprašanja in odgovori.',
  },
  access: {
    read: anyone, // Anyone can read FAQs
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Vprašanje',
      localized: true, // Questions might need translation
    },
    {
      name: 'answer',
      type: 'textarea', // Use textarea for potentially longer answers
      required: true,
      label: 'Odgovor',
      localized: true, // Answers might need translation
    },
    // Optional: Add a category or ordering field if needed
    // {
    //   name: 'category',
    //   type: 'select',
    //   options: [ ... ],
    //   label: 'Kategorija',
    // },
    // {
    //   name: 'displayOrder',
    //   type: 'number',
    //   label: 'Vrstni red prikaza',
    //   admin: { step: 1 }
    // },
  ],
}; 