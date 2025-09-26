import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import type { CollectionConfig } from 'payload';

export const BusinessInfoCollection: CollectionConfig = {
  slug: 'business-info', // Using the same slug for potential data migration ease
  labels: {
    singular: {
      sl:'Podatki o podjetju',
      en:"Business info",
      de:"Geschaft info"
    },
    plural: {
      sl:'Podatki o podjetju',
      en:"Business info",
      de:"Geschaft info"
    },
  },
  access: {
    create: superAdminOrTenantAdminAccess,
    read: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess, // Consider if delete should be more restrictive
  },
  admin: {
    description: 'Osnovni podatki in nastavitve podjetja za vsakega najemnika.',
    group: {
      sl:'Konfiguracija',
      en:"Configuration",
      de:"Konfiguration"
    },
    useAsTitle: 'companyName', // Makes sense if super admin views a list
  },
  fields: [
    // Basic Info Fields
    {
      name: 'companyName',
      label: {
        sl: 'Ime podjetja',
        de: 'Firmenname',
        en: 'Company Name',
      },
      type: 'text',
      required: true,
      admin: {
        description: {
          sl: 'Polno ime podjetja.',
          de: 'Vollständiger Firmenname.',
          en: 'Full company name.',
        },
      },
    },
    {
      name: "companyAbout",
      label: {
        sl: "O podjetju",
        de: "Über das Unternehmen",
        en: "About the Company",
      },
      type: "textarea",
      required: false,
    },
    {
      name: 'vatId',
      label: {
        sl: 'Davčna številka (ID za DDV)',
        de: 'Steuer-ID (ID für Umsatzsteuer)',
        en: 'VAT ID (ID for VAT)',
      },
      type: 'text',
      required: false,
    },
    {
      name: 'businessId',
      label: {
        sl: 'Matična številka',
        de: 'Firmenregister-Nummer',
        en: 'Business ID',
      },
      type: 'text',
      required: false,
    },
    {
      name: 'registryDate',
      label: {
        sl: 'Datum vpisa v register',
        de: 'Eintragungsdatum im Register',
        en: 'Registration Date',
      },
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
      label: {
        sl: 'Naslov / Lokacija',
        de: 'Adresse / Standort',
        en: 'Address / Location',
      },
      type: 'text',
      required: false,
    },
    {
      name: 'phone',
      label: {
        sl: 'Telefonska številka',
        de: 'Telefonnummer',
        en: 'Phone Number',
      },
      type: 'text',
      required: false,
      admin: {
        description: {
          sl: 'Telefonska številka, ki jo želite prikazati na strani.',
          de: 'Telefonnummer, die auf der Website angezeigt werden soll.',
          en: 'Phone number to display on the website.',
        },
        position: "sidebar"
      },
    },
    {
      name: 'email',
      label: {
        sl: 'E-poštni naslov',
        de: 'E-Mail-Adresse',
        en: 'Email Address',
      },
      admin: {
        description: {
          sl: 'E-poštni naslov, ki se uporablja za obveščanje.',
          de: 'E-Mail-Adresse, die für Kontaktaufnahme verwendet wird.',
          en: 'Email address used for contact.',
        },
        position: "sidebar"
      },
      type: 'email',
      required: false,
    },
    // Logos and Links Fields
    {
      name: 'logo',
      label: {
        sl: 'Logotip (Temna varianta)',
        de: 'Logo (Dunkle Variante)',
        en: 'Logo (Dark Variant)',
      },
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: {
          sl: 'Temna varianta logotipa, ki se uporablja na svetlih ozadjih.',
          de: 'Dunkle Variante des Logos, die für helle Hintergründe verwendet wird.',
          en: 'Dark variant of the logo used on light backgrounds.',
        },
      },
    },
    {
      name: 'logoLight',
      label: {
        sl: 'Logotip (Svetla varianta)',
        de: 'Logo (Hellen Variante)',
        en: 'Logo (Light Variant)',
      },
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: {
          sl: 'Svetla varianta logotipa, ki se uporablja na temnih ozadjih. Če ni izbrana, se uporabi temna varianta.',
          de: 'Helle Variante des Logos, die für dunkle Hintergründe verwendet wird. Wenn nicht ausgewählt, wird die dunkle Variante verwendet.',
          en: 'Light variant of the logo used on dark backgrounds. If not selected, the dark variant is used.',
        },
      },
    },
    {
      name: 'platforms',
      label: {
        sl: 'Povezave do platform',
        de: 'Plattform-Links',
        en: 'Platform Links',
      },
      type: 'array',
      fields: [
        {
          name: 'platform',
          label: {
            sl: 'Ime platforme',
            de: 'Plattform-Name',
            en: 'Platform Name',
          },
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
          label: {
            sl: 'URL povezava do profila',
            de: 'URL-Link zum Profil',
            en: 'URL Link to Profile',
          },
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: {
          sl: 'Dodajte povezave do vaših profilov na platformah za pridobivanje strank.',
          de: 'Fügen Sie Links zu Ihren Profilen auf Plattformen hinzu, um Kunden zu gewinnen.',
          en: 'Add links to your profiles on platforms to acquire customers.',
        },
      },
    },
    // Location Fields
    {
      name: 'coordinates',
      label: {
        sl: 'Koordinate sedeža',
        de: 'Koordinaten des Standorts',
        en: 'Coordinates of the Location',
      },
      type: 'group',
      fields: [
        {
          name: 'latitude',
          label: {
            sl: 'Latitude',
            de: 'Breitengrad',
            en: 'Latitude',
          },
          type: 'number',
          required: true,
          defaultValue: 46.2191697,
          admin: {
            description: {
              sl: 'Geografska širina lokacije podjetja.',
              de: 'Geografische Breite der Unternehmensadresse.',
              en: 'Geographic latitude of the company location.',
            },
          },
        },
        {
          name: 'longitude',
          label: {
            sl: 'Longitude',
            de: 'Längengrad',
            en: 'Longitude',
          },
          type: 'number',
          required: true,
          defaultValue: 15.4705641,
          admin: {
              description: {
              sl: 'Geografska dolžina lokacije podjetja.',
              de: 'Geografische Länge der Unternehmensadresse.',
              en: 'Geographic longitude of the company location.',
            },
          },
        },
      ],
      admin: {
        description: {
          sl: 'Koordinate lokacije podjetja za prikaz na zemljevidu.',
          de: 'Koordinaten der Unternehmensadresse für die Anzeige auf der Karte.',
          en: 'Coordinates of the company location for display on the map.',
        },
      },
    },
    {
      name: 'radius',
      label: {
        sl: 'Območje storitev (v metrih)',
        de: 'Service-Radius (in Metern)',
        en: 'Service Radius (in Meters)',
      },
      type: 'number',
      required: false,
      admin: {
        description: {
          sl: 'Radius v metrih, ki označuje območje kjer podjetje nudi svoje storitve.',
          de: 'Radius in Metern, der das Service-Bereich des Unternehmens angibt.',
          en: 'Radius in meters indicating the area where the company provides its services.',
        },
      },
    },
  ],
}; 