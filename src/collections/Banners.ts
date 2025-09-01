import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig, Access } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

// Define access control
const anyone: Access = () => true;

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: 'Pasica', // Banner in Slovenian
    plural: 'Pasice',  // Banners in Slovenian
  },
  admin: {
    useAsTitle: 'internalName', // Use internalName as the title in the admin UI
    defaultColumns: ['internalName', 'isActive', 'startDate', 'endDate', 'updatedAt'],
    hidden: true,
    description: 'Pasice za prikazovanje obvestil, ponudb, itd.', // Translated description
    group: 'Vsebina', // Translated group name
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
      label: 'Oznaka', // Changed from 'Interno Ime'
      required: true,
      admin: {
        description: 'Služi samo za identifikacijo v administracijskem vmesniku.', // Translated description
      }
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Vsebina Pasice', // Banner Content
      required: true,
      localized: true,
      editor: lexicalEditor({}), // Ensure lexical editor is configured if needed globally or here
      admin: {
        description: 'Glavna vsebina, ki bo prikazana v pasici.', // Translated description
      }
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Je Aktivna?', // Is Active?
      defaultValue: false,
      admin: {
        description: 'Označite to polje, da bo pasica potencialno vidna na spletni strani (ob upoštevanju datumov).', // Translated description
      }
    },
    {
      type: 'row', // Layout start and end dates side-by-side
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Datum Začetka', // Start Date
          required: false,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime', // Allow selecting time as well
            },
            description: 'Pasica bo aktivna od tega datuma/ure (neobvezno).', // Translated description
            width: '50%',
          }
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Datum Konca', // End Date
          required: false,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime', // Allow selecting time as well
            },
            description: 'Pasica bo neaktivna po tem datumu/uri (neobvezno).', // Translated description
            width: '50%',
          }
        },
      ]
    },
    {
      name: 'cta',
      label: 'Poziv k akciji (CTA) gumb (Neobvezno)', // Translated label
      type: 'relationship',
      relationTo: 'ctas', // Link to the Ctas collection
      required: false,
      admin: {
        description: 'Izberite neobvezen CTA gumb, ki bo prikazan skupaj s pasico.', // Translated description
      }
    }
  ],
}; 