import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig, Access } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

// Define access control
const anyone: Access = () => true;

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: {
      en: 'Banner',
      sl: 'Pasica',
      de: 'Banner',
    },
    plural: {
      en: 'Banners',
      sl: 'Pasice',
      de: 'Banners',
    },
  },
  admin: {
    useAsTitle: 'internalName', // Use internalName as the title in the admin UI
    defaultColumns: ['internalName', 'isActive', 'startDate', 'endDate', 'updatedAt'],
    hidden: true,
    description: 'Pasice za prikazovanje obvestil, ponudb, itd.', // Translated description
    group: {
      sl: 'Vsebina',
      de: 'Inhalt',
      en: 'Content',
    }, // Translated group name
  },
  access: {
    read: anyone, // Anyone can potentially read active banners (frontend logic will filter)
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'internalName',
      type: 'text',
      label: {
        sl: 'Oznaka', // Changed from 'Interno Ime'
        de: 'Bezeichnung',
        en: 'Label',
      },
      required: true,
      admin: {
        description: {
          sl: 'Služi samo za identifikacijo v administracijskem vmesniku.', // Translated description
          de: 'Wird nur für die Identifikation im Admin-Interface verwendet.',
          en: 'Used only for identification in the admin interface.',
        },
      }
    },
    {
      name: 'content',
      type: 'richText',
      label: {
        sl: 'Vsebina Pasice', // Banner Content
        de: 'Inhalt der Banner',
        en: 'Banner Content',
      },
      required: true,
      
      editor: lexicalEditor({}), // Ensure lexical editor is configured if needed globally or here
      admin: {
        description: {
          sl: 'Glavna vsebina, ki bo prikazana v pasici.', // Translated description
          de: 'Hauptinhalt, der in der Banner angezeigt wird.',
          en: 'Main content that will be displayed in the banner.',
        },
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: {
        sl: 'Je Aktivna?', // Is Active?
        de: 'Ist aktiv?',
        en: 'Is Active?',
      },
      defaultValue: false,
      admin: {
        description: {
          sl: 'Označite to polje, da bo pasica potencialno vidna na spletni strani (ob upoštevanju datumov).', // Translated description
          de: 'Markieren Sie dieses Feld, um die Banner möglicherweise auf der Website anzuzeigen (bei Berücksichtigung von Datumsangaben).',
          en: 'Check this field to make the banner potentially visible on the website (considering dates).',
        },
      }
    },
    {
      type: 'row', // Layout start and end dates side-by-side
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: {
            sl: 'Datum Začetka', // Start Date
            de: 'Startdatum',
            en: 'Start Date',
          },
          required: false,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime', // Allow selecting time as well
            },
            description: {
              sl: 'Pasica bo aktivna od tega datuma/ure (neobvezno).', // Translated description
              de: 'Die Banner ist aktiv ab diesem Datum/Uhrzeit (optional).',
              en: 'The banner is active from this date/time (optional).',
            },
            width: '50%',
          }
        },
        {
          name: 'endDate',
          type: 'date',
          label: {
            sl: 'Datum Konca', // End Date
            de: 'Enddatum',
            en: 'End Date',
          },
          required: false,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime', // Allow selecting time as well
            },
            description: {
              sl: 'Pasica bo neaktivna po tem datumu/uri (neobvezno).', // Translated description
              de: 'Die Banner ist nicht aktiv nach diesem Datum/Uhrzeit (optional).',
              en: 'The banner is not active after this date/time (optional).',
            },
            width: '50%',
          }
        },
      ]
    },
    {
      name: 'cta',
      label: {
        sl: 'Poziv k akciji (CTA) gumb (Neobvezno)', // Translated label
        de: 'CTA-Button für Aktion (optional)',
        en: 'CTA Button for Action (optional)',
      },
      type: 'relationship',
      relationTo: 'ctas', // Link to the Ctas collection
      required: false,
      admin: {
        description: {
          sl: 'Izberite neobvezen CTA gumb, ki bo prikazan skupaj s pasico.', // Translated description
          de: 'Wählen Sie einen optionalen CTA-Button, der zusammen mit dem Banner angezeigt wird.',
          en: 'Select an optional CTA button that will be displayed together with the banner.',
        },
      }
    }
  ],
}; 