import { GlobalConfig, Access } from 'payload';

// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;
const isAdmin: Access = ({ req }) => {
  if (!req.user) return false;
  // Assuming 'admin' role exists
  return req.user.roles?.includes('admin') ?? false;
};

export const BusinessInfo: GlobalConfig = {
  slug: 'business-info',
  label: 'Podatki o podjetju',
  access: {
    read: anyone,
    update: isAdmin, // Only admins can update business info
  },
  fields: [
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
      name:"companyAbout",
      label: "O podjetju",
      type: "textarea",
      required: true,
    },
    {
      name: 'vatId',
      label: 'Davčna številka (ID za DDV)',
      type: 'text',
      required: true,
    },
    {
      name: 'businessId',
      label: 'Matična številka',
      type: 'text',
      required: true,
    },
    {
      name: 'registryDate',
      label: 'Datum vpisa v register',
      type: 'date',
      required: true,
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
      required: true,
    },
    {
      name: 'phoneNumber',
      label: 'Telefonska številka',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'E-poštni naslov',
      type: 'email',
      required: true,
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
      name: 'logo',
      label: 'Logotip (Temna varianta)',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
      name: 'serviceRadius',
      label: 'Območje storitev (v metrih)',
      type: 'number',
      required: true,
      admin: {
        description: 'Radius v metrih, ki označuje območje kjer podjetje nudi svoje storitve.',
      },
    },
    {
      name: 'metaTitle',
      label: 'SEO Meta naslov',
      type: 'text',
      required: true,
      admin: {
        description: 'Naslov, ki se prikaže v zavihku brskalnika in rezultatih iskanja.',
      },
    },
    {
      name: 'metaDescription',
      label: 'SEO Meta opis',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Kratek opis strani za rezultate iskanja (približno 155-160 znakov).',
      },
    },
  ],
}; 