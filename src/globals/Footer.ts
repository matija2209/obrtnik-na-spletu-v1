import { GlobalConfig, Access } from 'payload';
import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';

// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Noga strani',
  access: {
    read: anyone,
    update: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Družabna omrežja',
      admin: {
        description: 'Dodajte povezave do družabnih omrežij, ki se bodo prikazale v nogi strani.',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platforma',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Google Review', value: 'google' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Besedilo avtorskih pravic',
      admin: {
        description: 'Besedilo avtorskih pravic, ki bo prikazano na dnu noge. Uporabite {{year}} za dinamično leto.',
      },
      defaultValue: '© {{year}} Vse pravice pridržane.',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo (opcijsko)',
      required: false,
    },
    {
      name: 'quickLinks',
      type: 'array',
      label: 'Hitre povezave',
      admin: {
        description: 'Dodajte hitre povezave, ki se bodo prikazale v nogi.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Oznaka',
          required: true,
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
    },
    {
      name: 'showContactInFooter',
      type: 'checkbox',
      label: 'Prikaži kontaktne podatke v nogi',
      defaultValue: true,
    },
    {
      name: 'showPrivacyLinks',
      type: 'checkbox',
      label: 'Prikaži povezave do Pravnih obvestil in Zasebnosti',
      defaultValue: true,
    },
  ],
};

export default Footer; 