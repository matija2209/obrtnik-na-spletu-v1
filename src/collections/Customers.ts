import { isSuperAdminAccess } from '@/access/isSuperAdminAccess';
import { CollectionConfig, Access } from 'payload';

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: {
      en: 'Customer',
      sl: 'Stranka',
      de: 'Kunde',
    },
    plural: {
      en: 'Customers',
      sl: 'Stranke',
      de: 'Kunden',
    },
  },
  admin: {
    useAsTitle: 'fullName',
    hidden: true,
    defaultColumns: ['fullName', 'email', 'phone', 'town', 'createdAt'],
    group: {
      sl: 'Prodaja',
      de: 'Verkauf',
      en: 'Sales',
    },
  },
  access: {
    read: isSuperAdminAccess,
    create: isSuperAdminAccess,
    update: isSuperAdminAccess,
    delete: isSuperAdminAccess,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: {
        sl: 'Ime',
        de: 'Vorname',
        en: 'First Name',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: {
        sl: 'Priimek',
        de: 'Nachname',
        en: 'Last Name',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.firstName && data?.lastName) {
              return `${data.firstName} ${data.lastName}`;
            }
            return data?.fullName;
          },
        ],
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: {
        sl: 'E-pošta',
        de: 'E-Mail',
        en: 'Email',
      },
      validate: (val: string | null | undefined) => {
        if (!val) return 'E-poštni naslov je obvezen.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return 'Neveljaven e-poštni naslov.';
        return true;
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: {
        sl: 'Telefon',
        de: 'Telefon',
        en: 'Phone',
      },
      admin: {
        placeholder: '+386 ...',
      },
    },
    {
      name: 'address',
      type: 'group',
      label: {
        sl: 'Naslov',
        de: 'Adresse',
        en: 'Address',
      },
      fields: [
        {
          name: 'streetAddress',
          type: 'text',
          required: true,
          label: {
            sl: 'Ulica in hišna številka',
            de: 'Straße und Hausnummer',
            en: 'Street and House Number',
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          label: {
            sl: 'Poštna številka',
            de: 'Postleitzahl',
            en: 'Postal Code',
          },
          validate: (val: string | null | undefined) => {
            if (!val) return 'Poštna številka je obvezna.';
            // More flexible postal code validation - allow 3-5 digits
            const trimmedVal = val.trim();
            if (!/^\d{3,5}$/.test(trimmedVal)) return 'Poštna številka mora vsebovati 3-5 številk.';
            return true;
          },
        },
        {
          name: 'town',
          type: 'text',
          required: true,
            label: {
            sl: 'Kraj',
            de: 'Ort',
            en: 'Town',
          },
        },
        {
          name: 'country',
          type: 'text',
          label: {
            sl: 'Država',
            de: 'Land',
            en: 'Country',
          },
          defaultValue: 'Slovenija',
        },
      ],
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      label: {
        sl: 'Opombe stranke',
        de: 'Notizen zur Kunden',
        en: 'Customer Notes',
      },
      admin: {
        description: {
          sl: 'Dodatne informacije o stranki ali posebne zahteve',
          de: 'Zusätzliche Informationen zur Kunden oder spezielle Anforderungen',
          en: 'Additional information about the customer or special requirements',
        },
      },
    },
    {
      name: 'gdprConsent',
      type: 'checkbox',
      label: {
        sl: 'GDPR soglasje',
        de: 'GDPR-Zustimmung',
        en: 'GDPR Consent',
      },
      defaultValue: false,
      admin: {
        description: {
          sl: 'Stranka je podala soglasje za obdelavo osebnih podatkov',
          de: 'Die Kunden hat die Zustimmung zur Verarbeitung personenbezogener Daten erteilt',
          en: 'The customer has given consent to the processing of personal data',
        },
      },
    },
    {
      name: 'marketingConsent',
      type: 'checkbox',
        label: {
        sl: 'Marketinško soglasje',
        de: 'Marketing-Zustimmung',
        en: 'Marketing Consent',
      },
      defaultValue: false,
      admin: {
        description: {
          sl: 'Stranka soglaša s prejemanjem marketinških sporočil',
          de: 'Die Kunden stimmt der Empfang von Marketing-Nachrichten zu',
          en: 'The customer agrees to receive marketing messages',
        },
      },
    },
    {
      name: 'customerType',
      type: 'select',
      label: {
        sl: 'Tip stranke',
        de: 'Kundenart',
        en: 'Customer Type',
      },
      options: [
        {
          label: {
            sl: 'Fizična oseba',
            de: 'Natürliche Person',
            en: 'Individual',
          },
          value: 'individual',
        },
        {
          label: {
            sl: 'Podjetje',
            de: 'Unternehmen',
            en: 'Company',
          },
          value: 'company',
        },
      ],
      defaultValue: 'individual',
    },
    {
      name: 'companyInfo',
      type: 'group',
      label: {
        sl: 'Podatki podjetja',
        de: 'Unternehmensinformationen',
        en: 'Company Information',
      },
      admin: {
        condition: (data) => data.customerType === 'company',
      },
      fields: [
        {
          name: 'companyName',
          type: 'text',
          label: {
            sl: 'Ime podjetja',
            de: 'Firmenname',
            en: 'Company Name',
          },
        },
        {
          name: 'taxNumber',
          type: 'text',
          label: {
            sl: 'Davčna številka',
            de: 'Steuer-ID',
            en: 'Tax Number',
          },
        },
        {
          name: 'registrationNumber',
          type: 'text',
          label: {
            sl: 'Matična številka',
            de: 'Registrierungsnummer',
            en: 'Registration Number',
          },
        },
      ],
    }
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-generate fullName
        if (data?.firstName && data?.lastName) {
          data.fullName = `${data.firstName} ${data.lastName}`;
        }
        return data;
      },
    ],
  },
  timestamps: true,
};