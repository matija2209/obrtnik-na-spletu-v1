import { GlobalConfig, Access, FieldHook } from 'payload';

// Define access control - allowing anyone to read, admin to update
const anyone: Access = () => true;
const isAdmin: Access = ({ req}) => {
  if (!req.user) return false;
  return req.user.roles?.includes('admin') ?? false;
};

// Available icons for dropdown items based on desktop-navbar.tsx
const iconOptions = [
  { label: 'Sparkles', value: 'Sparkles' },
  { label: 'Zap', value: 'Zap' },
  { label: 'Droplet (Drop)', value: 'Drop' },
  { label: 'Hand (Hands)', value: 'Hands' },
  { label: 'Footprints', value: 'Footprints' },
  { label: 'Paintbrush', value: 'Paintbrush' },
];

// Define a type for the sibling data in navItems for better type safety
type NavItemSiblingData = {
  hasChildren?: boolean;
  // other fields if needed for condition logic
};

// Define a type for the sibling data in children array
type ChildItemSiblingData = {
 // Define fields if needed for condition logic in child items
};

export const Navbar: GlobalConfig = {
  slug: 'navbar',
  label: 'Navigacija',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Naslov',
      required: false,
    },
    {
      name: 'navItems',
      label: 'Elementi navigacije',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Element navigacije',
        plural: 'Elementi navigacije',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Naslov',
          required: true,
          localized: true,
        },
        {
          name: 'hasChildren',
          type: 'checkbox',
          label: 'Ima spustni meni?',
          defaultValue: false,
        },
        // Conditionally shown fields for parent items
        {
          name: 'href',
          type: 'text',
          label: 'Povezava (za elemente brez spustnega menija)',
          required: true,
          admin: {
            condition: (_: any, siblingData: NavItemSiblingData) => !(siblingData.hasChildren ?? false),
            description: 'Vnesite ciljno pot, npr. /o-nas ali #kontakt.',
          },
        },
        // Conditionally shown fields for dropdown items
        {
          name: 'children',
          type: 'array',
          label: 'Elementi spustnega menija',
          minRows: 1,
          admin: {
            condition: (_: any, siblingData: NavItemSiblingData) => siblingData.hasChildren ?? false,
            description: 'Dodajte elemente za spustni meni.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Naslov elementa',
              required: true,
              localized: true,
            },
            {
              name: 'href',
              type: 'text',
              label: 'Povezava elementa',
              required: true,
               admin: {
                 description: 'Vnesite ciljno pot, npr. /storitve/rezanje-betona.',
               }
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Opis elementa',
              required: true,
              localized: true,
              admin: {
                description: 'Kratek opis, ki se prikaže v spustnem meniju.',
              }
            },
            {
              name: 'icon',
              type: 'select',
              label: 'Ikona elementa (neobvezno)',
              options: iconOptions,
              admin: {
                description: 'Izberite ikono, ki se prikaže ob elementu v spustnem meniju.',
              }
            },
          ],
        },
      ],
    },
    // --- Main CTA Button ---
    {
        name: 'mainCta',
        label: 'Glavni CTA Gumb (v navigaciji)',
        type: 'relationship',
        relationTo: 'ctas',
        required: false,
        admin: {
          description: 'Izberite CTA gumb, ki bo prikazan v navigaciji.',
        }
    }
  ],
}; 