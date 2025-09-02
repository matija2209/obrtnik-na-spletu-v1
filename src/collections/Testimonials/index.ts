import { CollectionConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { slugField } from '@/fields/slug';
import { revalidateTestimonialsCache, revalidateTestimonialsCacheDelete } from './hooks/revalidateTestimonialsCache';

// Define access control
const anyone: Access = () => true;

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels:{
    singular: {
      en: 'Testimonial',
      sl: 'Mnenje',
      de: 'Bewertung',
    },
    plural: {
      en: 'Testimonials',
      sl: 'Mnenja',
      de: 'Bewertungen',
    }
  },
  admin: {
    useAsTitle: 'name', // Use the person's name as the title in Admin UI
    defaultColumns: ['name', 'service', 'rating', 'createdAt'],
    description: {
      sl: 'Mnenja strank o naših storitvah.',
      de: 'Bewertungen von Kunden über unsere Leistungen.',
      en: 'Testimonials from customers about our services.',
    },
    group: {
      sl: 'Vsebina',
      de: 'Inhalt',
      en: 'Content',
    },
    // components:{
    //   views:{
    //     list: {
    //       Component: "/components/admin/collections/testimonials/testimonials-list.tsx",
    //     }
    //   }
    // }
  },
  access: {
    read: anyone, // Anyone can read testimonials
    create: superAdminOrTenantAdminAccess, // Only logged-in users can create
    update: superAdminOrTenantAdminAccess, // Only logged-in users can update
    delete: superAdminOrTenantAdminAccess, // Only logged-in users can delete
  },
  hooks: {
    afterChange: [revalidateTestimonialsCache],
    afterDelete: [revalidateTestimonialsCacheDelete],
  },
  fields: [
    slugField('title', {
      label: {
        sl: 'Unikatni ID',
        de: 'Eindeutige ID',
        en: 'Unique ID',
      },
      unique: true,
      index: true,
      admin: {
        description: {
          sl: 'ID se generira samodejno iz naslova.',
          de: 'ID wird automatisch aus dem Titel generiert.',
          en: 'ID is generated automatically from the title.',
        },
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        sl: 'Ime stranke',
        de: 'Name des Kunden',
        en: 'Customer Name',
      },
    },
    {
      name: 'testimonialDate',
      type: 'date',
      label: {
        sl: 'Datum mnenja',
        de: 'Datum der Bewertung',
        en: 'Testimonial Date',
      },
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
        description: {
          sl: 'Datum, ko je bilo mnenje podano.',
          de: 'Datum, wann die Bewertung abgegeben wurde.',
          en: 'Date when the testimonial was given.',
        },
      }
    },
    {
      name: 'source',
      type: 'select',
      label: {
        sl: 'Vir mnenja',
        de: 'Quelle der Bewertung',
        en: 'Testimonial Source',
      },
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Spletna stran', value: 'website' },
        { label: 'Ročni vnos', value: 'manual' },
      ],
      admin: {
        position: 'sidebar',
        description: {
          sl: 'Quelle der Bewertung',
          de: 'Quelle der Bewertung',
          en: 'Source of the testimonial',
        },
        }
    },
    {
      name: 'title',
      type: 'text',
      label: {
        sl: 'Naslov mnenja',
        de: 'Titel der Bewertung',
        en: 'Testimonial Title',
      },
      required:false,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: {
        sl: 'Vsebina mnenja',
        de: 'Inhalt der Bewertung',
        en: 'Testimonial Content',
      },
       // Content might need translation
    },
    {
      name: 'location',
      type: 'text',
      label: {
        sl: 'Lokacija (Neobvezno)',
        de: 'Standort (Optional)',
        en: 'Location (Optional)',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: {
        sl: 'Ocena (1-5)',
        de: 'Bewertung (1-5)',
        en: 'Rating (1-5)',
      },
      defaultValue: 5,
      admin: {
        step: 1,
        description: {
          sl: 'Ocena stranke od 1 do 5 zvezdic.',
          de: 'Bewertung des Kunden von 1 bis 5 Sterne.',
          en: 'Customer rating from 1 to 5 stars.',
        },
      }
    },
    {
      name: 'relatedItems',
      type: 'relationship',
      label: {
        sl: 'Povezana storitev (Neobvezno)',
        de: 'Verlinkte Leistung (Optional)',
        en: 'Linked Service (Optional)',
      },
      relationTo: ['services'], // Link to Services and Projects
      hasMany: true, // Allow linking multiple services or projects
      required: false,
      admin: {
        description: {
          sl: 'Povežite to mnenje s specifičnimi storitvami ali projekti.',
          de: 'Verknüpft eine Bewertung mit bestimmten Leistungen oder Projekten.',
          en: 'Links a testimonial to specific services or projects.',
        },
      }
    }
  ],
}; 