import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

const anyone: Access = () => true;

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  labels:{
    singular: {
      en: 'FAQ Item',
      sl: 'Pogosta vprašanja',
      de: 'FAQ-Element',
    },
    plural: {
      en: 'FAQ Items',
      sl: 'Pogosta vprašanja',
      de: 'FAQ-Elemente',
    },
  },
  
  admin: {
    useAsTitle: 'question', // Use the question as the title in Admin UI
    defaultColumns: ['question', 'updatedAt'],
    description: 'Pogosta vprašanja in odgovori.',
    group: {
      sl: 'Vsebina',
      de: 'Inhalt',
      en: 'Content',
    }, // Grouping in admin UI
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
      label: {
        sl: 'Kategorija (Neobvezno)',
        de: 'Kategorie (Optional)',
        en: 'Category (Optional)',
      },
      options: [
        // Add your predefined categories here
        { label: {
          sl: 'Splošno',
          de: 'Allgemein',
          en: 'General',
        }, value: 'general' },
        { label: {
          sl: 'Montaža',
          de: 'Montage',
          en: 'Installation',
        }, value: 'installation' },
        { label: {
          sl: 'Vzdrževanje',
          de: 'Wartung',
          en: 'Maintenance',
        }, value: 'maintenance' },
        { label: {
          sl:   'Plačila',
          de: 'Zahlungen',
          en: 'Billing',
        }, value: 'billing' },
      ],
      required: false,
      admin: {
        position: 'sidebar',
        description: {
          sl: 'Izberite kategorijo za lažje filtriranje.',
          de: 'Wählen Sie eine Kategorie für einfachere Filterung.',
          en: 'Select a category for easier filtering.',
        },
      }
    },
    {
      name: 'question',
      type: 'text',
      required: true,
      label: {
        sl: 'Vprašanje',
        de: 'Frage',
        en: 'Question',
      },
       // Questions might need translation
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: {
        sl: 'Odgovor',
        de: 'Antwort',
        en: 'Answer',
      },
      
    },
    {
      name: 'relatedService',
      type: 'relationship',
      relationTo: 'services',
      hasMany: false, // An FAQ usually relates to one primary service
      label: {
        sl: 'Povezana storitev (Neobvezno)',
        de: 'Verknüpfte Dienstleistung (Optional)',
        en: 'Related Service (Optional)',
      },
      required: false,
      admin: {
        description: {
          sl: 'Povežite to vprašanje s specifično storitvijo, če je relevantno.',
          de: 'Verknüpfen Sie diese Frage mit einer bestimmten Dienstleistung, wenn relevant.',
          en: 'Link this question to a specific service if relevant.',
        },
      }
    }
  ],
}; 