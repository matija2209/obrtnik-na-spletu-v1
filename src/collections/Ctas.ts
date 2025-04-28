import { CollectionConfig, Access } from 'payload';

// Define access control
const anyone: Access = () => true;
const isAdmin: Access = ({ req }) => {
  if (!req.user) return false;
  return req.user.roles?.includes('admin') ?? false;
};

export const Ctas: CollectionConfig = {
  slug: 'ctas',
  labels: {
    singular: 'Gumb',
    plural: 'Gumbi',
  },
  admin: {
    useAsTitle: 'ctaText', // Use ctaText as the title in the admin UI
    defaultColumns: ['ctaText', 'ctaHref', 'ctaClassname', 'updatedAt'],
    description: 'Reusable Call-to-Action buttons.',
  },
  access: {
    read: anyone,
    create: anyone,
    update: anyone,
    delete: anyone,
  },
  fields: [
    {
      name: 'ctaText',
      type: 'text',
      label: 'Besedilo gumba',
      required: true,
      localized: true,
      admin: {
        description: 'Besedilo, ki bo prikazano na gumbu.'
      }
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'Povezava gumba (URL ali sidro)',
      required: true,
      admin: {
        description: 'Kam naj gumb vodi (npr. /kontakt, /#storitve, https://example.com).'
      }
    },
    {
      name: 'ctaClassname',
      type: 'text',
      label: 'CSS Razred (neobvezno)',
      required: false,
      admin: {
        description: 'Dodaten CSS razred za stilsko oblikovanje gumba na spletni strani (npr. primary-button, secondary-button).'
      }
    },
    {
      name: 'ctaType',
      type: 'select',
      label: 'Tip Gumba (Stil)',
      required: false,
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Destructive', value: 'destructive' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' },
        { label: 'Link', value: 'link' },
        { label: 'Icon', value: 'icon' },
      ],
      admin: {
        description: 'Izberite stil gumba (npr. Primary, Secondary). To lahko vpliva na izgled gumba na spletni strani.',
      },
      defaultValue: 'primary', // Optional: Set a default value
    }
  ],
}; 