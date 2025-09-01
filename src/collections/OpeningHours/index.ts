import { slugField } from '@/fields/slug';
import type { CollectionConfig } from 'payload';

export const OpeningHours: CollectionConfig = {
  slug: 'opening-hours',
  labels: {
    singular: 'Urnik',
    plural: 'Urniki',
  },
  admin: {
    useAsTitle: 'name',
    description: 'Določite različne urnike odpiralnega časa (npr. redni, sezonski, nujni).',
    defaultColumns: ['name', 'startDate', 'endDate', 'updatedAt'],
    group: 'Nastavitve', // Grouping in admin UI
    hidden: true,
  },
  access: {
    read: () => true, // Allow public read access
  },
  fields: [
    slugField('name', {
      label: 'Pot / Unikatni ID',
      unique: true,
      index: true,
      admin: {
        description: 'ID se generira samodejno iz naslova, lahko pa ga definirate ročno. Uporabno pri uvažanju podatkov.',
        readOnly: false,
        position: 'sidebar',
      }
    }),
    {
      name: 'name',
      type: 'text',
      label: 'Ime Urnika',
      required: true,
      admin: {
        description: 'Npr. "Redni urnik", "Poletni urnik", "Dežurstvo"',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Velja Od',
          admin: {
            description: 'Neobvezno. Urnik velja od tega datuma dalje.',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd.MM.yyyy',
            },
            width: '50%',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Velja Do',
          admin: {
            description: 'Neobvezno. Urnik velja do tega datuma.',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd.MM.yyyy',
            },
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'dailyHours',
      type: 'array',
      label: 'Pravila Dnevnega Urnika',
      minRows: 1,
      fields: [
        {
          name: 'days',
          type: 'select',
          label: 'Dnevi v Tednu',
          hasMany: true,
          required: true,
          options: [
            { label: 'Ponedeljek', value: 'monday' },
            { label: 'Torek', value: 'tuesday' },
            { label: 'Sreda', value: 'wednesday' },
            { label: 'Četrtek', value: 'thursday' },
            { label: 'Petek', value: 'friday' },
            { label: 'Sobota', value: 'saturday' },
            { label: 'Nedelja', value: 'sunday' },
          ],
        },
        {
          name: 'timeSlots',
          type: 'array',
          label: 'Časovni Termini',
          required: true,
          minRows: 1,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'startTime',
                  type: 'date',
                  required: true,
                  label: 'Začetni Čas',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      timeFormat: 'HH:mm',
                      timeIntervals: 5, // 5-minute intervals
                    },
                    width: '50%',
                  },
                },
                {
                  name: 'endTime',
                  type: 'date',
                  required: true,
                  label: 'Končni Čas',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      timeFormat: 'HH:mm',
                      timeIntervals: 5, // 5-minute intervals
                    },
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'notes',
              type: 'textarea',
              label: 'Opombe',
              admin: {
                description: 'Neobvezne opombe za ta specifični časovni termin (npr. "Samo po naročilu")',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Splošne Opombe',
      admin: {
        description: 'Neobvezne splošne opombe za celoten urnik.',
      },
    },
  ],
}; 