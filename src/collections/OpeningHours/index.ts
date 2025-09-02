import { slugField } from '@/fields/slug';
import type { CollectionConfig } from 'payload';

export const OpeningHours: CollectionConfig = {
  slug: 'opening-hours',
  labels: {
    singular: {
      en: 'Opening Hours',
      sl: 'Urnik',
      de: 'Öffnungszeiten',
    },
    plural: {
      en: 'Opening Hours',
      sl: 'Urniki',
      de: 'Öffnungszeiten',
    },
  },
  admin: {
    useAsTitle: 'name',
    description: {
      sl: 'Določite različne urnike odpiralnega časa (npr. redni, sezonski, nujni).',
      de: 'Legen Sie verschiedene Öffnungszeiten fest (z.B. regulär, saisonal, notwendig).',
      en: 'Specify different opening hours (e.g. regular, seasonal, necessary).',
    },
    defaultColumns: ['name', 'startDate', 'endDate', 'updatedAt'],
    group: {
      sl: 'Nastavitve',
      de: 'Einstellungen',
      en: 'Settings',
    }, // Grouping in admin UI
  },
  access: {
    read: () => true, // Allow public read access
  },
  fields: [
    slugField('name', {
      label: {
        sl: 'Pot / Unikatni ID',
        de: 'Pfad / Eindeutige ID',
        en: 'Path / Unique ID',
      },
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
        description: {
          sl: 'Npr. "Redni urnik", "Poletni urnik", "Dežurstvo"',
          de: 'Z.B. "Regulärer Urnik", "Saisonaler Urnik", "Notwendig"',
          en: 'E.g. "Summer timetable", "Winter timetable", "Emergency"',
        },
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
            description: {
              sl: 'Neobvezno. Urnik velja od tega datuma dalje.',
              de: 'Optional. Der Urnik gilt ab diesem Datum.',
              en: 'Optional. The timetable is valid from this date onwards.',
            },
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
            description: {
              sl: 'Neobvezno. Urnik velja do tega datuma.',
              de: 'Optional. Der Urnik gilt bis zu diesem Datum.',
              en: 'Optional. The timetable is valid until this date.',
            },
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
      label: {
        sl: 'Pravila Dnevnega Urnika',
        de: 'Regeln für den täglichen Urnik',
        en: 'Rules for the daily timetable',
      },
      minRows: 1,
      fields: [
        {
          name: 'days',
          type: 'select',
          label: {
            sl: 'Dnevi v Tednu',
            de: 'Tage im Woche',
            en: 'Days of the Week',
          },
          hasMany: true,
          required: true,
          options: [
            { label: {
              sl: 'Ponedeljek',
              de: 'Montag',
              en: 'Monday',
            }, value: 'monday' },
            { label: 'Torek', value: 'tuesday' },
            { label: 'Sreda', value: 'wednesday' },
            { label: {
              sl: 'Četrtek',
              de: 'Donnerstag',
              en: 'Thursday',
            }, value: 'thursday' },
            { label: {
              sl: 'Petek',
              de: 'Freitag',
              en: 'Friday',
            }, value: 'friday' },
            { label: {
              sl: 'Sobota',
              de: 'Samstag',
              en: 'Saturday',
            }, value: 'saturday' },
            { label: {
              sl: 'Nedelja',
              de: 'Sonntag',
              en: 'Sunday',
            }, value: 'sunday' },
          ],
        },
        {
          name: 'timeSlots',
          type: 'array',
          label: {
            sl: 'Časovni Termini',
            de: 'Zeitfenster',
            en: 'Time Slots',
          },
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
                  label: {
                    sl: 'Začetni Čas',
                    de: 'Startzeit',
                    en: 'Start Time',
                  },
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
                  label: {
                    sl: 'Končni Čas',
                    de: 'Endzeit',
                    en: 'End Time',
                  },
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
              label: {
                sl: 'Opombe',
                de: 'Notizen',
                en: 'Notes',
              },
              admin: {
                description: {
                  sl: 'Neobvezne opombe za ta specifični časovni termin (npr. "Samo po naročilu")',
                  de: 'Optionale Notizen für dieses Zeitfenster (z.B. "Nur auf Bestellung")',
                  en: 'Optional notes for this specific time slot (e.g. "Only on order")',
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        sl: 'Splošne Opombe',
        de: 'Allgemeine Notizen',
        en: 'General Notes',
      },
      admin: {
        description: {
          sl: 'Neobvezne splošne opombe za celoten urnik.',
          de: 'Optionale allgemeine Notizen für den gesamten Urnik.',
          en: 'Optional general notes for the entire timetable.',
        },
      },
    },
  ],
}; 