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
    // Basic Info Fields
    {
      name: 'companyName',
      label: 'Ime podjetja',
      type: 'text',
      required: true,
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
      name: 'address',
      label: 'Naslov / Lokacija',
      type: 'text',
      required: false,
    },
    {
      name: 'phone',
      label: 'Telefonska številka',
      type: 'text',
      required: false,
      admin: {
        description: 'Telefonska številka, ki jo želite prikazati na strani.',
        position: "sidebar"
      },
    },
    {
      name: 'email',
      label: 'E-poštni naslov',
      admin: {
        description: 'E-poštni naslov, ki se uporablja za obveščanje.',
        position: "sidebar"
      },
      type: 'email',
      required: false,
    },
    // Logos and Links Fields
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
      name: 'platforms',
      label: 'Povezave do platform',
      type: 'array',
      fields: [
        {
          name: 'platform',
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
          required: true,
        },
        {
          name: 'url',
          label: 'URL povezava do profila',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Dodajte povezave do vaših profilov na platformah za pridobivanje strank.',
      },
    },
    // Location Fields
    {
      name: 'coordinates',
      label: 'Koordinate sedeža',
      type: 'group',
      fields: [
        {
          name: 'latitude',
          label: 'Latitude',
          type: 'number',
          required: true,
          defaultValue: 46.2191697,
          admin: {
            description: 'Geografska širina lokacije podjetja.',
          },
        },
        {
          name: 'longitude',
          label: 'Longitude',
          type: 'number',
          required: true,
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
      name: 'radius',
      label: 'Območje storitev (v metrih)',
      type: 'number',
      required: false,
      admin: {
        description: 'Radius v metrih, ki označuje območje kjer podjetje nudi svoje storitve.',
      },
    },
  ],
}; 