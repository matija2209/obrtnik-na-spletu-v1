import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig } from 'payload';

export const BusinessInfoCollection: CollectionConfig = {
  slug: 'business-info', // Using the same slug for potential data migration ease
  labels: {
    singular: 'Podatki o podjetju',
    plural: 'Podatki o podjetju',
  },
  access: {
    create: superAdminOrTenantAdminAccess,
    read: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess, // Consider if delete should be more restrictive
  },
  admin: {
    description: 'Osnovni podatki in nastavitve podjetja za vsakega najemnika.',
    group: 'Konfiguracija',
    useAsTitle: 'companyName', // Makes sense if super admin views a list
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Osnovni podatki',
          fields: [
            {
              name: 'companyName',
              label: 'Ime podjetja',
              type: 'text',
              required: false,
              admin: {
                description: 'Polno ime podjetja.',
              },
            },
            {
              name: "companyAbout",
              label: "O podjetju",
              type: "textarea",
              required: false,
            },
            {
              name: 'vatId',
              label: 'Davčna številka (ID za DDV)',
              type: 'text',
              required: false,
            },
            {
              name: 'businessId',
              label: 'Matična številka',
              type: 'text',
              required: false,
            },
            {
              name: 'registryDate',
              label: 'Datum vpisa v register',
              type: 'date',
              required: false,
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'dd.MM.yyyy',
                },
              },
            },
            {
              name: 'location',
              label: 'Naslov / Lokacija',
              type: 'text',
              required: false,
            },
            {
              name: 'phoneNumber',
              label: 'Telefonska številka',
              type: 'text',
              required: false,
            },
            {
              name: 'email',
              label: 'E-poštni naslov',
              type: 'email',
              required: false,
            },
          ],
        },
        {
          label: 'Logotipi in Povezave',
          fields: [
            {
              name: 'logo',
              label: 'Logotip (Temna varianta)',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Temna varianta logotipa, ki se uporablja na svetlih ozadjih.',
              },
            },
            {
              name: 'logoLight',
              label: 'Logotip (Svetla varianta)',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Svetla varianta logotipa, ki se uporablja na temnih ozadjih. Če ni izbrana, se uporabi temna varianta.',
              },
            },
            {
              name: 'facebookUrl',
              label: 'Facebook URL',
              type: 'text',
            },
            {
              name: 'googleReviewUrl',
              label: 'Povezava za Google oceno',
              type: 'text',
            },
            {
              name: 'leadGenPlatformUrls',
              label: 'Povezave do platform',
              type: 'array',
              fields: [
                {
                  name: 'platformName',
                  label: 'Ime platforme',
                  type: 'select',
                  options: [
                    {
                      label: 'Primerjam.si',
                      value: 'Primerjam.si',
                    },
                    {
                      label: 'Omisli.si',
                      value: 'Omisli.si',
                    },
                    {
                      label: 'MojMojster.net',
                      value: 'MojMojster.net',
                    },
                  ],
                  required: false,
                },
                {
                  name: 'url',
                  label: 'URL povezava do profila',
                  type: 'text',
                  required: false,
                },
              ],
              admin: {
                description: 'Dodajte povezave do vaših profilov na platformah za pridobivanje strank.',
              },
            },
          ]
        },
        {
          label: "Lokacija",
          fields: [
            {
              name: 'coordinates',
              label: 'Koordinate sedeža',
              type: 'group',
              fields: [
                {
                  name: 'latitude',
                  label: 'Latitude',
                  type: 'number',
                  required: false,
                  defaultValue: 46.2191697,
                  admin: {
                    description: 'Geografska širina lokacije podjetja.',
                  },
                },
                {
                  name: 'longitude',
                  label: 'Longitude',
                  type: 'number',
                  required: false,
                  defaultValue: 15.4705641,
                  admin: {
                    description: 'Geografska dolžina lokacije podjetja.',
                  },
                },
              ],
              admin: {
                description: 'Koordinate lokacije podjetja za prikaz na zemljevidu.',
              },
            },
            {
              name: 'serviceRadius',
              label: 'Območje storitev (v metrih)',
              type: 'number',
              required: false,
              admin: {
                description: 'Radius v metrih, ki označuje območje kjer podjetje nudi svoje storitve.',
              },
            },
          ]
        },
        {
          label: "SEO",
          fields: [
            {
              name: 'metaTitle',
              label: 'SEO Meta naslov',
              type: 'text',
              required: false,
              admin: {
                description: 'Naslov, ki se prikaže v zavihku brskalnika in rezultatih iskanja.',
              },
            },
            {
              name: 'metaDescription',
              label: 'SEO Meta opis',
              type: 'textarea',
              required: false,
              admin: {
                description: 'Kratek opis strani za rezultate iskanja (približno 155-160 znakov).',
              },
            },
          ]
        },
      ]
    }
  ],
}; 