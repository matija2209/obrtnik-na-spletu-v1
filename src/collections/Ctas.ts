import { superAdminOrTenantAdminAccess } from '@/access/superAdminOrTenantAdmin';
import { CollectionConfig, Access } from 'payload';

// Define access control
const anyone: Access = () => true;

export const Ctas: CollectionConfig = {
  slug: 'ctas',
  labels: {
    singular: 'Poziv k dejanju (CTA)',
    plural: 'Pozivi k dejanju (CTA)',
  },
  admin: {
    useAsTitle: 'ctaText', // Use ctaText as the title in the admin UI
    defaultColumns: ['ctaText', 'link.type', 'ctaType', 'updatedAt'],
    description: 'Upravljajte pozive k dejanju, ki jih lahko vključite na različnih mestih.',
    group: 'Vsebina',
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
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
      name: 'link',
      type: 'group',
      label: 'Povezava gumba',
      fields: [
        {
          name: 'type',
          type: 'radio',
          label: 'Tip povezave',
          options: [
            { label: 'Notranja stran', value: 'internal' },
            { label: 'Zunanji URL', value: 'external' },
          ],
          defaultValue: 'internal',
          required: true,
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'internalLink',
          label: 'Izberi stran',
          type: 'relationship',
          relationTo: 'pages', // Link primarily to Pages, could add more relations if needed
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'internal',
          }
        },
        {
          name: 'externalUrl',
          label: 'Vnesi URL',
          type: 'text',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'external',
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData: { type?: string } }) => {
            if (siblingData?.type === 'external' && !value) {
              return 'URL je obvezen za zunanje povezave.';
            }
            // Basic URL validation (optional but recommended)
            // if (siblingData?.type === 'external' && value && !value.startsWith('http')) {
            //   return 'URL se mora začeti s http:// ali https://';
            // }
            return true;
          },
        },
        {
          name: 'newTab',
          label: 'Odpri v novem zavihku?',
          type: 'checkbox',
          defaultValue: false,
        }
      ]
    },
    {
      name: 'icon',
      label: 'Ikona (Lucide ime, neobvezno)',
      type: 'text',
      required: false,
      admin: {
        description: 'Vnesite ime ikone iz knjižnice Lucide React (npr. ArrowRight, CheckCircle).',
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