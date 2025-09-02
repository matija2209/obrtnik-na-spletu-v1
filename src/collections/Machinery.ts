import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';

export const Machinery: CollectionConfig = {
  slug: 'machinery',
  labels: {
    singular: {
      en: 'Machine',
      sl: 'Stroj',
      de: 'Maschine',
    },
    plural: {
      en: 'Machines',
      sl: 'Stroji',
      de: 'Maschinen',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'updatedAt'],
    hidden: true,
    description: {
      sl: 'Podatki o gradbeni mehanizaciji.',
      de: 'Daten zur Bau-Mechanisierung.',
      en: 'Data on construction machinery.',
    },
    group: {
      sl: 'Dejavnost',
      de: 'Projekte',
      en: 'Projects',
    },
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess
  },
  fields: [
    {
      name: 'tabName',
      label: {
        sl: 'Ime zavihka',
        de: 'Tabellenname',
        en: 'Tab Name',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      label: {
        sl: 'Ime stroja (Model)',
        de: 'Maschinenname (Modell)',
        en: 'Machine Name (Model)',
      },
      type: 'text',
      required: true,
      admin: {
        description: {
          sl: 'Npr. Volvo EL70, Komatsu PC210',
          de: 'z.B. Volvo EL70, Komatsu PC210',
          en: 'e.g. Volvo EL70, Komatsu PC210',
        },
      },
    },
    {
      name: 'description',
      label: {
        sl: 'Splošni opis stroja',
        de: 'Allgemeiner Maschinenbeschreibung',
        en: 'General machine description',
      },
      type: 'richText',
      required: false,
    },
    {
      name: 'image',
      label: {
        sl: 'Slika stroja',
        de: 'Maschinenbild',
        en: 'Machine Image',
      },
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'specifications',
      label: {
        sl: 'Specifikacije / Poudarki',
        de: 'Spezifikationen / Highlights',
        en: 'Specifications / Highlights',
      },
      type: 'array',
      minRows: 0,
      fields: [
        {
          name: 'specName',
            label: {
            sl: 'Naziv specifikacije',
            de: 'Spezifikationsname',
            en: 'Specification Name',
          },
          type: 'text',
          required: true,
        },
        {
          name: 'specDetails',
          label: {
            sl: 'Podrobnosti',
            de: 'Details',
            en: 'Details',
          },
          type: 'array',
          minRows: 0,
          fields: [
            {
              name: 'detail',
              label: {
                sl: 'Podrobnost',
                de: 'Detail',
                en: 'Detail',
              },
              type: 'text',
              required: true,
            }
          ],
          required: true,
        },
      ],
      admin: {
        description: {
          sl: 'Dodajte ključne specifikacije.',
          de: 'Fügen Sie wichtige Spezifikationen hinzu.',
          en: 'Add important specifications.',
        },
      }
    },
    {
      name: 'notes',
      label: {
        sl: 'Dodatne opombe',
        de: 'Zusätzliche Notizen',
        en: 'Additional Notes',
      },
      type: 'textarea',
      required: false,
      admin: {
        description: {
          sl: 'Npr. Premik stroja na kolesih za krajše razdalje (do 40km)',
          de: 'z.B. Verschieben des Maschinen auf Räder für kürzere Entfernungen (bis 40km)',
          en: 'e.g. Moving the machine on wheels for shorter distances (up to 40km)',
        },
      }
    },
  ],
}; 