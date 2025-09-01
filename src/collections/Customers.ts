import { isSuperAdminAccess } from '@/access/isSuperAdminAccess';
import { CollectionConfig, Access } from 'payload';

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Stranka',
    plural: 'Stranke',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'phone', 'town', 'createdAt'],
    group: 'Prodaja',
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
      label: 'Ime',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Priimek',
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
      label: 'E-pošta',
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
      label: 'Telefon',
      admin: {
        placeholder: '+386 ...',
      },
    },
    {
      name: 'address',
      type: 'group',
      label: 'Naslov',
      fields: [
        {
          name: 'streetAddress',
          type: 'text',
          required: true,
          label: 'Ulica in hišna številka',
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          label: 'Poštna številka',
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
          label: 'Kraj',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Država',
          defaultValue: 'Slovenija',
        },
      ],
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      label: 'Opombe stranke',
      admin: {
        description: 'Dodatne informacije o stranki ali posebne zahteve',
      },
    },
    {
      name: 'gdprConsent',
      type: 'checkbox',
      label: 'GDPR soglasje',
      defaultValue: false,
      admin: {
        description: 'Stranka je podala soglasje za obdelavo osebnih podatkov',
      },
    },
    {
      name: 'marketingConsent',
      type: 'checkbox',
      label: 'Marketinško soglasje',
      defaultValue: false,
      admin: {
        description: 'Stranka soglaša s prejemanjem marketinških sporočil',
      },
    },
    {
      name: 'customerType',
      type: 'select',
      label: 'Tip stranke',
      options: [
        {
          label: 'Fizična oseba',
          value: 'individual',
        },
        {
          label: 'Podjetje',
          value: 'company',
        },
      ],
      defaultValue: 'individual',
    },
    {
      name: 'companyInfo',
      type: 'group',
      label: 'Podatki podjetja',
      admin: {
        condition: (data) => data.customerType === 'company',
      },
      fields: [
        {
          name: 'companyName',
          type: 'text',
          label: 'Ime podjetja',
        },
        {
          name: 'taxNumber',
          type: 'text',
          label: 'Davčna številka',
        },
        {
          name: 'registrationNumber',
          type: 'text',
          label: 'Matična številka',
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